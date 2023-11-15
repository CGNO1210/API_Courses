import db from '../models/index';

let getChapter = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let chapters = ''
            id = id.toUpperCase()
            if (id === 'ALL') {
                chapters = await db.Chapter.findAll()
            }
            if (id && id !== 'ALL') {
                chapters = await db.Chapter.findAll({
                    where: { idCourse: id },
                })
            }
            resolve(chapters)
        } catch (error) {
            reject(error)
        }
    })
}

let createChapter = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Chapter.create({
                name: data.name,
                idCourse: data.idCourse,
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

let updateChapter = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing id update chapter"
                })
            }
            let chapter = await db.Chapter.findOne({
                where: { id: data.id }
            })
            if (!chapter) {
                resolve({
                    errCode: 1,
                    errMessage: "the chapter not found"
                })
            }
            else {
                await db.Chapter.update({
                    name: data.name,
                    idCourse: data.idCourse,
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

let deleteChapter = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let chapter = await db.Chapter.findOne({
                where: { id }
            })
            if (!chapter) {
                resolve({
                    errCode: 2,
                    errMessage: "the chapter isn't exist"
                })
            }
            await db.Chapter.destroy({
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
    getChapter,
    createChapter,
    updateChapter,
    deleteChapter,
}
