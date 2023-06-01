import mongoose, { Schema } from "mongoose";

const authorSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        require: true
    }
}, {timestamps: true});

const AuthorModel = mongoose.model('Author', authorSchema);
export default AuthorModel;