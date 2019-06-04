const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const keys = require('./config/keys')
const sslRedirect = require('heroku-ssl-redirect');
require('./models/user')
require('./services/passport')



mongoose.connect(keys.mongoURI, { useNewUrlParser: true })

const app = express()

app.use(sslRedirect())

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)
app.use(passport.initialize())
app.use(passport.session())

require('./routes/authroutes')(app)

//Configuration for Express to behave correctly in production environment
if (process.env.NODE_ENV === 'production') {
  //First - Making sure express will serve production assets - main.js, main.css, etc
  app.use(express.static('client/build'));
  //Second -Express will serve up the index.html file if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
};

//Dynamically figures out which port to listen to. If one hasn't been defined then by default use 5000
const PORT = process.env.PORT || 5000

//Instructs Express to tell Node to listen to PORT
app.listen(PORT);

