const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true // tis way will not be possible to create the two users with the same username
    },
    password: String,
},{timestamps: true});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;