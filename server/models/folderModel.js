import mongoose, { Schema } from "mongoose";

const folderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        require: true
    }
}, {timestamps: true});

const FolderModel = mongoose.model('Folder', folderSchema);
export default FolderModel;