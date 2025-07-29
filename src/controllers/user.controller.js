import User from "../models/user.model.js";

export const userProfile = async (req, res) => {
    try {

        const userData = await User.findById(req.user._id,{
            _id:1,
            firstname:1,
            lastname:1,
            email:1,
            profileImage:1,
            followings:1,
            followers:1
        })

        return res.status(200).json({
            isAuth: true,
            user: userData
        })

        
    } catch (error) {

         console.log(error);

        return res.status(500).json({
            message: "something went wrong!",
            error: error.message
        })
        
    }
}