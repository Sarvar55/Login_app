import UserModel from "../model/user.model";
import bcrypt from "bcrypt";
import { Jwt } from "jsonwebtoken";
import ENV from "../config";
import otpGenarator from "otp-generator";
import { error } from "console";

//middleware for erify user

export async function verifUser(req, res, next) {
    try {
        const { username } = req.mwthod == "GET" ? req.query : req.body;

        // check the user existance

        let exist = await UserModel.findOne({ username });

        if (!exist) return res.status(404).send({ error: "Can't find user" });
        next();
    } catch (error) {
        return res.status(404).send({ error: "Authentication error" });
    }
}

export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;
        //  check the existing user

        const existingUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, (err, user) => {
                if (err) {
                    reject(err);
                }
                if (user) {
                    reject({ error: "Please use unique username" });
                }
                resolve();
            });
        });
        //check th existing email address
        const existingEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, (err, user) => {
                if (err) {
                    reject(err);
                }
                if (user) {
                    reject({ error: "Please use unique email" });
                }
                resolve();
            });
        });
        Promise.all([existingEmail, existingUsername])
            .then(() => {
                if (password) {
                    bcrypt
                        .hash(password, 10)
                        .then((hashedPassword) => {
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile,
                                email,
                            });
                            user
                                .save()
                                .then((result) => {
                                    res.status(201).send({ message: "User saved successfully" });
                                })
                                .catch((err) => {
                                    res.status(500).send({
                                        message: err.message,
                                    });
                                });
                        })
                        .catch((err) => {
                            return res
                                .status(500)
                                .send({ error: "Enable to hashed password" });
                        });
                }
            })
            .catch((err) => {
                return res.status(500).send({ error: "Enable to hashed password" });
            });
    } catch (error) {
        return res.status(500).send(error);
    }
}
export async function login(req, res) {
    const { username, password } = req.body;
    try {
        UserModel.findOne({
                username: username,
            })
            .then((user) => {
                bcrypt
                    .compare(password, user.password)
                    .then((passwordCheck) => {
                        if (!passwordCheck)
                            return res.status(401).send({ error: "Dont have password" });
                        // create jwt token
                        const token = jwt.sign({
                                userId: user._id,
                                username: user.username,
                            },
                            ENV.JWT_SECRET, { expiresIn: "24h" }
                        );
                        return res.status(200).send({
                            message: "Login Succes",
                            username: user.username,
                            token,
                        });
                    })
                    .catch((err) => {
                        return res.status(500).send({
                            error: "Password does not Match ",
                        });
                    });
            })
            .catch((err) => {
                res.status(500).send({
                    error: "Username not found",
                });
            });
    } catch (error) {
        return res.status(500).send({ error });
    }
}
export async function getUser(req, res) {
    const { username } = req.params;
    try {
        if (!username) return res.status(404).send({ error: "Invalid username" });
        UserModel.findOne({ username }, (err, user) => {
            if (err) {
                return res.status(500).send({ error });
            }
            if (!user) {
                return res.status(501).send({ error: "couldnt find the user" });
            }
            // remove password from user
            //mongoose return unnecsesary data with object so convert it into json

            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(200).send({ user: rest });
        });
    } catch (error) {
        return res.status(500).send({ error: "cannot find user data" });
    }
}
export async function updateUser(req, res) {
    try {
        // const { id } = req.query.id;
        const { userId } = req.user;
        if (id) {
            const body = req.body;
            UserModel.updateOne({ _id: userId }, body, (err, data) => {
                if (err) {
                    throw err;
                }
                return res.status(200).send({ message: "User updated successfully" });
            });
        } else {
            return res.status(500).send({ error: "User Not Found" });
        }
    } catch (error) {
        return status(500).send({ error });
    }
}
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenarator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    res.status(201).json({ code: req.app.locals.OTP });
}
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) == parseInt(code)) {
        req.app.locals.OTP = null; //reset OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).json({ message: "Verify Successful" });
    }
    return res.status(400).json({ message: "Invalid OTP code" });
}
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        //allow acces to this route only once
        return res.status.json({ flag: req.app.locals.resetSession });
    }
    return res.status(401).json({ message: "Session Expired" });
}
export async function resetPassword(req, res) {
    try {
        const { username, password } = req.body;
        if (!req.app.locals.resetSession)
            return res.status(401).json({ message: "Session Expired" });

        try {
            UserModel.findOne({ username })
                .then((user) => {
                    bcrypt
                        .hash(password, 10)
                        .then((hashedPassword) => {
                            UserModel.updateOne({ username: user.username }, { password: hashedPassword },
                                (err, data) => {
                                    if (err) throw err;
                                    return res.status(201).send({ message: "Record Update!" });
                                }
                            );
                        })
                        .catch((err) => {
                            return res
                                .status(500)
                                .json({ message: "Eneble to hash password" });
                        });
                })
                .catch((err) => {
                    return res.status.json({ error: "Username not found" });
                });
        } catch (error) {
            return res.status(500).send({ error });
        }
    } catch (error) {
        return res.status(500).send({ error });
    }
}