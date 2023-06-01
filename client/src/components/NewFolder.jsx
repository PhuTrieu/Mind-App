import { Alert, Button, Dialog, DialogActions, DialogContent, IconButton, Snackbar, TextField, Tooltip } from '@mui/material'
import { CreateNewFolderOutlined } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { addNewFolder } from '../utils/folderUtils'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function NewFolder() {
    const [newFolderName, setNewFolderName] = useState('');
    const [open, setOpen] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [flag, setFlag] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();
    const popupName = searchParams.get('popup');

    const handleOpenPopup = () => {
        setSearchParams({popup: 'add-folder'});
    }
    const handleClose = () => {
        setNewFolderName('');
        navigate(-1);
    }
    const handleNewFolderNameChange = (e) => {
        setNewFolderName(e.target.value);
    }
    const handleAddNewFolder = async () => {
        if (newFolderName !== '') {    
            const {addFolder} = await addNewFolder({name: newFolderName});
            console.log({addFolder});
            setFlag(true);
            handleShowNotification();
            handleClose();
        }
        else {
            handleShowNotification();
        }
    }

    const handleShowNotification = () => {
        setOpenNotification(true);
    };
    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenNotification(false);
    }

    useEffect(() => {
        popupName === 'add-folder' ? setOpen(true) : setOpen(false);
    }, [popupName])

    return (
        <div>
            <Tooltip title="Add Folder" onClick={handleOpenPopup}>
                <IconButton size='small'>
                    <CreateNewFolderOutlined sx={{ color: 'white' }} />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin='dense'
                        id='name'
                        label='Folder Name'
                        fullWidth
                        size='small'
                        variant='standard'
                        sx={{width: '400px', color:'#408268'}}
                        autoComplete='off'
                        value={newFolderName}
                        onChange={handleNewFolderNameChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{
                            backgroundColor:"#408268",
                            color:'white',
                            ":hover": {
                                bgcolor: "#6cc497",
                                color: "black"
                            }
                        }} 
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{
                            backgroundColor:"#408268",
                            color:'white',
                            ":hover": {
                                bgcolor: "#6cc497",
                                color: "black"
                            }
                        }} 
                        onClick={handleAddNewFolder}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
                {
                    flag ? (
                        <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%' }}>
                            Created folder successfully!!!
                        </Alert>
                    ) : (
                        <Alert onClose={handleCloseNotification} severity="error" sx={{ width: '100%' }}>
                            Please give me a folder name 😊
                        </Alert>
                    )
                }
            </Snackbar>
        </div>
    )
}
