const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000
const uri = process.env.ATLAS_URI

app.use(cors())
app.use(express.json())

mongoose.set('strictQuery', false);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.once('open', function () {
    console.log('MongoDB connection successful');
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const usersRouter = require('./routes/users')
app.use('/users', usersRouter)



app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});