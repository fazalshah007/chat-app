import jwt from "jsonwebtoken";

class TokenService {

    static signAccessToken = (payload) => {
        return jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: "15m" })
    }


    static signRefreshToken = (payload) => {
        return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" })
    }

}


export default TokenService;