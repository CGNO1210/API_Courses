import courseService from '../services/courseService'

let getAllCourses = async (req, res) => {
    let id = req.query.id //ALL,id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required',
            courses: []
        })
    }
    let courses = await courseService.getCourse(id)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        courses
    })
}
let searchCourse = async (req, res) => {
    let name = req.query.name
    if (!name) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required',
            courses: []
        })
    }
    let courses = await courseService.searchCourse(name)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        courses
    })
}

let createCourse = async (req, res) => {
    let message = await courseService.createCourse(req.body, req.file)
    return res.status(200).json(message)
}

let editCourse = async (req, res) => {
    let message = await courseService.updateCourse(req.body,req.file)
    return res.status(200).json(message)
}

let deleteCourse = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing delete id"
        })
    }
    let message = await courseService.deleteCourse(req.body.id)
    return res.status(200).json(message)
}

export default {
    getAllCourses,
    createCourse,
    editCourse,
    deleteCourse,
    searchCourse
}