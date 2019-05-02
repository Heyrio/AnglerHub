const express = require('express');
const app = express();
const mongoose = require('mongoose');

const URI = 'mongodb+srv://heyrio:pass@cluster0-7cpbz.mongodb.net/test?retryWrites=true'

mongoose.connect(URI, {useNewUrlParser: true}).then(()=>{
    console.log('Database connected...')
}).catch((err)=>{
    console.log(err);
})