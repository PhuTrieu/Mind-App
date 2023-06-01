import { Box, Grid, Icon, Typography } from '@mui/material'
import React from 'react'
import UserMenu from '../components/UserMenu'
import FolderList from '../components/FolderList'
import { Outlet, useLoaderData } from 'react-router-dom'
import { TipsAndUpdatesOutlined } from '@mui/icons-material'
import PushNotification from '../components/PushNotification'

export default function Home() {
  const {folders} = useLoaderData();
  console.log(folders)
  return (
    <>
      <Typography variant='h3' sx={{ mb: '20px' }} style={{color:"#408268"}}>
        Mind
        <Icon style={{width:"35px", height:"35px"}}>
            <TipsAndUpdatesOutlined fontSize='large' style={{color:"#408268"}}/>
        </Icon>
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          mb: '10px'
        }}
      >
        <UserMenu />
        <PushNotification/>
      </Box>

      <Grid
        container
        sx={{
          height: '70vh',
          boxShadow: '0 0 15px 0 rgb(193 193 193 / 60%)'
        }}
      >
        <Grid item xs={3} sx={{ height: '100%' }}>
          <FolderList folders={folders} />
        </Grid>
        <Grid item xs={9} sx={{ height: '100%' }}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  )
}
