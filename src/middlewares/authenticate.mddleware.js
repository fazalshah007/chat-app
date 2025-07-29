import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const isAuthenticate = async (req, res, next) => {
    try {

        const token = req.cookies["access-token"];

        if (!token) {
            return res.status(400).json({
                message: "token must be required!",
            })
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_SECRET);

        const userData = await User.findById(decodeToken.id, { _id: 1 });

        if(!userData){
             return res.status(400).json({
                message: "unprocessable entity.",
            })
        }

        req.user = userData;
        next()

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