const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fname: String,
    lname: String,
    email: String,
    image: String
  
   });

module.exports = mongoose.model('Profile', profileSchema);