import React, { useContext } from 'react'
import { Box, Button, Card, Icon, Typography } from '@mui/material'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { graphQLRequest } from '../utils/request';
import { TipsAndUpdatesOutlined } from '@mui/icons-material';

export default function Login() {
    const {user} = useContext(AuthContext);
    const auth = getAuth();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        const {user: {uid, displayName}} = await signInWithPopup(auth, provider);
        const {data} = await graphQLRequest({
            query: `mutation register($uid: String!, $name: String!) {
                register(uid: $uid, name: $name) {
                  uid
                  name
                }
            }`,
            variables: {
                uid,
                name: displayName,
            }
        });
        console.log('register', {data});
    }

    if (localStorage.getItem('accessToken')) {
        return <Navigate to="/"/>;
    }

    return (
        <>
            <Typography 
                variant='h4' 
                sx={{
                    marginTop: "30%", 
                    marginBottom: '10px' 
                }}
            >
                Hello! Welcome to <span style={{color:"#408268"}}>Mind</span>
                <Icon style={{width:"35px", height:"35px"}}>
                    <TipsAndUpdatesOutlined fontSize='large' style={{color:"#408268"}}/>
                </Icon>
            </Typography>
            <Typography 
                variant='h6'
                sx={{
                    marginBottom: '10px' 
                }}
            >
                where you can write down your  <span style={{color:"#408268"}}>plans</span>, <span style={{color:"#408268"}}>notes</span> and your <span style={{color:"#408268"}}>thoughts</span>.
            </Typography>
            <Button 
                variant="contained" 
                sx={{
                    backgroundColor:"#408268",
                    ":hover": {
                        bgcolor: "#6cc497",
                        color: "black"
                    }
                }} 
                onClick={handleGoogleLogin}
            >
                Login with google
            </Button>
        </>
    )
}
