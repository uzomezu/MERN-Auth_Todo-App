//https://appdividend.com/2018/07/18/react-redux-node-mongodb-jwt-authentication/#React_Redux_Node_MongoDB_JWT_Authentication
//Auth based off this tutorial
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const userRoutes = require('./backend/routes/user.routes');
const todoRoutes = require('./backend/routes/todo.routes');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//PASSPORT
app.use(passport.initialize());
require('./backend/middlewear/passport')(passport);
//
// mongoDB
const mongodbUrl = process.env.MONGO_URI; 
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(()=>{console.log('MongoDb is connected!')})
  .catch((error) => console.log(error.reason));



/// ROUTES GO HERE 

app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

///


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`App is running on port %s`, PORT);
})