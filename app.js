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
    if (req.session.GLOBAL_AUTHENTICATED) {
        res.redirect('/main');
    } else {
        res.render('./index.ejs', { user: req.session.GLOBAL_AUTHENTICATED });
    }
});

function populateErrorPage(res, error_code, error_message, error_response, error_redirect = undefined, error_redirect_button = undefined) {

    res.render('errorGeneral.ejs', {
        error_code: error_code,
        error_message: error_message,
        error_response: error_response,
        error_redirect: error_redirect,
        error_redirect_button: error_redirect_button
    });

}


app.get('/signup', (req, res) => {
    console.log("app.get(\'\/createUser\'): Current session cookie-id:", req.cookies)
    if (req.session.GLOBAL_AUTHENTICATED) {
        console.log("app.get(\'\/signup\'): User already logged in, redirecting to /main")
        res.redirect('/main');
    } else {
        res.render('./signup.ejs');
    }
})

app.post('/signup', async (req, res) => {
    console.log("app.post('/signup'): ", req.body)
    const schemaCreateUser = Joi.object({
        username: Joi.string()
            .alphanum()
            .max(30)
            .trim()
            .min(1)
            .strict()
            .required(),
        password: Joi.string().required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ca'] } })
            .required(),
    })
    try {
        const resultUsername = await schemaCreateUser.validateAsync(req.body);
    } catch (err) {
        if (err.details[0].context.key == "username") {
            console.log(err.details)

            return populateErrorPage(
                res, // res
                '422', // error_code
                'Error: Username can only contain letters and numbers and must not be empty.', // error_message
                'Please try again.', // error_response
                '/signup', // error_redirect
                'Try Again' // error_redirect_button
            );

        }
        if (err.details[0].context.key == "password") {
            console.log(err.details)

            return populateErrorPage(
                res, // res
                '422', // error_code
                'Error: Password did not meet requirements.', // error_message
                'Please try again.', // error_response
                '/signup', // error_redirect
                'Try Again' // error_redirect_button
            );
        }
    }
    const userresult = await usersModel.findOne({
        username: req.body.username
    })

    const emailresult = await usersModel.findOne({
        email: req.body.Email
    })

    if (userresult) {

        populateErrorPage(
            res, // res
            '409', // error_code
            'Error: User already exists', // error_message
            'Please try again', // error_response
            '/signup', // error_redirect
            'Try Again' // error_redirect_button
        );

    } else if (emailresult) {
            
        populateErrorPage(
            res, // res
            '409', // error_code
            'Error: Email already exists.', // error_message
            'Please try again.', // error_response
            '/signup', // error_redirect
            'Try Again' // error_redirect_button
        );

    } else {
        // If user does not exist, create a new user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new usersModel({
            username: req.body.username,
            password: hashedPassword,
            type: "non-administrator",
            email: req.body.Email,
            city: req.body.city
        })
        req.session.GLOBAL_AUTHENTICATED = true;
        req.session.loggedUsername = req.body.username;
        req.session.loggedPassword = hashedPassword;
        req.session.loggedType = "non-administrator";
        req.session.loggedEmail = req.body.Email;
        req.session.loggedCity = req.body.city;
        await newUser.save();
        console.log(`New user: ${newUser}`);
        console.log("app.post(\'\/signup\'): New user created, redirecting to /main")
        res.redirect('/main');
    }
})

app.get('/login', (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {
        console.log("app.get(\'\/login\'): User already logged in, redirecting to /main");
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

        console.log("app.post('/login'): ", err.details);

        return populateErrorPage(
            res, // res
            '401', // error_code
            `Error: ${err.details[0].message}.`, // error_message
            'Please try again.', // error_response
            '/login', // error_redirect
            'Try Again' // error_redirect_button
        );

    }

    const userresult = await usersModel.findOne({
        username: req.body.username
    });

    if (userresult && bcrypt.compareSync(req.body.password, userresult.password)) {
        req.session.GLOBAL_AUTHENTICATED = true;
        req.session.loggedUsername = req.body.username;
        req.session.loggedPassword = userresult.password;
        req.session.loggedType = userresult?.type;
        req.session.loggedEmail = userresult.email;
        req.session.loggedCity = userresult.city;
        console.log("Login successful");
        console.log("app.post(\'\/login\'): Variable Global_Authenticated:", req.session.GLOBAL_AUTHENTICATED);
        console.log("app.post(\'\/login\'): Current session cookie:", req.cookies);
        res.redirect('/main');
    } else {
        console.log("app.post('/login'): Invalid username or password");  
        populateErrorPage(
            res, // res
            '401', // error_code
            'Error: Invalid username or password.', // error_message
            'Please try again.', // error_response
            '/login', // error_redirect
            'Try Again' // error_redirect_button
        );
    }
});


