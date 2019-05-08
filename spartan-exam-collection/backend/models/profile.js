const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId : String,
    fname: String,
    lname: String,
    email: String,
    image: String,
    bookmarked : [String]
  
   });

module.exports = mongoose.model('Profile', profileSchema);