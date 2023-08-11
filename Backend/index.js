
const dotenv = require('dotenv');
const express = require('express')
const UserController = require('./Controller/UserController')
const app = express()
const mongoose = require('mongoose')
dotenv.config()



const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 3000


const {json} = require('body-parser')
var cors = require('cors');
app.use(json());
app.use(cors())

// base route
app.use("/", UserController);


const start = async () => {

    // mongoose connection
    mongoose.Promise = global.Promise;
    await mongoose.connect(MONGODB_URI);

    
    app.listen(PORT , async () => {
        console.log(`Server Connected To Port: ${PORT}`)
        
    });

};

start()
