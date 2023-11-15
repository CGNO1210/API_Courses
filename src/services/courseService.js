import db from '../models/index';
import { Op } from 'sequelize';
require('dotenv').config();
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

let getCourse = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let courses = ''
            id = id.toUpperCase()
            if (id === 'ALL') {
                courses = await db.Course.findAll()
            }
            if (id && id !== 'ALL') {
                courses = await db.Course.findOne({
                    where: { id },
                })
            }
            resolve(courses)
        } catch (error) {
            reject(error)
        }
    })
}

let searchCourse = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let courses = ''
            courses = await db.Course.findAll({
                where: {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                },
            })
            resolve(courses)
        } catch (error) {
            reject(error)
        }
    })
}

let createCourse = (data, file) => {

    return new Promise(async (resolve, reject) => {
        try {
            if(!file.mimetype.startsWith('image/')){
                resolve({
                    errCode: 1,
                    errMessage: 'Only images are allowed!'
                })
            }
            const imageData = file.buffer.toString('base64');
            let rs = ''
            rs = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${imageData}`)
                .then(result => result)
                .catch(error => {
                    console.log(error)
                    return ''
                })
            if (rs === '') {
                resolve({
                    errCode: 2,
                    errMessage: 'not upload img'
                })
            } else {
                await db.Course.create({
                    name: data.name,
                    description: data.description,
                    img: rs.secure_url,
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

let updateCourse = (data,file) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!file.mimetype.startsWith('image/')){
                resolve({
                    errCode: 1,
                    errMessage: 'Only images are allowed!'
                })
            }
            const imageData = file.buffer.toString('base64');
            let rs = ''
            rs = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${imageData}`)
                .then(result => result)
                .catch(error => {
                    console.log(error)
                    return ''
                })
            if (rs === '') {
                resolve({
                    errCode: 3,
                    errMessage: 'not upload img'
                })
            }

            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing id update course"
                })
            }
            let course = await db.Course.findOne({
                where: { id: data.id }
            })
            if (!course) {
                resolve({
                    errCode: 1,
                    errMessage: "the course not found"
                })
            }
            else {
                await db.Course.update({
                    name: data.name,
                    description: data.description,
                    img: rs.secure_url,
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

let deleteCourse = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let course = await db.Course.findOne({
                where: { id }
            })
            if (!course) {
                resolve({
                    errCode: 2,
                    errMessage: "the course isn't exist"
                })
            }
            await db.Course.destroy({
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
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    searchCourse
}
