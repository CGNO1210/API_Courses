import express from 'express';
import apiController from '../controllers/apiController';
import courseController from '../controllers/courseController';
import chapterController from '../controllers/chapterController';
import lessonController from '../controllers/lessonController';
import registerCourseController from '../controllers/registerCourseController';
import userController from '../controllers/userController';
import AuthMiddleWare from '../middlewares/AuthMiddleware';
import AdminMiddleware from '../middlewares/AdminMiddleware';

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

let router = express.Router();

let initWebRoutes = (app) => {
    router.post("/api/login", userController.handleLogin)
    router.post("/refesh-token", userController.refreshToken)
    router.post("/api/create-new-user", userController.handleCreateNewUser)

    //AuthMiddleWare
    router.use(AuthMiddleWare.isAuth)
    //Client
    router.get('/api/getAllCourses', courseController.getAllCourses)
    router.get('/api/searchCourse', courseController.searchCourse)
    router.get('/api/getAllChapters', chapterController.getAllChapters)
    router.get('/api/getAllLessons', lessonController.getAllLessons)
    //Register Course
    router.post('/api/createRegisterCourse', registerCourseController.createRegisterCourse)
    //Admin
    //AdminMiddleWare
    router.use(AdminMiddleware.isAuth)
    //User
    router.get('/api/getAllUser', apiController.handleGetAllUser)
    router.put("/api/edit-user", userController.handleEditUser)
    router.delete("/api/delete-user", userController.handleDeleteUser)
    //Manage Course
    router.post('/api/createCourse', upload.single('img'), courseController.createCourse)
    router.put('/api/editCourse', upload.single('img'), courseController.editCourse)
    router.delete('/api/deleteCourse', courseController.deleteCourse)
    //Manage Chapter
    router.post('/api/createChapter', chapterController.createChapter)
    router.put('/api/editChapter', chapterController.editChapter)
    router.delete('/api/deleteCourse', courseController.deleteCourse)
    //Manage Lesson
    router.post('/api/createLesson', upload.single('video'), lessonController.createLesson)
    router.put('/api/editLesson', upload.single('video'), lessonController.editLesson)
    router.delete('/api/deleteLesson', lessonController.deleteLesson)

    return app.use("/", router);
}

module.exports = initWebRoutes;