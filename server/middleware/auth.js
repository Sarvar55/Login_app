import { Jwt } from "jsonwebtoken";
import ENV from "../config";

export default async function Auth(req, res, next) {
    try {
        // access authorie header to validate request
        const token = req.header.authorization.split(" ")[1];
        //retrive the user details fo the logged in user

        const decodenToken = await Jwt.verify(token, ENV.JWT_SECRET);

        req.user = decodenToken; //token olustururken ne qoymusuqsa onlar var ele exp falan da var

        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
}

export function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false,
    };
    next();
}