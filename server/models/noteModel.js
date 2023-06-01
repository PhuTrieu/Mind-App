import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
    content: {
        type: String
    },
    folderId: {
        type: String,
        require: true
    }
}, {timestamps: true});

const NoteModel = mongoose.model('Note', noteSchema);
export default NoteModel;