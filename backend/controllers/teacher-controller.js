const Teacher=require("../models/teacherSchema.js");
const Subject=require("../models/subjectSchema.js");
const bcrypt=require("bcrypt");



const teacherRegister=async (req,res)=>{
    const{name,email,password,role,school,teachSubject,teachSClass,attendance}=req.body;
    try {
        const salt=await bcrypt.genSalt(10);
        const hashedPass=await bcrypt.hash(password,salt);
        const teacher=new Teacher({name,email,password:hashedPass,role,school,teachSubject,teachSClass,attendance});
    
        const existingTeacherByEmail=await Teacher.findOne({email});
        if(existingTeacherByEmail){
            res.send({Message:"Email already exists"});
        }
        else {
            let result=await teacher.save();
            await Subject.findByIdAndUpdate(teachSubject,{teacher:teacher._id});
            result.password=undefined;
            res.send(result);
        }
    } catch (err){
        res.status(500).json(err);
    }
};

const teacherLogIn=async (req,res)=>{
    try {
        let teacher=await Teacher.findOne({email:req.body.email})
        if(teacher){
            const validated=await bcrypt.compare(req.body.password,teacher.password)
            if(validated){
                teacher=await teacher.populate("school","schoolName");
                teacher=await teacher.populate("teachSubject","subName sessions");
                teacher=await teacher.populate("teachSClass","sClassName");
                teacher.password=undefined;
                res.send(teacher);
            }
            else {
                res.send({Message:"Invalid password"})
            }
        }
        else{
            res.send({Message:"Teacher not found"})
        }
    } catch (err){
        res.status(500).json(err);
    }
};

const getTeachers=async (req,res)=>{
    try {
        let teachers=await Teacher.find({school:req.params.id})
        .populate("teachSubject","subName")
        .populate("teachSClass","sClassName");
    
        if(teachers.length>0){
            let modifiedTeachers=teachers.map((teacher)=>{
                return {...teacher._doc,password:undefined};
            });
            res.send(modifiedTeachers);
        } else {
            res.send({Message:"No Teachers found"});
        }
    } catch (err){
        res.status(500).json(err);
    }
};

const getTeacherDetail=async (req,res)=>{
    try {
        let teacher= await Teacher.findById(req.params.id)
    .populate("school","schoolName")
    .populate("teachSubject","subName sessions")
    .populate("teachSClass","sClassName");
    if(teacher){
        teacher.password=undefined;
        res.send(teacher);
    }
    else {
        res.send({Message:"No teacher found"});
    }
    } catch (err){
        res.status(500).json(err);
    }
};

const updateTeacherSubject=async (req,res)=>{
    const { _id, teachSubject } = req.body;
    try {
        let updatedTeacher=await Teacher.findByIdAndUpdate(_id, {teachSubject},{new:true});

        await Subject.findByIdAndUpdate(teachSubject,{teacher:updatedTeacher._id})
        res.send(updatedTeacher);
    } catch (err){
        res.status(500).json(err);
    }
};

const deleteTeacher=async (req,res)=>{
    try{
        let deletedTeacher=await Teacher.findByIdAndDelete(req.params.id)

        await Subject.findOneAndUpdate(
        {teacher:deletedTeacher._id,teacher:{$exists:true}},
        {$unset: {teacher:""}}
    );
    console.log("deleted teacher",deletedTeacher);
    res.send(deletedTeacher);
    } catch (err){
        res.status(500).json(err);
    }
};

const deleteTeachers=async (req,res)=>{
    try {
        const deletedTeachers=await Teacher.find({school:req.params.id});
        const teachersId=deletedTeachers.map(teacher=>teacher._id);
        const deletionResult=await Teacher.deleteMany({school:req.params.id});

        if(deletionResult.deletedCount===0){
            res.send({Message:"No teachers found to delete"});            
        }
        else {       
            
    
            await Subject.updateMany(
                {teacher:{$in:teachersId},teacher:{$exists:true}},
                {$unset:{teacher:""}}
            );  
            res.send(deletionResult);  
        }
    } catch (err){
        res.status(500).json(err);
    }   
};

const deleteTeachersByClass=async (req,res)=>{
    try {
        const deletedTeachers=await Teacher.find({teachSClass:req.params.id});
        const teachersId=deletedTeachers.map(teacher=>teacher._id);
        const deletionResult=await Teacher.deleteMany({teachSClass:req.params.id});
    
        if(deletionResult.deletedCount===0){
            res.send({Message:"No Teachers found to delete"});
        }
        else {
            await Subject.updateMany(
                {teacher:{$in:teachersId},teacher:{$exists:true}},
                {$unset:{teacher:""}}
            );
            res.send(deletionResult);
        }
    } catch (err){
        res.status(500).json(err);
    }
};

const teacherAttendance=async (req,res)=>{
    try {
        const {status,date}=req.body;
        const teacher=await Teacher.findById(req.params.id)
    
        if(!teacher){
            return res.send({Message:"No teacher found"});
        }
        const existingAttendance=teacher.attendance.find((a)=>
            a.date.toString()===new Date(date).toString()
        );
        if(existingAttendance){
            existingAttendance.status=status;
        } else {
            teacher.attendance.push({date,status});
        }
        const result=await teacher.save();
        return res.send(result);
    } catch (err){
        res.status(500).json(err);
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};


