const mongoose=require('mongoose');

const uploadExamSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    filelocation:String,
    filename:String
    
})

module.exports=mongoose.model('uploadexam',uploadExamSchema);