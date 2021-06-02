const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name."],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email."],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password."],
    },
    role: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/clearnteams/image/upload/v1613645036/avatar/294-2947257_interface-icons-user-avatar-profile-user-avatar-png_aefim7.png"
    },
    frequencyList: {
        type: Array,
        default: new Array(5000).fill(false)
    },
    frequencyCount: {
        type: Number,
        default: 0
    },
    tabIndex: {
        type: Number,
        default: 0
    },
    isSimplified: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)
