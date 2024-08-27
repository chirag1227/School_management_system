const mongoose = require('mongoose');

const SClass=require('../models/sClassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');

const sclassCreate = async (req, res) => {
    try {
        const { sClassName, adminID } = req.body;
       
        if (!sClassName || !adminID) {
            return res.status(400).send({ message: "sClassName and adminID are required" });
        }
        
        if (!mongoose.Types.ObjectId.isValid(adminID)) {
            return res.status(400).send({ message: "Invalid admin ID format" });
        }

        const existingSclassByName = await SClass.findOne({
            sClassName: sClassName,
            school: adminID
        });

        if (existingSclassByName) {
            return res.send({ message: "Sorry, this class name already exists" });
        }
        
        const sclass = new SClass({
            sClassName: sClassName,
            school: adminID
        });

        const result = await sclass.save();
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

const sclassList=async (req,res)=>{
    try{
        let sClasses=await SClass.find({school:req.params.id});
    if(sClasses.length>0){
        res.send(sClasses);
    }
    else{
        res.send({message:"no sclasses found"})
    }

    } catch(err){
        res.status(500).json(err);
    }};


const getSclassDetail=async(req,res)=>{
   try{
    let sclass=await SClass.findById(req.params.id); //sClass=school class
    if(sclass){
        sclass=await sclass.populate("school","schoolName");
        res.send(sclass);
    }
    else{
        res.send({message:"no class found"});
    }
   } catch (err){
    res.status(500).json(err);
   }
} 
const getSclassStudents=async (req,res)=>{
    try {      
        let students=await Student.find({sClassName:req.params.id});        
    if(students.length>0){
        let modifiedStudents=students.map((student)=>{
            return{...student._doc,password:undefined};
        });
        res.send(modifiedStudents);
        
    }
    else {
        res.send({message:"No student found"});
    }
    } catch(err){
        res.status(500).json(err);
    }};


const deleteSclass=async (req,res)=>{
   try {
    const deleteClass=await SClass.findByIdAndDelete(req.params.id);
    if(!deleteClass){
        return res.send({message:"Class not found"});
    }
    const deletedStudents =await Student.deleteMany({sclassName:req.params.id});
    const deletedSubjects=await Subject.deleteMany({sclassName:req.params.id});
    const deletedTeachers=await Teacher.deleteMany({teachSclass:req.params.id});
    res.send(deleteClass);
   } catch (err) {
    res.status(500).json(err);
   }};


   const deleteSclasses = async (req, res) => {
    try {
        
        const deletedClasses = await SClass.deleteMany({ school: req.params.id });
        if (deletedClasses.deletedCount === 0) {
            return res.send({ message: "No classes found to delete" });
        }
        const deletedStudents = await Student.deleteMany({ school: req.params.id });
        const deletedSubjects = await Subject.deleteMany({ school: req.params.id });
        const deletedTeachers = await Teacher.deleteMany({ school: req.params.id });
        res.send(deletedClasses);
    } catch (error) {
        res.status(500).json(error);
    }
}



module.exports={sclassCreate,sclassList,getSclassDetail,getSclassStudents,deleteSclass,deleteSclasses};

