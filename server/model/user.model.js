import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please porvide uniqe username"],
        unique: [true, "Username exist"],
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        unique: false,
    },
    email: {
        type: String,
        required: [true, "Please porvide uniqe email"],
        unique: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    address: {
        type: String,
    },
    profile: {
        type: String,
    },
});

export default mongoose.model.Users || mongoose.model("User", UserSchema);