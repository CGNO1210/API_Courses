import db from '../models/index';
require('dotenv').config();
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});


let getLesson = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lessons = ''
            id = id.toUpperCase()
            if (id === 'ALL') {
                lessons = await db.Lesson.findAll()
            }
            if (id && id !== 'ALL') {
                lessons = await db.Lesson.findAll({
                    where: { id },
                })
            }
            resolve(lessons)
        } catch (error) {
            reject(error)
        }
    })
}

let createLesson = (data, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!file.mimetype.startsWith('video/')) {
                resolve({
                    errCode: 1,
                    errMessage: 'Only videos are allowed!'
                })
            }
            const videoData = file.buffer.toString('base64');
            let rs = ''
            rs = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${videoData}`, { resource_type: 'video' })
                .then(result => result)
                .catch(error => {
                    console.log(error)
                    return ''
                })
            if (rs === '') {
                resolve({
                    errCode: 2,
                    errMessage: 'not upload content lesson'
                })
            } else {
                await db.Lesson.create({
                    name: data.name,
                    idChapter: data.idChapter,
                    content: rs.secure_url
                })
                resolve({
                    errCode: 0,
                    errMessage: 'created OK'
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let updateLesson = (data, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!file.mimetype.startsWith('video/')) {
                resolve({
                    errCode: 1,
                    errMessage: 'Only videos are allowed!'
                })
            }
            const videoData = file.buffer.toString('base64');
            let rs = ''
            rs = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${videoData}`, { resource_type: 'video' })
                .then(result => result)
                .catch(error => {
                    console.log(error)
                    return ''
                })
            if (rs === '') {
                resolve({
                    errCode: 3,
                    errMessage: 'not upload content lesson'
                })
            }

            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing id update lesson"
                })
            }
            let lesson = await db.Lesson.findOne({
                where: { id: data.id }
            })
            if (!lesson) {
                resolve({
                    errCode: 1,
                    errMessage: "the lesson not found"
                })
            }
            else {
                await db.Lesson.update({
                    name: data.name,
                    idChapter: data.idChapter,
                    content: data.content
                }, {
                    where: { id: data.id }
                })
                resolve({
                    errCode: 0,
                    errMessage: "update success"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteLesson = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let lesson = await db.Lesson.findOne({
                where: { id }
            })
            if (!lesson) {
                resolve({
                    errCode: 2,
                    errMessage: "the lesson isn't exist"
                })
            }
            await db.Lesson.destroy({
                where: { id }
            })
            resolve({
                errCode: 0,
                message: "delete successfully!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

export default {
    getLesson,
    createLesson,
    updateLesson,
    deleteLesson,
}
