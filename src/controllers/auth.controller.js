import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import TokenService from "../utils/tokenGenrate.utils.js";
import jwt from "jsonwebtoken";


export const signUpController = async (req, res) => {

    try {

        const { firstname, lastname, email, password } = req.body;

        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        if (password.length <= 7) {
            return res.status(400).json({
                message: "password must be at least 8 characters or more."
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "this email is already exist! try another."
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const createNewUser = new User({
            firstname,
            lastname,
            email,
            password: hashPassword
        });

        await createNewUser.save();

        return res.status(201).json({
            message: "user create successfully."
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "something went wrong!",
            error: error.message
        })
    }
};

export const loginController = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required!"
            })
        }

        if (password.length <= 7) {
            return res.status(400).json({
                message: "password must be at least 8 characters or more."
            })
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                message: "invalid email or password!"
            })
        }


        const decodePassword = await bcrypt.compare(password, existingUser.password);

        if (!decodePassword) {
            return res.status(400).json({
                message: "invalid email or password!"
            })
        }

        const accessToken = TokenService.signAccessToken({ id: existingUser._id });

        const refreshToken = TokenService.signRefreshToken({ id: existingUser._id });

        existingUser.token = refreshToken;

        await existingUser.save()

        res.cookie("access-token", accessToken, {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            sameSite: "None",
            secure: process.env.NODE_ENV !== "development"
        })

        res.cookie("refresh-token", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            sameSite: "None",
            secure: process.env.NODE_ENV !== "development"
        })

        return res.status(200).json({
            message: "login successfully."
        })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "something went wrong!",
            error: error.message
        })
    }
};

export const refreshTokenController = async (req, res) => {
    try {

        const refreshTokenOnCookie = req.cookies["refresh-token"];

        if (!refreshTokenOnCookie) {
            return res.status(400).json({
                message: "refresh token must be required!"
            })
        }

        const decodeCookieToken = await jwt.verify(refreshTokenOnCookie, process.env.REFRESH_SECRET);

        const isExistTokenInTheDataBase = await User.findById(decodeCookieToken.id);


        if (!!!isExistTokenInTheDataBase?.token) {
            
            return res.status(422).json({
                message: "token no store in the database :("
            })
        }

        const decodeDataBaseToken = await jwt.verify(isExistTokenInTheDataBase.token, process.env.REFRESH_SECRET);

        const newGenrateAccessToken = TokenService.signAccessToken({ id: decodeDataBaseToken.id })

        res.cookie("access-token", newGenrateAccessToken, {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            sameSite: "None",
            secure: process.env.NODE_ENV !== "development"
        })


        return res.status(200).json({
            isAuth: true,
            user: {
                _id: isExistTokenInTheDataBase._id,
                firstname: isExistTokenInTheDataBase.firstname,
                lastname: isExistTokenInTheDataBase.lastname,
                email: isExistTokenInTheDataBase.email,
                profileImage: isExistTokenInTheDataBase.profileImage,
                followings: isExistTokenInTheDataBase.followings,
                followers: isExistTokenInTheDataBase.followers
            }
        })


    } catch (error) {
        console.log(error);

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "token expired!",
                error: error.message
            })
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(422).json({
                message: "invalid token!",
                error: error.message
            })
        } else {
            return res.status(500).json({
                message: "something went wrong!",
                error: error.message
            })
        }


    }
}