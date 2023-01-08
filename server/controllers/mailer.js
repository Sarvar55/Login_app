import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import ENV from "../config";

let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: ENV.EMAIL, // generated ethereal user
        pass: ENV.PASSWORD, // generated ethereal password
    },
};

let transporter = nodemailer.transporter(nodeConfig);

let Mailgenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
    },
});

export const registerMail = async(req, res) => {
    const { username, userEmail, text, subject } = req.body;
    //body of the emeail

    var email = {
        body: {
            name: username,
            intro: text || "Welocome to Sarvar55 we are excited to have you on board",
            outro: "Need help or have question ?just reply to this email we love to help",
        },
    };
    var emailBody = Mailgenerator.generate(email);

    let message = {
        from: ENV.EMAIL,
        to: userEmail,
        subject: subject || "SignUp Seccess",
        html: emailBody,
    };

    //send mail
    transporter
        .sendMail(message)
        .then(() => {
            return res
                .status(200)
                .send({ message: "you should receive an email from us." });
        })
        .catch((err) => {
            res.status(500).send({ err });
        });
};