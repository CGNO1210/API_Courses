import chapterService from '../services/chapterService'

let getAllChapters = async (req, res) => {
    let id = req.query.id //ALL,id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required',
            chapters: []
        })
    }
    let chapters = await chapterService.getChapter(id)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        chapters
    })
}

let createChapter = async (req, res) => {
    let message = await chapterService.createChapter(req.body)
    return res.status(200).json(message)
}

let editChapter = async (req, res) => {
    let message = await chapterService.updateChapter(req.body)
    return res.status(200).json(message)
}

let deleteChapter = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing delete id"
        })
    }
    let message = await chapterService.deleteChapter(req.body.id)
    return res.status(200).json(message)
}

export default {
    getAllChapters,
    createChapter,
    editChapter,
    deleteChapter,
}