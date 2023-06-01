import { Outlet, createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import AuthProvider from "../context/AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import NoteList from "../components/NoteList";
import Note from "../components/Note";
import { addNewNote, noteLoader, notesLoader, updateNote } from "../utils/noteUtils";
import { foldersLoader } from "../utils/folderUtils";

const AuthLayout = () => {
    return (
        <AuthProvider>
            <Outlet/> 
        </AuthProvider> 
    )
}

export default createBrowserRouter([
    {
        element: <AuthLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                element: <Login/>,
                path: '/login',
            },
            {
                element: <ProtectedRoute/>,
                children: [
                    {
                        element: <Home/>,
                        path: '/',
                        loader: foldersLoader,
                        children: [
                            {
                                element: <NoteList/>,
                                path: 'folders/:folderId',
                                action: addNewNote,
                                loader: notesLoader,
                                children: [
                                    {
                                        element: <Note/>,
                                        path: `note/:noteId`,
                                        action: updateNote,
                                        loader: noteLoader
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
])