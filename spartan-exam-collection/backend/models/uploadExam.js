const mongoose=require('mongoose');

const uploadExamSchema=mongoose.Schema({
    fileLocation: {type:String,required:true},
    uploadId: {type:String,required:true},
    title: {type:String,required:true},
    description: String,
    processImage : Boolean,
    imageProcessed : Boolean,
    tags : String
})

module.exports=mongoose.model('uploadexam',uploadExamSchema);