// Route: settings page
app.get('/settings', (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {
        res.render('./settings.ejs', { username: req.session.loggedUsername, email: req.session.loggedEmail, city: req.session.loggedCity });
    } else {
        res.render('error401');
    }
});

// Route: main page
app.get('/main', (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {
        console.log("app.get('/main'): Current session cookie:", req.cookies);
        console.log("app.get('/main'): Current user:", req.session.loggedUsername);
        res.render('./main.ejs', {
            username: req.session.loggedUsername,
        });
    }
    else {
        console.log("app.get('/main'): Error with authenticating: ", req.session.GLOBAL_AUTHENTICATED);
        res.render('error401');
    }
});

app.post('/bookmarkRoadmap', async (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {

        const user = await usersModel.findOne({ username: req.session.loggedUsername });

        if (!user) {
            return populateErrorPage(
                res, // res
                '404', // error_code
                'Error: User does not exist.', // error_message
                'Please Log In.', // error_response
                '/login', // error_redirect
                'Log In' // error_redirect_button
            );
        }

        const roadmap = req.body;
        console.log(roadmap);
        let roadmapId = crypto.randomBytes(32).toString("hex");
        roadmap._id = roadmapId;
        roadmap.additionalSteps = [];


        await usersModel.updateOne(
            { _id: user._id },
            { $push: { savedRoadmaps: roadmap } }
        );

        console.log("Roadmap saved to user account");
        console.log(user);
        console.log(user.savedRoadmaps);

        // res.redirect('/savedRoadmaps');

        const responseData = { message: 'Server response', data: roadmapId };

        // Send the response back to the client
        res.json(responseData);
    }
    else {
        populateErrorPage(
            res, // res
            '401', // error_code
            'Error: You are not logged in', // error_message
            'Please Log In', // error_response
            '/login', // error_redirect
            'Log In' // error_redirect_button
        );
    }
});

app.post('/sendAdditionalRequest', async (req, res) => {

    if (req.session.GLOBAL_AUTHENTICATED) {

        const user = await usersModel.findOne({ username: req.session.loggedUsername });

        if (!user) {
            return populateErrorPage(
                res, // res
                '404', // error_code
                'Error: User does not exist.', // error_message
                'Please Log In.', // error_response
                '/login', // error_redirect
                'Log In' // error_redirect_button
            );
        }

        const parentRoadmapId = req.body.roadmapId;
        let prefix = "How to ";
        const additionalSteps = prefix.concat(req.body.additionalSteps);
        console.log(additionalSteps);

        let returnMessage = await getMessage(additionalSteps, req.session.loggedCity);

        if (returnMessage.error !== undefined) {
            console.log(returnMessage.error);
            return populateErrorPage(
                res, // res
                returnMessage.error.code || "500",// error_code
                returnMessage.error.message || "Internal Server Error", // error_message
                returnMessage.error.type || "Please Try Again", // error_response
                '/main', // error_redirect
                'Try Again' // error_redirect_button
            );
        }

        let roadmapObject = createRoadmapObject(returnMessage.choices[0].message.content);


        res.render('./main.ejs', {
            //create an array the size of the number of steps in the roadmap
            //fill the array with true values
            //this is used to set the checkboxes to true by default

            //only display steps that are not undefined
            steps: roadmapObject.steps.filter(step => step !== undefined),
            checkboxStates: Array(roadmapObject.steps.length).fill(false),
            roadmap: JSON.stringify(roadmapObject),
            title: roadmapObject.title,
            description: roadmapObject.description,
            parentRoadmapId: parentRoadmapId
        });


    }
    else {
        res.redirect('/login');
    }
});

