const mongoose=require('mongoose');


const studentSchema=new mongoose.Schema({
    // name rollno password sClassName school role examResult attendance
    name:{
        type:String,
        required:true
    },
    rollno:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    sClassName:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'sClass', 
        required:true
    },
    school:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'admin',
        required:true
    },
    role:{
        type:String ,
        default:"student"

    }, 
    examResult:[{
        subName:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'subject'
        },
        marksObtained:{
            type:Number,
            default:0
        }
    }],
    attendance:[{
        date:{
            type:Date,
            required:true
        },
        status:{
            type:String,
            enum:['present','absent'],
            required:true
        },
        subName:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'subject',
            required:true
            
        }


    }]
});


module.exports=mongoose.model("student",studentSchema);