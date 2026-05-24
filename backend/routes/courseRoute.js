import express from 'express'
import multer from 'multer'
import path from 'path'
import { createCourse, deleteCourse, getCourses, getCoursesById, getMyRating, getPublicCourses, rateCourse, updateCourse } from '../controllers/courseController.js';


// multer setup 
const storage = multer.diskStorage({
    destination: (req, file, cb)=>cb(null,path.join(process.cwd(),'uploads')),
    filename: (req, file , cd) =>{
        const unique = Date.now() + "-" + Math.round(Math.random()*1e9);
        const ext=path.extname(file.originalname);
        cd(null,`course-${unique}${ext}`);
    },
});
const upload=multer({storage});

const courseRouter=express.Router();

courseRouter.get('/public',getPublicCourses);
courseRouter.get('/', getCourses);
courseRouter.get('/:id',getCoursesById);

courseRouter.post('/', upload.single('image'),createCourse);
courseRouter.put('/:id', upload.single('image'), updateCourse);
courseRouter.delete('/:id',deleteCourse);

courseRouter.post('/:courseId/rate',rateCourse);
courseRouter.get('/:courseId/rating',getMyRating);

export default courseRouter;


