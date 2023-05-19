const express = require('express');
const app = express();
const session = require('express-session');
require('dotenv').config();
const API_KEY = process.env.OPENAI_API_KEY;
const usersModel = require('./models/users.js');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const ejs = require('ejs');
const { parse } = require('dotenv');



var nodemailer = require('nodemailer');
const tokenModel = require('./models/token.js');
const crypto = require("crypto");

const bcryptSalt = process.env.BCRYPT_SALT;

const fs = require("fs");
const path = require("path");
const clientURL = process.env.CLIENT_URL;


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.NODE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.ATLAS_DB_USERNAME}:${process.env.ATLAS_DB_PASSWORD}@${process.env.ATLAS_DB_HOST}/?retryWrites=true&w=majority`,
        // mongoUrl: `mongodb://127.0.0.1:27017/newjourney`,
        crypto: {
            secret: process.env.MONGO_SESSION_SECRET,
        },
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        dbName: 'sessionStoreDB',
        collectionName: 'sessions',
        ttl: 60 * 60 * 1, // 1 hour
        autoRemove: 'native'
    })
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"));
app.use(express.json())


app.get(['/', '/home'], (req, res) => {
    // if (req.session.GLOBAL_AUTHENTICATED) {
    res.render('./index.ejs');
    // }
});





app.get('/signup', (req, res) => {
    console.log("app.get(\'\/createUser\'): Current session cookie-id:", req.cookies)
    if (req.session.GLOBAL_AUTHENTICATED) {
        res.redirect('/main');
    } else {
        res.render('./signup.ejs');
    }
})

app.post('/signup', async (req, res) => {
    console.log(req.body)
    const schemaCreateUser = Joi.object({
        username: Joi.string()
            .alphanum()
            .max(30)
            .trim()
            .min(1)
            .strict()
            .required(),
        password: Joi.string()
            .required()
    })
    try {
        const resultUsername = await schemaCreateUser.validateAsync(req.body);
    } catch (err) {
        if (err.details[0].context.key == "username") {
            console.log(err.details)
            let createUserFailHTML = `
            <br />
            <h3>Error: Username can only contain letters and numbers and must not be empty - Please try again</h3>
            <input type="button" value="Try Again" onclick="window.location.href='/signup'" />
            `
            return res.send(createUserFailHTML)
        }
        if (err.details[0].context.key == "password") {
            console.log(err.details)
            let createUserFailHTML = `
            <br />
            <h3>Error: Password is empty - Please try again</h3>
            <input type="button" value="Try Again" onclick="window.location.href='/signup'" />
            `
            return res.send(createUserFailHTML)
        }
    }
    const userresult = await usersModel.findOne({
        username: req.body.username
    })
    if (userresult) {
        let createUserFailHTML = `
            <br />
            <h3>Error: User already exists - Please try again</h3>
            <input type="button" value="Try Again" onclick="window.location.href='/signup'" />
            `
        res.send(createUserFailHTML)
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new usersModel({
            username: req.body.username,
            password: hashedPassword,
            type: "non-administrator",
            email: req.body.Email
        })
        req.session.GLOBAL_AUTHENTICATED = true;
        req.session.loggedUsername = req.body.username;
        req.session.loggedPassword = hashedPassword;
        req.session.loggedType = "non-administrator";
        req.session.loggedEmail = req.body.Email;
        await newUser.save();
        console.log(`New user created: ${newUser}`);
        res.redirect('/main');
    }
})


app.get('/login', (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {
        res.redirect('/main');
    } else {
        res.render('login.ejs')
    }
});


app.post('/login', async (req, res) => {
    console.log(`Username entered: ${req.body.username}`);
    console.log(`Password entered: ${req.body.password}`);
    const schema = Joi.object({
        username: Joi.string()
            .required(),
        password: Joi.string()
            .required()
    })
    try {
        const value = await schema.validateAsync({ username: req.body.username, password: req.body.password });
    }
    catch (err) {
        console.log(err.details);
        console.log("Username or password is invalid")
        return
    }

    const userresult = await usersModel.findOne({
        username: req.body.username
    });
    console.log(userresult);
    if (userresult && bcrypt.compareSync(req.body.password, userresult.password)) {
        req.session.GLOBAL_AUTHENTICATED = true;
        req.session.loggedUsername = req.body.username;
        req.session.loggedPassword = userresult.password;
        req.session.loggedType = userresult?.type;
        req.session.loggedEmail = userresult.email;
        console.log("app.post(\'\/login\'): Current session cookie:", req.cookies)
        res.redirect('/main');
    } else {
        let loginFailHTML = `
        <br />
        <a href="/">Home</a>
        <h1>Invalid username or password</h1>
        <input type="button" value="Try Again" onclick="window.history.back()" />
        <br />
        `
        console.log("app.post(\'\/login\'): Current session cookie-id:", req.cookies)
        res.send(loginFailHTML);
    }
});


