const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  googleId: String,
  displayName: String,
  email: String,
  date: new Date()
})

mongoose.model('users', userSchema)