// Interface with OpenAI API
async function getMessage(message, userCity) {
    console.log('clicked');
    let city = userCity;
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
                content: `Please give me a step by step guide on ${message} in ${city}, BC Canada in the form of (with no preambles or postambles):
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
        return {error: error};
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

    let returnMessage = await getMessage(userInput, req.session.loggedCity);

    if (returnMessage.error !== undefined) {
        console.log(returnMessage.error);
        return populateErrorPage(
            res, // res
            returnMessage.error.code || "500",// error_code
            returnMessage.error.message || "Internal Server Error", // error_message
            returnMessage.error.type || "Please Try Again.", // error_response
            '/main', // error_redirect
            'Try Again' // error_redirect_button
        );
    }


    let roadmapObject = createRoadmapObject(returnMessage.choices[0].message.content);


    console.log(roadmapObject)
    res.render('./main.ejs', {
        //create an array the size of the number of steps in the roadmap
        //fill the array with true values
        //this is used to set the checkboxes to true by default

        //only display steps that are not undefined
        steps: roadmapObject.steps.filter(step => step !== undefined),
        checkboxStates: Array(roadmapObject.steps.length).fill(false),
        roadmap: JSON.stringify(roadmapObject),
        title: roadmapObject.title,
        description: roadmapObject.description
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
            html: payload,
            attachments: [
                {
                    filename: 'LogoHeaderBar.png',
                    path: `${__dirname}/./public/LogoHeaderBar.png`,
                    cid: 'logo1'
                }
            ]
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response + ' to ' + email);
            }
        });
    } catch (error) {
        return error;
    }
};

app.post('/sendResetEmail', async (req, res) => {
    const email = req.body.inputEmail;
    console.log(email);

    const user = await usersModel.findOne({ email: email });

    console.log(user);
    if (!user) {
        return res.render('error502usernotexist.ejs');
    } else {
        try {
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

            const emailBody = `Hello ${user.username}! You can reset your password using the link: `;

            ejs.renderFile('views/components/emailtemplate.ejs', { emailBody: emailBody, resetLink: link }, async function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }

                await sendResetEmail(user.email, data);

                res.render('200emailsuccess.ejs', {reset: true})

            });
        } catch (error) {
            console.log(error);
            return populateErrorPage(
                res, // res
                "501",// error_code
                "Email not sent.", // error_message
                "Please Try Again.", // error_response
                '/resetPassword', // error_redirect
                'Try Again' // error_redirect_button
            );

        }
    }
});



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
        return populateErrorPage(
            res, // res
            '400 ', // error_code
            'Error: Passwords do not match.', // error_message
            'Please Retry with Your Email Link.', // error_response
        );

    }

    const user = await usersModel.findOne({ _id: id });
    if (!user) {
        return populateErrorPage(
            res, // res
            '404', // error_code
            'Error: User does not exist.', // error_message
            'Please Retry with Your Email Link.', // error_response
        );
    }

    const tokenDoc = await tokenModel.findOne({ userId: user._id });
    if (!tokenDoc) {
        return populateErrorPage(
            res, // res
            '403', // error_code
            'Error: Reset Token does not exist or has expired.', // error_message
            'Your password reset link has expired. Please resubmit your email address to receive a new password reset link.', // error_response
            '/resetPassword', // error_redirect
            'Get New Reset Link' // error_redirect_button
        );

    }

    const isValid = await bcrypt.compare(token, tokenDoc.token);
    if (!isValid) {
        return populateErrorPage(
            res, // res
            '403', // error_code
            'Error: Reset Token does not exist or has expired.', // error_message
            'Your password reset link has expired. Please resubmit your email address to receive a new password reset link.', // error_response
            '/resetPassword', // error_redirect
            'Get New Reset Link' // error_redirect_button
        );
    }

    const hashedPassword = await bcrypt.hash(newPassword, Number(bcryptSalt));

    await usersModel.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
    );

    await tokenModel.deleteOne({ userId: user._id });

    res.redirect('/login');

});

app.get('/newpassword', (req, res) => {
    res.render('./newpassword.ejs')
})

app.get('/savedRoadmaps', async (req, res) => {

    if (req.session.GLOBAL_AUTHENTICATED) {

        const user = await usersModel.findOne({ username: req.session.loggedUsername });

        if (!user) {
            return populateErrorPage(
                res, // res
                '404', // error_code
                'Error: User does not exist.', // error_message
                'Please register or login to continue.', // error_response
                '/login', // error_redirect
                'Log In' // error_redirect_button
            );
        }

        const roadmapsList = user.savedRoadmaps;

        console.log(roadmapsList);

        res.render('./savedRoadmaps.ejs', { savedList: roadmapsList });

    }
    else {
        populateErrorPage(
            res, // res
            '401', // error_code
            'Error: You are not logged in', // error_message
            'Please Log In', // error_response
            '/login', // error_redirect
            'Log In' // error_redirect_button
        );
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

        //find the user who owns the roadmap
        const mapOwner = users.find(user => user.savedRoadmaps.includes(map));

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

        // console.log(steps);

        //check which user is logged in
        if (!req.session.GLOBAL_AUTHENTICATED) {
            res.render('error403');
        }

        let userOwnsMap;
        //check if user owns the roadmap
        if (req.session.loggedUsername == mapOwner.username) {
            userOwnsMap = true;
        }
        else {
            userOwnsMap = false;
        }


        res.render('./trackProgress.ejs', { mapid: req.query.id, steps: steps, checkboxStates: checkboxStates, title: map.title, description: map.description, userOwnsMap: userOwnsMap });
    } catch (err) {
        console.error(err);
        res.render('error500progressnotsaved');
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
            res.render('error403');
        }

        //check if user owns the roadmap
        if (user.username !== req.session.loggedUsername) {
            res.render('error403');
        }

        //update the roadmap with the new checkbox states
        await usersModel.updateOne(
            { _id: user._id, "savedRoadmaps._id": mapid },
            { $set: { "savedRoadmaps.$.steps": map.steps.map((step, i) => ({ step: step.step, checked: checkboxStates[i] })) } }
        );

    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error, Please try again later');
    }

    res.status(200).send('Progress saved successfully');
});

app.post('/saveCopy', async (req, res) => {
    console.log(req.body);
    // check that the user is logged in
    if (!req.session.GLOBAL_AUTHENTICATED) {
        res.render('error403');
    }

    //grab the roadmap from the request body
    const roadmap = req.body.roadmap;

    //generate a random id for the roadmap
    let roadmapId = crypto.randomBytes(32).toString("hex");
    roadmap._id = roadmapId;

    //grab the user from the database
    const user = await usersModel.findOne({ username: req.session.loggedUsername });

    if (!user) {
        throw new Error("User does not exist");
    }

    //add the roadmap to the user's savedRoadmaps array
    await usersModel.updateOne(
        { _id: user._id },
        { $push: { savedRoadmaps: roadmap } }
    );

    console.log("Roadmap saved to user account");

    res.status(200).send('Roadmap saved successfully');
});

app.post('/deleteBookmark', async (req, res) => {
    if (req.session.GLOBAL_AUTHENTICATED) {
        const savedRoadmapId = req.body.mapid;
        console.log(savedRoadmapId);
        const user = await usersModel.findOne({ username: req.session.loggedUsername });

        if (!user) {
            return res.render('error502usernotexist.ejs');
        }

        await usersModel.updateOne(
            { _id: user._id },
            { $pull: { savedRoadmaps: { _id: savedRoadmapId } } }
        );

        console.log("Roadmap deleted from user account");
        res.status(200).send('Bookmark deleted successfully');

    }
})

// Route: logout 
app.post('/logout', function (req, res, next) {
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
const sendShareEmail = async (email, payload, req) => {
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
            subject: `${req.session.loggedUsername} sent you a helpful Roadmap!`,
            html: payload,
            attachments: [
                {
                    filename: 'LogoHeaderBar.png',
                    path: `${__dirname}/./public/LogoHeaderBar.png`,
                    cid: 'logo1'
                }
            ]
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response + ' to ' + email);
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
        const emailBody = "I'm using this awesome app to track my progress on my roadmap. Check it out here: "
        const emailLink = req.body.inputShareMapLink;

        console.log(emailLink);
        console.log(recipient);

        ejs.renderFile('views/components/emailtemplate.ejs', { emailBody: emailBody, mapLink: emailLink }, async function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            await sendShareEmail(recipient, data, req); // Use the rendered template content

            res.render('200emailsuccess.ejs');
        });
    } catch (error) {
        console.log(error);
        res.render('error501emailnotsent.ejs');
    }
});




module.exports = app;