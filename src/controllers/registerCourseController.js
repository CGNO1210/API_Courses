import registerCourseService from '../services/registerCourseService'

let createRegisterCourse = async (req, res) => {
    let message = await registerCourseService.createRegisterCourse(req.body)
    return res.status(200).json(message)
}

export default {
    createRegisterCourse,
}