app.get('/settings', (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {
        res.render('./settings.ejs', { username: req.session.loggedUsername, email: req.session.loggedEmail });
    } else {
        res.render('error403');
    }
});

app.get('/main', (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {
        res.render('./main.ejs', {
            username: req.session.loggedUsername,
        });
    }
    else {
        res.render('error403');
    }
});

app.post('/bookmarkRoadmap', async (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {

        const user = await usersModel.findOne({ username: req.session.loggedUsername });

        if (!user) {
            throw new Error("User does not exist");
        }

        const roadmap = req.body;
        console.log(roadmap);
        let roadmapId = crypto.randomBytes(32).toString("hex");
        roadmap._id = roadmapId;


        await usersModel.updateOne(
            { _id: user._id },
            { $push: { savedRoadmaps: roadmap } }
        );

        console.log("Roadmap saved to user account");
        console.log(user);
        console.log(user.savedRoadmaps);

        // res.redirect('/savedRoadmaps');
    }
    else {
        // res.redirect('/login');
    }
});





// Interface with OpenAI API
async function getMessage(message) {
    console.log('clicked');
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: `Give me a step by step guide on ${message} the form of (with no preambles or postambles):
                Title: How to ...
                Description: A step by step guide on how to ...
                1. ...
                2. ...
                3. ...
                ...
                `
            }],
            max_tokens: 750,
        })
    }
    try {

        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

// Parse through API response to create roadmap object
function createRoadmapObject(message) {
    var roadmapObject = {
        title: "",
        description: "",
        steps: []
    };

    var messageArray = message.split("\n").filter(line => line.length > 0);
    roadmapObject.title = messageArray[0].split(": ")[1];
    roadmapObject.description = messageArray[1].split(": ")[1];


    for (var i = 2; i < messageArray.length; i++) {
        if (messageArray[i].split(". ")[1] !== undefined) {
            roadmapObject.steps.push(messageArray[i].split(". ")[1]);
        }
    }

    return roadmapObject;
}

// Send request to OpenAI API and return roadmap object
app.post('/sendRequest', async (req, res) => {
    var userInput = req.body.hiddenField || req.body.textInput;

    let returnMessage = await getMessage(userInput);
    let roadmapObject = createRoadmapObject(returnMessage.choices[0].message.content);

    console.log(roadmapObject)
    res.render('./main.ejs', {
        //create an array the size of the number of steps in the roadmap
        //fill the array with true values
        //this is used to set the checkboxes to true by default

        //only display steps that are not undefined
        steps: roadmapObject.steps.filter(step => step !== undefined),
        checkboxStates: Array(roadmapObject.steps.length).fill(true),
        roadmap: JSON.stringify(roadmapObject)
    });

});


// Start password reset process

app.get('/resetPassword', (req, res) => {
    res.render('resetPassword.ejs')
});

const sendResetEmail = async (email, payload) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_KEY
            }
        });

        var mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: 'Here is your password reset link!',
            text: payload
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        return error;
    }
}

app.post('/sendResetEmail', async (req, res) => {
    const email = req.body.inputEmail;
    console.log(email);

    const user = await usersModel.findOne({ email: email });

    console.log(user);
    if (!user) {
        throw new Error("User does not exist");
    }
    let token = await tokenModel.findOne({ userId: user._id });
    if (token) {
        await token.deleteOne()
    };

    let resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = await bcrypt.hash(resetToken, Number(bcryptSalt));



    await new tokenModel({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
    }).save();


    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
    sendResetEmail(user.email, link);



})

// Get new password

app.get('/passwordReset', async (req, res) => {
    const token = req.query.token;
    const id = req.query.id;

    res.render('./passwordReset.ejs', { token: token, id: id });
});

