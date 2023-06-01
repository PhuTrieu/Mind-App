import { Avatar, Menu, MenuItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthProvider'

export default function UserMenu() {
    const { user: { displayName, photoURL, auth } } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (e) => {
      setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLogout = () => {
        auth.signOut();
    }

    return (
        <>
            <Box 
                sx={{
                    display: 'flex', 
                    '&:hover': { cursor: 'pointer' }, 
                    ml: '5px'
                }} 
                onClick={handleClick} 
                overlap='circular'
            >
                <Typography>{displayName}</Typography>
                <Avatar
                    alt='avatar'
                    src={photoURL}
                    sx={{ width: 24, height: 24, marginLeft: '5px'}}
                />
            </Box>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    )
}
