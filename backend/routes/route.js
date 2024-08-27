const router=require("express").Router();

const {adminRegister,adminLogIn,getAdminDetail }=require('../controllers/admin-controller.js');
const {sclassCreate,sclassList,getSclassDetail,getSclassStudents,deleteSclass,deleteSclasses}=require('../controllers/class-controller.js');
const {complainCreate,complainList}=require('../controllers/complain-controller.js');
const {noticeCreate,noticeList,updateNotice,deleteNotice,deleteNotices}=require('../controllers/notice-controller.js');
const {
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
}  =require('../controllers/student-controller.js');

const { subjectCreate, freeSubjectList, classSubjects, getSubjectDetail, deleteSubjectsByClass, deleteSubjects, deleteSubject, allSubjects } =require('../controllers/subject-controller.js');

const {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
} =require('../controllers/teacher-controller.js');

//Admin
router.post('/register',adminRegister);
router.post('/login',adminLogIn);

router.get('/admindetail/:id',getAdminDetail);

//Student
router.post('/studentregister',studentRegister);
router.post('/studentlogin',studentLogIn);

router.get("/Students/:id", getStudents);
router.get("/getstudentdetail/:id",getStudentDetail);

router.delete('/deletestudent/:id',deleteStudent);
router.delete('/deletestudents/:id',deleteStudents);
router.delete('/deletestudentsbyclass/:id',deleteStudentsByClass);

router.put('/updatestudent/:id',updateStudent);
router.put('/updateexamresult/:id',updateExamResult);
router.put('/updateattendance/:id',studentAttendance);
router.put('/removeallstudentsattendancebysub/:id',clearAllStudentsAttendanceBySubject);
router.put('/removeallstudentsattendance/:id',clearAllStudentsAttendance);
router.put('/removestudentattendancebysub/:id',removeStudentAttendanceBySubject);
router.put('/removestudentattendance/:id',removeStudentAttendance);

//class
router.post('/class',sclassCreate);
router.get('/sclasslist',sclassList);
router.get('/sclassdetail/:id',getSclassDetail);
router.get('/sclassstudents/:id',getSclassStudents);
router.delete('/deletesclass/:id',deleteSclass);
router.delete('/deletesclasses/:id',deleteSclasses);

//notice 
router.post('/createnotice',noticeCreate);
router.get('/noticelist',noticeList);
router.put('/updatenotice/:id',updateNotice);
router.delete('/deletenotice/:id',deleteNotice);
router.delete('/deletenotices/:id',deleteNotices);

//teacher
router.post('/teacherregister',teacherRegister);
router.post('/teacherlogin',teacherLogIn);

router.get('/getteacher/:id',getTeachers);
router.get('/getteacherdetail/:id',getTeacherDetail);

router.put('/updateteachersubject',updateTeacherSubject);

router.delete('/deleteteacher/:id',deleteTeacher);
router.delete('/deleteteachers/:id',deleteTeachers);
router.delete('/deleteteachersbyclass/:id',deleteTeachersByClass);
router.post('/teacherattendance/:id',teacherAttendance);
//Complain
router.post('/complaincreate',complainCreate);
router.get('/complainlist/:id', complainList);

//subject
router.post('/createsubject',subjectCreate);

router.get('/allsubjects/:id',allSubjects);
router.get('/classsubjects/:id',classSubjects);
router.get('/freesubjectlist/:id',freeSubjectList);
router.get('/getsubjectdetail/:id',getSubjectDetail);

router.delete('/deletesubject/:id',deleteSubject);
router.delete('/deletesubjects/:id',deleteSubjects);
router.delete('/deletesubjectsbyclass/:id',deleteSubjectsByClass);



module.exports=router;



//updateTeacherSubject par i need to add