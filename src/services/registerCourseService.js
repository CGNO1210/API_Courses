import db from '../models/index';


let createRegisterCourse = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.RegisterCourse.create({
                idCourse: data.idCourse,
                idUser: data.idUser
            })
            resolve({
                errCode: 0,
                errMessage: 'created OK'
            })
        } catch (error) {
            reject(error)
        }
    })
}

export default {
    createRegisterCourse,
}