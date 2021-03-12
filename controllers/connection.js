const mongoose = require('mongoose');

// Connect to MG
const URL = "mongodb+srv://@teamme.slppz.mongodb.net/db?retryWrites=true&w=majority";
const connectDB = async () => {
    await mongoose.connect(URL,{
        dbName: 'db',
        user: 'smonajemi',
        pass: 'Hadis',
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connected to DataBase.");
    }).catch((error) => console.log(error.message));
};

exports.default = connectDB();