import { Router } from "express";
const router = Router();
import * as controller from "../controllers/appController";
import Auth, { localVariables } from "../middleware/auth";
import { registerMail } from "../controllers/mailer";

router.route("/register").post(controller.register);

router.route("/registerMail").post(registerMail);
router.route("/authenticate").post(controller.verifUser, (req, res) => {
    res.end();
});
router.route("/login").post(controller.verifUser, controller.login);

router.route("/user/:username").post(controller.getUser);

router
    .route("/generateOTP")
    .get(controller.verifUser, localVariables, controller.generateOTP);
router.route("/verifyOTPP").get(controller.verifUser, controller.verifyOTP);
router.route("/createResetSession").get(controller.createResetSession);

router.route("/updateUser").put(Auth, controller.updateUser);
router
    .route("/resetPassword")
    .put(controller.verifUser, controller.resetPassword);
export default router;