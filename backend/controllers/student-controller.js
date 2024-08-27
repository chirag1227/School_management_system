const bcrypt=require('bcrypt');
const Student=require("../models/studentSchema.js");
const Subject = require('../models/subjectSchema.js');
const SClass=require('../models/sClassSchema.js');



const studentRegister= async (req,res)=>{
    try {
        console.log("Request Body:", req.body);  // Log the entire request body
        console.log("school ID:", req.body.school);  // Specifically log the schoolID

    
    const salt=await bcrypt.genSalt(10);
    const hashedPass=await bcrypt.hash(req.body.password,salt);

    const existingStudent = await Student.findOne({
        rollno: req.body.rollno,
        school: req.body.school,
        sclassName: req.body.sClassName
    });


        if(existingStudent){
            res.send({message:"Roll number already exists"})
            return;
        }
        
        const student=new Student({
             ...req.body,
             school:req.body.school,
             password:hashedPass
            });
        
        let result= await student.save();
        res.send(result);

    } catch (err){
        res.status(500).json(err);
        return;
    }
};


const studentLogIn=async (req,res)=>{                                                                             
    try {        
        let student=await Student.findOne({rollno:req.body.rollno, name:req.body.name})        
    if(student){
        const validated=await bcrypt.compare(req.body.password,student.password);        
        if(validated){            
            try {
                await student.populate("school", "schoolName");               
                await student.populate("sClassName", "sClassName");             
                
            }  catch (error) {
                    console.error("Error during population:", error);
                    res.status(500).json({ message: "Population failed", error });
                    return;
            }           
            student.password=undefined;
            student.examResult=undefined;
            student.attendance=undefined;           
            res.send(student);
            
        }
        else {
            res.send({message:"Invalid Password"});
        }
    }
    else {
        res.send({message:"Student not found"});
    }
    } catch(err){
        res.status(500).json(err);
    }
};


const getStudents=async (req,res)=>{
    try {
        let students=await Student.find({school:req.params.id})
                                .populate("sClassName","sClassName");
        console.log("Querying with school ID:", req.params.id);
        console.log("populated students",students);
          
        if(students.length>0){
            let modifiedStudents=students.map((student)=>{
                return {...student._doc,password:undefined};
            });
            res.send(modifiedStudents);
        }
        else{
            res.send({message:"No student found"});
        }
    } catch (err){
        res.status(500).json(err);
    }
}

const getStudentDetail=async (req,res)=>{
    try {
        let student=await Student.findById(req.params.id)
        .populate("school","schoolName")
        .populate("sClassName","sClassName")
        .populate("examResult.subName","subName")
        .populate("attendance.subName","subName sessions");

        if(student){
            student.password=undefined;
            res.send(student)
        }
        else {
            res.send({Message:"No student found"})
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteStudent=async (req,res)=>{
    try {
        const result=await Student.findByIdAndDelete(req.params.id)
        res.send(result);
    } catch(err){
        res.status(500).json(err);
    }
}

const deleteStudents=async (req,res)=>{
    try {
        const result=await Student.deleteMany({school:req.params.id})
        if(result.deletedCount===0){
            res.send({Message:"No students found to delete"})
        }
        else {
            res.send(result);
        }
    } catch (err){
        res.status(500).json(err);
    }
};

const deleteStudentsByClass=async (req,res)=>{
    try {
        const result=await Student.deleteMany({sClassName:req.params.id});
    if(result.deletedCount===0){
        res.send({Message:"No student found to delete"})
    }
    else {
        res.send(result);
    }
    } catch (err){
        res.status(500).json(err);
    }
}


const updateStudent=async(req,res)=>{
    try {
        if(req.body.password){
            const salt=await bcrypt.genSalt(10);
            req.body.password=await bcrypt.hash(req.body.password,salt)
        }
        let result=await Student.findByIdAndUpdate(req.params.id,
            {$set:req.body},
            {new:true});
            result.password=undefined;
            res.send(result)
    } catch (err){
        res.status(500).json(err);
    }
}

const updateExamResult=async (req,res)=>{
    const {subName,marksObtained}=req.body;
    try {    
        console.log("Received data:", req.body);   
    const student=await Student.findById(req.params.id);

    if(!student){
        console.log("No student found with ID:", req.params.id);
        return res.send({Message:"No student found"});
    }
    const existingResult = student.examResult.find(
        (result) => result.subName && result.subName.toString() === subName
    );
    if(existingResult){
        
        console.log("Existing result found. Updating marks.");
        console.log("Old marksObtained:", existingResult.marksObtained);
        existingResult.marksObtained=marksObtained;
        console.log("New marksObtained:", marksObtained);
    } else {
        console.log("No existing result found. Adding new result.");
        student.examResult.push({subName,marksObtained});
        return;
    }
    const result=await student.save();
    console.log("Updated student record:", result);
    res.send(result);
    } catch (err){
        console.error("Error updating exam result:", err);
        res.status(500).json(err);
    }
};

const studentAttendance=async (req,res)=>{
    try {
        const {date,status,subName}=req.body;
        const student=await Student.findById(req.params.id);
    
        if(!student){
            return res.send({Message:"No Student found"})
        }
        const existingAttendance=await student.attendance.find((a)=>{
            return a.subName.toString()===subName && a.date.toDateString()===new Date(date).toDateString()
        });
        if(existingAttendance){
            existingAttendance.status=status;
        } else {
               attendedSessions=student.attendance.filter((a)=>a.subName.toString()===subName).length;           
        
            if (attendedSessions>=student.sessions){
                res.send({message:"Maximum limit for attendance reached"});
            }        
            else{
                return student.attendance.push({date,status,subName});
            } 
        }
            const result=await student.save();
            res.send(result);   
    } catch (err){
        res.status(500).json(err);
    }
};

const clearAllStudentsAttendanceBySubject=async (req,res)=>{
    const subName=req.params.id;
   
    try {

    const result=await Student.updateMany(
        {'attendance.subName':subName},
        {$pull:{attendance:{subName}}}
    );
    res.send(result);
   } catch (err){
    res.status(500).json(err);
   }
};

const clearAllStudentsAttendance=async (req,res)=>{
    const schoolId=req.params.id;

    try {       

        const result=await Student.updateMany(
         {school:schoolId},
         {$set:{attendance:[]}}
        );
        res.send(result);
    } catch(err){
        res.status(500).json(err);
    }

}

const removeStudentAttendanceBySubject=async (req,res)=>{
    const studentId=req.params.id;
    const subName=req.body.subId;

    try {
        const result=await Student.updateOne(
            {_id:studentId},
            {$pull:{attendance:{subName:subName}}}
        );
        return res.send(result);
    
    } catch(err){
        res.status(500).json(err);
    }
 
};

const removeStudentAttendance=async (req,res)=>{
    const studentId=req.params.id;
    console.log("studentId",studentId)
    try {
        const result=await Student.updateOne(
            {_id:studentId},
            {$set:{attendance:[]}}
        );
        console.log("received result",result)
        return res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

module.exports={
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance
};
