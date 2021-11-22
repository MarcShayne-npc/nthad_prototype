import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Box, Card, Grid , TextField, Button } from '@material-ui/core';
import { useAuth } from '../contexts/AuthContext'
import Alert from '@mui/material/Alert';
import { Link, useNavigate } from 'react-router-dom'
import firebase from '@firebase/app-compat';

const LogIn =() => {

    //references and state
    const emailRef =useRef()
    const passwordRef =useRef()
    const { currentUser, login } = useAuth()
    const [error, setError] =useState('')
    const [loading, setLoading] =useState(false)     
    const navigate = useNavigate()


    

    //styling
    const cardStyle={padding:20,height:'450px',width:280,margin:"120px auto"}
    const h2Style={width:'100%',align:'center',borderBottom:'1px solid #000',lineHeight: '0.1em',margin:'10px 0 20px' }
    const spanStyle={background:'#fff',padding:'0 10px'}


    //handles login function
    async function handleSubmit(e){
        e.preventDefault()
        
        try{
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            if(firebase.auth().currentUser.metadata.creationTime === firebase.auth().currentUser.metadata.lastSignInTime){
                console.log('first time')
                navigate("/edit-profile")
            }
            else{  
                navigate("/production-list")
            }
        
            navigate("/production-list");
        } catch{
            setError("The password or email that you've entered is incorrect.")
        }
        setLoading(false)
    }
    

    //sign in with firebase google
    const SignInWithFirebaseGoogle=()=>{
        var google_Provide = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(google_Provide)
        .then((re)=>{
            if(firebase.auth().currentUser.metadata.creationTime === firebase.auth().currentUser.metadata.lastSignInTime){
                console.log('first time')
                navigate("/edit-profile")
            }
            else{  
                navigate("/production-list")
            }
           console.log("Login")
        })
        .catch((er) =>{
            setError('Failed to sign in with Google')
        })
    }
    
    //sign in with firebase facebook
    const SignInWithFirebaseFacebook=()=>{
        var facebook_Provide = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(facebook_Provide)
        .then((re)=>{
            navigate("/production-list");
            if(firebase.auth().currentUser.metadata.creationTime === firebase.auth().currentUser.metadata.lastSignInTime){
                console.log('first time')
                navigate("/edit-profile")
            }
            else{  
                navigate("/production-list")
            }
            console.log("Login")
        })
        .catch((er) =>{
            setError('Failed to sign in with Facebook')
        })
    }

    return (
        <Grid container>
        <Card elevation={10} align="center" variant="outlined" style={cardStyle}>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit ={handleSubmit}>
                <h1>Log In</h1>
                Don't have an account? <Link to="/signup">Sign Up</Link>
                <Grid item>
                    <TextField label="Email" type="email" inputRef={emailRef} required variant="outlined" fullWidth/>
                </Grid>
                <Grid item>
                    <TextField label="Password" type="password" inputRef={passwordRef} required variant="outlined" fullWidth/>
                </Grid>
                <Link to="/forgot-password" >forgot passowrd?</Link>
                <Box m={2}>
                    <Button disabled={loading} type="submit" variant="contained" color="primary" fullWidth>Log In</Button>
                </Box>
                <h2 style={h2Style}><span style={spanStyle}>OR</span></h2>
                <Button onClick={SignInWithFirebaseGoogle} disabled={loading} variant="outlined">Google</Button>
                <Button onClick={SignInWithFirebaseFacebook} disabled={loading} type="submit" variant="outlined">Facebook</Button>
            </form>
         </Card>
        </Grid>
    )
}
export default LogIn