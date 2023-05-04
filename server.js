const app = require('./app.js');
require('dotenv').config();

app.listen(process.env.PORT || 3000, () => {
    console.log(`server.js: Server is running on port 3000 and listening for HTTP requests`);
})
