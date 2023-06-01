import { PubSub } from "graphql-subscriptions";
import { AuthorModel, FolderModel, NoteModel, NotificationModel } from "../models/index.js";
import { GraphQLScalarType } from 'graphql';

const pubsub = new PubSub();

export const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        //The parseValue method converts the scalar's JSON value to its back-end representation before it's added to a resolver's args.
        parseValue(value) {
            return new Date(value); // value from the client
        },
        //The serialize method converts the scalar's back-end representation to a JSON-compatible format so Apollo Server can include it in an operation response.
        serialize(value) {
            return value.toISOString(); // value sent to the client
        }
    }),
    Query: {
        folders: async (parent, args, context) => { 
            const folders = await FolderModel.find({
                authorId: context.uid
            }).sort({
                updatedAt: 'desc'
            });
            console.log({context})
            return folders;
        },
        folder: async (parent, args) => {
            const folderId = args.folderId;
            const folder = await FolderModel.findOne({
                _id: folderId
            })
            return folder;
        },
        note: async (parent, args) => {
            const note = await NoteModel.findOne({
                _id: args.noteId
            });
            return note;
        }
    },
    Folder: {
        author: async (parent, args) => {
            const authorId = parent.authorId;
            const foundAuthor =  await AuthorModel.findOne({
                uid: authorId
            })
            return foundAuthor;
        },
        notes: async (parent, args) => {
            const folderId = parent.id;
            const foundNotes = await NoteModel.find({
                folderId
            }).sort({
                updatedAt: 'desc'
            });
            if (foundNotes) {
                return foundNotes;
            }
            return [];
        }
    },
    Mutation: {
        addFolder: async (parent, args, context) => {
            const newFolder = new FolderModel({
                ...args,
                authorId: context.uid
            })
            console.log(newFolder)
            pubsub.publish('FOLDER_CREATED', {
                folderCreated: {
                    message: 'A new folder created'
                }
            })
            await newFolder.save();
            return newFolder;
        },
        updateFolder: async (parent, args) => {
            const folderId = args.id;
            const updatedFolder = await FolderModel.findByIdAndUpdate(folderId, args);
            return updatedFolder;
        },
        deleteFolder: async (parent, args) => {
            const folderId = args.id;
            const deletedFolder = await FolderModel.findByIdAndDelete(folderId);
            const notesInFolder = await NoteModel.deleteMany({folderId});
            console.log("notesInFolder: ", notesInFolder);
            return deletedFolder;
        },
        addNote: async (parent, args) => {
            const newNote = new NoteModel(args);
            await newNote.save();
            return newNote;
        },
        updateNote: async (parent, args) => {
            const noteId = args.id;
            const updatedNote = await NoteModel.findByIdAndUpdate(noteId, args);
            return updatedNote;
        },
        deleteNote: async (parent, args) => {
            const noteId = args.id;
            console.log("noteid: ", noteId);
            const deletedNote = await NoteModel.findByIdAndDelete(noteId);
            return deletedNote;
        },
        register: async (parent, args) => {
            const user = await AuthorModel.findOne({uid: args.uid});
            if (!user) {
                console.log("register: ", args)
                const newUser = new AuthorModel(agrs);
                await newUser.save();
                return newUser;
            }
            console.log("acc existance: ", args)
            return user;
        },
        pushNotification: async (parent, args) => {
            const newNotification = new NotificationModel(args);
            pubsub.publish('PUSH_NOTIFICATION', {
                notification: {
                    message: args.content
                }
            })
            await newNotification.save();
            return { message: 'SUCCESS' };
        },
    },
    Subscription: {
        folderCreated: {
            subscribe: () => pubsub.asyncIterator(['FOLDER_CREATED'])
        },
        notification: {
            subscribe: () => pubsub.asyncIterator(['PUSH_NOTIFICATION'])
        }
    }
};