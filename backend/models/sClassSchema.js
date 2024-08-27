const mongoose=require('mongoose');

const sClassSchema=new mongoose.Schema({
    sClassName:{
        type:String,
        required:true
    },
    school:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'admin',
        required:true
    }
},{timestamps:true});

module.exports=mongoose.model("sClass",sClassSchema);

