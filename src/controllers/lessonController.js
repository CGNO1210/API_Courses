import lessonService from '../services/lessonService'

let getAllLessons = async (req, res) => {
    let id = req.query.id //ALL,id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required',
            lessons: []
        })
    }
    let lessons = await lessonService.getLesson(id)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        lessons
    })
}

let createLesson = async (req, res) => {
    let message = await lessonService.createLesson(req.body, req.file)
    return res.status(200).json(message)
}

let editLesson = async (req, res) => {
    let message = await lessonService.updateLesson(req.body, req.file)
    return res.status(200).json(message)
}

let deleteLesson = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing delete id"
        })
    }
    let message = await lessonService.deleteLesson(req.body.id)
    return res.status(200).json(message)
}

export default {
    getAllLessons,
    createLesson,
    editLesson,
    deleteLesson,
}