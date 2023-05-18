

// Import the MongoDB Node.js driver
const { MongoClient } = require('mongodb');


// Connection URI for MongoDB Atlas
const uri = 'mongodb+srv://ATLAS_DB_USERNAME:ATLAS_DB_USERNAME@cluster0.tszy7rn.mongodb.net/NewJourney?retryWrites=true&w=majority';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB Atlas
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');

    // Get a reference to the MongoDB collection
    const collection = client.db('NewJourney').collection('Languages');

    // Fetch the documents from the collection
    collection.find().toArray((err, documents) => {
        if (err) {
            console.error('Failed to fetch documents:', err);
            return;
        }

        // Loop through each document and get its string fields
        const values = [];
        documents.forEach((doc) => {
            for (const key in doc) {
                if (typeof doc[key] === 'string') {
                    values.push(doc[key]);
                }
            }
        });

        values.sort();

        // Populate the dropdown with the values
        const dropdown = document.getElementById('languageDropdown');
        values.forEach((value) => {
            const option = document.createElement('option');
            option.text = value;
            dropdown.add(option);
        });
    });
    } catch (error) {
        console.error('Failed to connect to MongoDB Atlas:', error);
    } finally {
        // Close the connection when done
        await client.close();
        console.log('Disconnected from MongoDB Atlas');
    }
}

connectToDatabase();
