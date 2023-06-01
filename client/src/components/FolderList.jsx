import { 
    Alert,
    Box, 
    Button, 
    Card, 
    CardActions, 
    CardContent, 
    Dialog, 
    DialogActions, 
    DialogContent,
    DialogTitle,
    Icon,
    IconButton, 
    List, 
    Menu, 
    MenuItem, 
    Snackbar, 
    TextField, 
    Tooltip, 
    Typography 
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useRevalidator } from 'react-router-dom'
import NewFolder from './NewFolder';
import { DeleteOutlineRounded, MoreVert, TipsAndUpdatesOutlined, EditOutlined } from '@mui/icons-material';
import { deleteFolder, updateFolder } from '../utils/folderUtils';

export default function FolderList({ folders }) {
    const {folderId} = useParams();
    const revalidator = useRevalidator();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const [openUpdNoti, setOpenUpdNoti] = useState(false);
    const [flagUpd, setFlagUpd] = useState(false);
    const [openDelNoti, setOpenDelNoti] = useState(false);
    const [flagDel, setFlagDel] = useState(false);

    const [activeFolderId, setActiveFolderId] = useState(folderId);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [editFolderName, setEditFolderName] = useState();
    const [preFolderName, setPreFolderName] = useState(); //use for compare to editFolderName

    //Handle more icon click
    const handleClick = (e) => {
      setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    //Handle edit icon click
    const handleClickEditPopup = () => {
        const {name} = folders.find(folder => folder.id === folderId);
        setEditFolderName(name);
        setPreFolderName(name);
        setOpenEdit(true);
    }
    const handleCloseEditPopup = () => {
        setEditFolderName('');
        setOpenEdit(false);
    }
    const handleEditFolderNameChange = (e) => {
        setEditFolderName(e.target.value);
    }
    const handleUpdateFolderName = async () => {
        if (editFolderName !== '') {
            if (preFolderName.localeCompare(editFolderName) !== 0) {
                const {updatedFolder} = await updateFolder({id: folderId, name: editFolderName});
                console.log("updatedFolder: ", updatedFolder);
                setFlagUpd(true);
                handleShowUpdNotification();
                revalidator.revalidate();
                handleCloseEditPopup();
            }
            else {
                handleCloseEditPopup();
            }
        }
        else {
            handleShowUpdNotification();
        }
    }
    const handleShowUpdNotification = () => {
        setOpenUpdNoti(true);
    };
    const handleCloseUpdNotification = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenUpdNoti(false);
    }

    //Handle delete icon click
    const handleClickDelPopup = () => {
        setOpenDel(true);
    }
    const handleCloseDelPopup = () => {
        setOpenDel(false);
    }
    const handleDeleteFolder = async () => {
        const deletedFolder = await deleteFolder(folderId);
        console.log("deletedFolder: ", deletedFolder);
        navigate("/");
        setAnchorEl(null);
        revalidator.revalidate();
        handleCloseDelPopup();
    }
    const handleShowDelNotification = () => {
        setOpenDelNoti(true);
    };
    const handleCloseDelNotification = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenDelNoti(false);
    }

    return (
        <List
            sx={{
                width: '100%',
                bgcolor: '#408268',
                height: '100%',
                padding: '10px',
                textAlign: 'left',
                overflowY: 'auto',
            }}
            subheader={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 'bold', color: 'white' }}>
                        Folders
                    </Typography>
                    <NewFolder/>
                </Box>
            }
        >
            {
                folders.map(({ id, name }) => {
                    return (
                        <Link
                            key={id}
                            to={`folders/${id}`}
                            style={{ 
                                textDecoration: 'none'
                            }}
                            onClick={() => setActiveFolderId(id)}
                        >
                            <Card
                                sx={{ 
                                    mb: '5px',
                                    backgroundColor: id === activeFolderId ? 'rgb(255 211 140)' : null,
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <CardContent
                                    sx={{
                                        '&:last-child': { pb: '10px' },
                                        padding: '10px'
                                    }}
                                >
                                    <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>{name}</Typography>
                                </CardContent>
                                <CardActions>
                                    {
                                        activeFolderId === id && (
                                            <div>
                                                <Tooltip title="More">
                                                    <IconButton 
                                                        size='small'
                                                        aria-label="more"
                                                        id="long-button"
                                                        aria-controls={open ? 'long-menu' : undefined}
                                                        aria-expanded={open ? 'true' : undefined}
                                                        aria-haspopup="true"
                                                        onClick={handleClick}
                                                    >
                                                        <MoreVert />
                                                    </IconButton>
                                                </Tooltip>
                                                <Menu
                                                    id="long-menu"
                                                    MenuListProps={{
                                                    'aria-labelledby': 'long-button',
                                                    }}
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleClose}
                                                    PaperProps={{
                                                    style: {
                                                        width: '20ch',
                                                    },
                                                    }}
                                                >
                                                    <MenuItem 
                                                        onClick={handleClickEditPopup}
                                                        sx={{
                                                            ":hover": {
                                                                bgcolor: "#408268",
                                                                color: "white"
                                                            }
                                                        }}
                                                    >
                                                        <EditOutlined />
                                                        Edit
                                                    </MenuItem>
                                                    <MenuItem 
                                                        onClick={handleClickDelPopup}
                                                        sx={{
                                                            ":hover": {
                                                                bgcolor: "#408268",
                                                                color: "white"
                                                            }
                                                        }}
                                                    >
                                                        <DeleteOutlineRounded/>
                                                        Delete
                                                    </MenuItem>
                                                </Menu>

                                                {/* Edit modal dialog */}
                                                <Dialog open={openEdit} onClose={handleCloseEditPopup}>
                                                    <DialogContent>
                                                        <TextField
                                                            autoFocus
                                                            margin='dense'
                                                            id='name'
                                                            label='Edit Folder Name'
                                                            fullWidth
                                                            size='small'
                                                            variant='standard'
                                                            sx={{width: '400px', color:'#408268'}}
                                                            autoComplete='off'
                                                            value={editFolderName}
                                                            onChange={handleEditFolderNameChange}
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
                                                            onClick={handleCloseEditPopup}
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
                                                            onClick={handleUpdateFolderName}
                                                        >
                                                            OK
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>

                                                {/* Delete modal dialog */}
                                                <Dialog open={openDel} onClose={handleCloseDelPopup}>
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
                                                            onClick={handleCloseDelPopup}
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
                                                            onClick={handleDeleteFolder}
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
                            
                            <Snackbar open={openUpdNoti} autoHideDuration={6000} onClose={handleCloseUpdNotification}>
                                {
                                    flagUpd ? (
                                        <Alert onClose={handleCloseUpdNotification} severity="success" sx={{ width: '100%' }}>
                                            Updated folder successfully!!!
                                        </Alert>
                                    ) : (
                                        <Alert onClose={handleCloseUpdNotification} severity="error" sx={{ width: '100%' }}>
                                            Please give me a folder name 😊
                                        </Alert>
                                    )
                                }
                            </Snackbar>
                            <Snackbar open={openDelNoti} autoHideDuration={6000} onClose={handleCloseDelNotification}>
                                {
                                    flagDel ? (
                                        <Alert onClose={handleCloseDelNotification} severity="success" sx={{ width: '100%' }}>
                                            Deleted folder successfully!!!
                                        </Alert>
                                    ) : (
                                        <Alert onClose={handleCloseDelNotification} severity="error" sx={{ width: '100%' }}>
                                            Something went wrong, please try again! 😊
                                        </Alert>
                                    )
                                }
                            </Snackbar>
                        </Link>
                    )
                })
            }
        </List>
    )
}
