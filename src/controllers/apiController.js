import userService from '../services/userService';


let login = (req, res) => {
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        data: {
            userId: "1",
            token: "token"
        }
    })
}

let handleGetAllUser = async (req, res) => {
    let id = req.query.id // id = All || id
    if (!id) {
        return res.status(403).json({
            errCode: 1,
            errMessage: 'Invalid ID'
        })
    } else {
        let data = await userService.getAllUser(id)
        return res.status(200).json({
            errCode: 0,
            errMessage: 'Ok',
            data
        })
    }
}

export default {
    login,
    handleGetAllUser
};
