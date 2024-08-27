const mongoose=require("mongoose");

const subjectSchema=new mongoose.Schema({
    //subName subCode sessions sClassName school teacher
    subName:{
        type:String,
        required:true
    },
    subCode:{
        type:String,
        required:true 
    },
    sessions:{
        type:String,
        required:true
    },
    sClassName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'sClass',
        required:true        
    },
    school:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'admin'
    },
    teacher:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'teacher'
    }]
},{timestamps:true});

module.exports=mongoose.model("subject",subjectSchema);