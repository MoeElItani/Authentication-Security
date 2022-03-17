require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Start
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: [ 'password' ] });

const User = new mongoose.model('User', userSchema);
// MongoDB End

app.get('/', (req, res) => {
  res.render('home');
});

// register Start
app.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });

    newUser.save((err) => {
      if (!err) {
        res.render('secrets')
      } else {
        console.log(err);
      }
    })
  });
// register End

// login Start
app.route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res) => {
    const username = req.body.username;
    const pass = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
      if (!err) {
        if (foundUser) {
          if (foundUser.password === pass) {
            res.render('secrets');
          } else {
            console.log('wrong email or password');
          }
        } else {
          console.log('wrong email or password');
        }
      } else {
        console.log(err);
      }
    })
  });
// login End

app.get('/logout', (req, res) => {
  res.render('home');
});


app.listen(3000, () => {
  console.log(`--- Server Started on Port 3000 ---`);
});