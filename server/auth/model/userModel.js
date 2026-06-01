import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true, maxlength: 50},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      maxlength: 30,
      match: /^[a-z0-9_-]+$/,
    },
    bio: {type: String, maxlength: 200, default: ''},
    avatar: {type: String, default: ''},
    location: {type: String, maxlength: 100, default: ''},
    website: {type: String, maxlength: 200, default: ''},
    socials: {
      github: {type: String, default: ''},
      linkedin: {type: String, default: ''},
      twitter: {type: String, default: ''},
      devto: {type: String, default: ''},
    },
    isProfilePublic: {type: Boolean, default: true},
    verifyOTP: {type: String, default: null},
    verifyOTPExpire: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOTP: {type: String, default: null},
    resetOTPExpire: {type: Number, default: 0}
})

const userModel = mongoose.model("user", userSchema);

export default userModel;
