import { NoteAddOutlined, DeleteOutlineRounded, TipsAndUpdatesOutlined } from '@mui/icons-material';
import { Box, Card, CardActions, CardContent, Grid, IconButton, List, Tooltip, Typography, Dialog, DialogContent, DialogActions, Button, DialogTitle, Icon, Snackbar, Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLoaderData, useNavigate, useParams, useRevalidator, useSubmit } from 'react-router-dom'
import moment from 'moment'
import { deleteNote } from '../utils/noteUtils';

export default function NoteList() {
    const {folder} = useLoaderData();
    const {noteId, folderId} = useParams();
    const submit = useSubmit();
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const [activeNoteId, setActiveNoteId] = useState(noteId);
    const [open, setOpen] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        if (noteId) {
            setActiveNoteId(noteId);
            return;
        }
        if (folder?.notes?.[0]) {
            navigate(`note/${folder.notes[0].id}`);
        }
    },[noteId, folder.notes])

    const handleAddNewNote = () => {
        submit(
            {
                content: '',
                folderId,
            },
            {
                method: 'post',
                action: `/folders/${folderId}`
            }
        )
    }
    const handleOpenDelPopup = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleDeleteNote = async () => {
        const delNote = await deleteNote(noteId);
        console.log("delNote: ", delNote.deleteNote.id);
        if (delNote.deleteNote.id !== '') {    
            setFlag(true);
            handleShowNotification();
            navigate(-2);
            revalidator.revalidate();
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

    return (
        <Grid container height='100%'>
            <Grid
                item
                xs={4}
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: '#F0EBE3',
                    height: '100%',
                    overflowY: 'auto',
                    padding: '10px',
                    textAlign: 'left',
                }}
            >
                <List
                    subheader={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>
                                Notes
                            </Typography>
                            <Tooltip title="Add Note" onClick={handleAddNewNote}>
                                <IconButton size='small'>
                                    <NoteAddOutlined />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    }
                >
                    {
                        folder.notes.map(({ id, content, updatedAt }) => {
                            return (
                                <Link
                                    key={id}
                                    to={`note/${id}`}
                                    style={{ textDecoration: 'none' }}
                                    onClick={() => setActiveNoteId(id)}
                                >
                                    <Card
                                        sx={{
                                            mb: '5px',
                                            backgroundColor: id === activeNoteId ? 'rgb(255 211 140)' : null,
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                '&:last-child': { pb: '10px' },
                                                padding: '10px'
                                            }} //mui da set mac dinh pb -> muon overwrite pb -> use '&:last-child'
                                        >
                                            <div
                                                style={{ fontSize: 16, fontWeight: 'bold' }}
                                                dangerouslySetInnerHTML={{
                                                    __html: `${content.substring(0, 30) || 'Empty'}`,
                                                }}
                                            />
                                            <Typography sx={{fontSize:"10px"}}>{moment(updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            {
                                                activeNoteId === id && (
                                                    <div>
                                                        <Tooltip title="Delete" onClick={handleOpenDelPopup}>
                                                            <IconButton size='small'>
                                                                <DeleteOutlineRounded />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Dialog open={open} onClose={handleClose}>
                                                            <DialogTitle>
                                                                <Icon style={{width:"35px", height:"35px"}}>
                                                                    <TipsAndUpdatesOutlined fontSize='large' style={{color:"#408268"}}/>
                                                                </Icon>
                                                            </DialogTitle>
                                                            <DialogContent sx={{color:'#408268', fontWeight:'bold', fontSize:"30px"}}>
                                                                Are you sure?
                                                            </DialogContent>
                                                            <DialogActions sx={{justifyContent:'space-between'}}>
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
                                                                    onClick={handleDeleteNote}
                                                                >
                                                                    OK
                                                                </Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </div>
                                                )
                                            }
                                        </CardActions>
                                    </Card>
                                </Link>
                            )
                        })
                    }

                    <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleCloseNotification}>
                        {
                            flag ? (
                                <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%' }}>
                                    Deleted note successfully!!!
                                </Alert>
                            ) : (
                                <Alert onClose={handleCloseNotification} severity="error" sx={{ width: '100%' }}>
                                    Something went wrong, please try again! 😊
                                </Alert>
                            )
                        }
                    </Snackbar>
                </List>
            </Grid>
            <Grid item xs={8}>
                <Outlet />
            </Grid>
        </Grid>
    )
}
