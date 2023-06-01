import React, {useEffect, useState} from 'react'
import { EmojiObjects, EmojiObjectsOutlined, TipsAndUpdatesOutlined } from '@mui/icons-material'
import { createClient } from 'graphql-ws';
import { GRAPHQL_SUBSCRIPTION_ENDPOINT } from '../utils/constants';
import { Badge, Box, Divider, Icon, Menu, MenuItem, Modal, Tooltip, Typography } from '@mui/material';

const client = createClient({
    url: GRAPHQL_SUBSCRIPTION_ENDPOINT,
});

const query = `subscription PushNotification {
    notification {
      message
    }
}`

export default function PushNotification() {
    const [invisible, setInvisible] = useState(true);
    const [notification, setNotification] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openModal, setOpenModal] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #408268',
        boxShadow: 24,
        p: 4,
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleClick = (e) => {
      setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
      setNotification('');
      setInvisible(true);
    };

    useEffect(() => {
        // subscription
        (async () => {
            const onNext = (data) => {
                /* handle incoming values */
                setInvisible(false);
                const message = data?.data?.notification?.message;
                setNotification(message);
                console.log("PUSH_NOTIFICATION: ", {data});
            };
        
            await new Promise((resolve, reject) => {
                client.subscribe(
                    {
                        query,
                    },
                    {
                        next: onNext,
                        error: reject,
                        complete: resolve,
                    },
                );
            });
        })();
    }, [])

    return (
        <>
            <Badge 
                color='success' 
                variant='dot' 
                invisible={invisible} 
                overlap='circular'
                sx={{ 
                    '&:hover': { cursor: 'pointer' }, 
                    ml: '5px' 
                }}
            >
                {
                    invisible ? (
                        <Tooltip title='You do not have any notifications right now.'>
                            <EmojiObjectsOutlined />
                        </Tooltip>
                    ) : (
                        <Tooltip title='You have 1 new notification.'>
                            <EmojiObjects style={{color: '#408268'}} onClick={handleClick}/>
                        </Tooltip>
                    )
                }
            </Badge>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem>
                    <Typography variant='h6'>Notifications</Typography>
                    <Divider variant="middle" />
                </MenuItem>
                <Tooltip title='Click on to expand.' placement='top'>
                    <MenuItem onClick={handleOpenModal}>
                            <Typography>
                                {
                                    notification.length > 20 ? notification.substring(0, 20) + '...' : notification
                                }
                            </Typography>
                    </MenuItem>
                </Tooltip>
            </Menu>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" variant='h3' sx={{ mb: '20px' }} style={{color:"#408268"}} component="h2">
                    Mind
                    <Icon style={{width:"35px", height:"35px"}}>
                        <TipsAndUpdatesOutlined fontSize='large' style={{color:"#408268"}}/>
                    </Icon>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {notification}
                </Typography>
                </Box>
            </Modal>
        </>
    )
}
