const mongoose=require("mongoose");
const teacherSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        unique:true,
        required:true

    },
    password:{
        type:String,
        required:true

    },
    role:{
        type:String,
        default:"teacher" 

    },
    school:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'admin',
        required:true

    },
    teachSubject:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'subject',  
        
    }],
    teachSClass:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'sClass',
        required:true

    },
    attendance:[{
        date:{
            type:Date,
            required:true

        },
        presentCount:{
            type:String

        },
        absentCount:{
            type:String

        }
    },{timestamps:true}]
});

module.exports=mongoose.model("teacher",teacherSchema);