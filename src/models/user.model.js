import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true, minLength: 3 },
    lastname: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true, minLength: 8 },
    profileImage: { type: String, default: null },
    token: { type: String, default: null },
    followings: { type: [ { followingUserId: { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null } } ] },
    followers: { type: [ { follwerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null } } ] },
},{ timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;