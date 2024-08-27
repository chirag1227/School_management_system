const Subject=require("../models/subjectSchema.js");
const Teacher=require("../models/teacherSchema.js");
const Student=require("../models/studentSchema.js");



const subjectCreate = async (req, res) => {
    try {
        const subjects = req.body.subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
            teacher: subject.teacher,
        }));

        const existingSubjectBySubCode = await Subject.findOne({
            subCode: subjects[0].subCode,
            school: req.body.school,
        });

        if (existingSubjectBySubCode) {
            res.status(400).send({ message: 'Sorry, this subcode must be unique as it already exists' });
        } else {
            const newSubjects = subjects.map((subject) => ({
                ...subject,
                sClassName: req.body.sClassName,
                school: req.body.school,
            }));

            const result = await Subject.insertMany(newSubjects);
            res.status(201).send(result);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



const allSubjects=async (req,res)=>{
    try {
        let subjects=await Subject.find({school:req.params.id})
        .populate("sClassName","sClassName")

    if(subjects.length>0){
        res.send(subjects);
    }
    else {
        res.send({Message:"No subjects found"});
    }
    } catch (err){
        res.status(500).json(err);
    }
};

const classSubjects= async (req,res)=>{
    try {
        let subjects= await Subject.find({sClassName:req.params.id})
        if(subjects.length>0){
            res.send(subjects)
        }
        else {
            res.send({Message:"No subjects found"})
        }
    } catch (err){
        res.send(500).json(err);
    }
};
const freeSubjectList=async (req,res)=>{
   try {
    let subject=await Subject.find({ sClassName: req.params.id,
        $or: [{ teacher: { $exists: false } }, { teacher: null }]});
 
     if(subject.length>0){
         res.send(subject)
     }
     else {
         res.send({Message:"No subjects found"})
     }
   } catch (err){
    res.status(500).json(err);
   }
};

const getSubjectDetail=async (req,res)=>{
    try {
        let subject=await Subject.findById(req.params.id);
        if(subject){
            subject=await subject.populate("sClassName","sClassName")
            subject=await subject.populate("teacher","name")
            res.send(subject)
        }
        else {
            res.send({message:"No Subject found"})
        }
    } catch (err){
        res.status(500).json(err);
    }
};

const deleteSubject = async (req,res)=>{
    try {
        const deletedSubject=await Subject.findByIdAndDelete(req.params.id);

        await Teacher.updateOne(
        {teachSubject:deletedSubject._id },
        {$unset:{teachSubject:""},$unset:{teachSubject:null}}
    );
    await Student.updateMany(
        {},
        {$pull:{examResult:{subName:deletedSubject._id}}}
    );
    await Student.updateMany(
        {},
        {$pull:{attendance:{subName:deletedSubject._id}}}
    );
    console.log("deleted student",deletedSubject)
    res.send(deletedSubject);

    } catch (err){
        res.status(500).json(err);
    }
};

const deleteSubjects=async (req,res)=>{
    try {
        const deletedSubjects=await Subject.deleteMany({school:req.params.id})

        await Teacher.updateMany(
        {teachSubject:deletedSubjects._id},
        {$unset:{teachSubject:""},$unset:{teachSubject:null}}
    );
    await Student.updateMany(
        {},
        {$set:{examResult:null,attendance:null}}
    );
    res.send(deletedSubjects);
    } catch (err){
        res.status(500).json(err);
    }
};


const deleteSubjectsByClass=async (req,res)=>{
    try {
       const subjectsToDelete=await Subject.find({sClassName:req.params.id})
      
       const subjectIds = subjectsToDelete.map(subject => subject._id);
       
       const result = await Subject.deleteMany({ sClassName: req.params.id });
       console.log('Delete Result:', result);
        

       await Teacher.updateMany(
        { teachSubject: { $in: subjectIds } },
        { $unset: { teachSubject: "" } }
    );
    
    await Student.updateMany(
        {},
        {$set:{examResult:null,attendance:null}}
    );
    res.status(200).json({
        message: 'Subjects deleted successfully',
        deletedCount: result.deletedCount
    });   
    } catch(err) {
        res.status(500).json(err);
    }
};

module.exports = { subjectCreate, freeSubjectList, classSubjects, getSubjectDetail, deleteSubjectsByClass, deleteSubjects, deleteSubject, allSubjects };