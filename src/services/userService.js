import db from '../models/index';
import bcrypt from 'bcrypt';
const salt = bcrypt.genSaltSync(10)
require('dotenv').config();
import { generateToken, verifyToken } from '../helpers/jwt.helper';
const debug = console.log.bind(console);
let tokenList = {};
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let userData = await compareUserPassword(email, password)
                //exist-> compare password
                resolve(userData)
            } else {
                userData.errCode = 1
                userData.errMessage = `Your's email isn't exist in system.Please try other email`
                resolve(userData)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let compareUserPassword = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let user = await db.User.findOne({
                where: { email: email },
                attributes: ['email', 'password', 'isAdmin'],
                raw: true
            })
            if (user) {
                let check = bcrypt.compareSync(password, user.password)
                if (check) {
                    userData.errCode = 0
                    userData.errMessage = 'Ok'
                    delete user.password
                    userData.user = user
                    const accessToken = await generateToken(user, accessTokenSecret, accessTokenLife)
                    const refreshToken = await generateToken(user, refreshTokenSecret, refreshTokenLife)
                    tokenList[refreshToken] = { accessToken, refreshToken }
                    userData.token = { accessToken, refreshToken }
                } else {
                    userData.errCode = 3
                    userData.errMessage = 'Wrong password'
                }
            } else {
                userData.errCode = 2
                userData.errMessage = `Your's email isn't exist`
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            id = id.toUpperCase()
            if (id === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                })
            }
            if (id && id !== 'ALL') {
                users = await db.User.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email)
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "email is already in used please try another email!"
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt)
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "the user isn't exist"
                })
            }
            await db.User.destroy({
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

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing id update"
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (!user) {
                resolve({
                    errCode: 1,
                    errMessage: "the user not found"
                })
            }
            else {
                await db.User.update({
                    firstName: data.firstName,
                    lastName: data.lastName,
                }, {
                    where: { id: data.id }
                })
                resolve({
                    errCode: 0,
                    message: "update success"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * controller refreshToken
 * @param {*} req 
 * @param {*} res 
 */
let refreshToken = async (req, res) => {
    // User gửi mã refresh token kèm theo trong body
    const refreshTokenFromClient = req.body.refreshToken

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
            const userFakeData = decoded.data;
            const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
            // gửi token mới về cho người dùng
            return res.status(200).json({ accessToken })
        } catch (error) {
            res.status(403).json({
                message: 'Invalid refresh token.',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
};

export default {
    handleUserLogin,
    getAllUser,
    createNewUser,
    deleteUser,
    updateUserData,
    refreshToken
};