app.post('/confirmNewPassword', async (req, res) => {
    const token = req.body.token;
    const id = req.body.userID;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    console.log(token);
    console.log(id);
    console.log(newPassword);


    if (newPassword !== confirmPassword) {
        return res.send("Passwords do not match");
    }

    const user = await usersModel.findOne({ _id: id });
    if (!user) {
        return res.send("User does not exist");
    }

    const tokenDoc = await tokenModel.findOne({ userId: user._id });
    if (!tokenDoc) {
        return res.send("Invalid or expired token");
    }

    const isValid = await bcrypt.compare(token, tokenDoc.token);
    if (!isValid) {
        return res.send("Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, Number(bcryptSalt));

    await usersModel.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
    );

    await tokenModel.deleteOne({ userId: user._id });

    res.redirect('/login');

});


app.get('/passwordReset', (req, res) => {

    res.render('./savedRoadmaps.ejs', { savedList: roadmapsTemp });
});

app.get('/newpassword', (req, res) => {
    res.render('./newpassword.ejs')
})


app.get('/savedRoadmaps', async (req, res) => {

    if (req.session.GLOBAL_AUTHENTICATED) {

        const user = await usersModel.findOne({ username: req.session.loggedUsername });

        if (!user) {
            throw new Error("User does not exist");
        }

        const roadmapsList = user.savedRoadmaps;

        console.log(roadmapsList);

        res.render('./savedRoadmaps.ejs', { savedList: roadmapsList });

    }
    else {
        res.redirect('/login')
    }
});

app.get('/trackProgress', async (req, res) => {
    try {
        const users = await usersModel.find({}).exec(); // Fetch users from the database
        // console.log(users)

        const allSavedRoadMaps = [];

        users.forEach(user => {
            user.savedRoadmaps.forEach(roadmap => {
                allSavedRoadMaps.push(roadmap);
            })
        });

        // console.log(allSavedRoadMaps);

        const mapid = req.query.id;

        const map = allSavedRoadMaps.find(roadmap => roadmap._id === mapid);

        if (!map) {
            return res.status(404).send('Map ID not found');
        }

        const steps = [];

        map.steps.forEach(step => {
            steps.push(step.step);
        });

        const checkboxStates = [];

        map.steps.forEach(step => {
            checkboxStates.push(step.checked);
        });

        console.log(steps);

        res.render('./trackProgress.ejs', { mapid: req.query.id, steps: steps, checkboxStates: checkboxStates });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});

app.post('/saveProgress', async (req, res) => {
    console.log(req.body);
    //grab the map id from the request body
    const mapid = req.body.mapID;
    //grab the checkbox states from the request body
    const checkboxStates = req.body.checkboxStates;

    //get all users from the database
    try {
        const users = await usersModel.find({}).exec(); // Fetch users from the database
        // console.log(users)

        const allSavedRoadMaps = [];

        users.forEach(user => {
            user.savedRoadmaps.forEach(roadmap => {
                allSavedRoadMaps.push(roadmap);
            })
        }
        );

        // find the roadmap with the matching id
        const map = allSavedRoadMaps.find(roadmap => roadmap._id === mapid);

        //find the user who owns the roadmap
        const user = users.find(user => user.savedRoadmaps.includes(map));

        if (!map) {
            return res.status(404).send('Map ID not found');
        }

        //check if user is logged in
        if (!req.session.GLOBAL_AUTHENTICATED) {
            return res.status(401).send('Unauthorized');
        }

        //check if user owns the roadmap
        if (user.username !== req.session.loggedUsername) {
            return res.status(401).send('Unauthorized');
        }

        //update the roadmap with the new checkbox states
        await usersModel.updateOne(
            { _id: user._id, "savedRoadmaps._id": mapid },
            { $set: { "savedRoadmaps.$.steps": map.steps.map((step, i) => ({ step: step.step, checked: checkboxStates[i] })) } }
        );

    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }

    res.status(200).send('Progress saved successfully');
});

app.post('/deleteBookmark', async (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {
        const savedRoadmapId = req.body.mapid;
        console.log(savedRoadmapId);
        const user = await usersModel.findOne({ username: req.session.loggedUsername });

        if (!user) {
            throw new Error("User does not exist");
        }

        await usersModel.updateOne(
            { _id: user._id },
            { $pull: { savedRoadmaps: { _id: savedRoadmapId } } }
        );

        console.log("Roadmap deleted from user account");
        res.status(200).send('Bookmark deleted successfully');

    }
})

app.get('/logout', function (req, res, next) {
    console.log("Before Logout: Session User:", req.session.loggedUsername, "; ", "Session Password: ", req.session.loggedPassword);
    console.log("Logging out. . .")
    req.session.loggedUsername = null;
    req.session.loggedPassword = null;
    req.session.loggedEmail = null;
    req.session.GLOBAL_AUTHENTICATED = false;
    console.log("After Logout: Session User:", req.session.loggedUsername, "; ", "Session Password: ", req.session.loggedPassword);
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
})




// sending an sharing email

const sendShareEmail = async (email, payload) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_KEY
            }
        });

        var mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: 'Someone sent you a helpful Roadmap!',
            text: payload
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        return error;
    }
}



app.post('/sendShareEmail', async (req, res) => {
    console.log('Form submission received');
    try {
        const recipient = req.body.inputShareEmailToSend;

        const content = req.body.inputShareEmailContent;

        await sendShareEmail(recipient, content);

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});


// app.get("*", (req, res) => {
//     res.status(404).render('error404.ejs');
// });


module.exports = app;