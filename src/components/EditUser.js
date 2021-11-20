import React from 'react'
import { useState } from 'react';
import { Grid, TextField, Avatar } from '@mui/material'
import Header from './Header';
import { useAuth } from '../contexts/AuthContext'
import firebase from '@firebase/app-compat';
import { useNavigate } from 'react-router';
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css"
import MuiPhoneNumber from 'material-ui-phone-number';

const userInfo ={
    uid:'',
    displayName:'',
    firstName:'',
    lastName:'',
    stageName:'',
    birthday:'',
    phoneNumber:'',
    countryCode:'',
    city:'',
    country:'',
    state:'',
    street:'',
    street2:'',

}

export default function EditUser() {

    const [value,setValue] = useState(userInfo);
    const { currentUser } = useAuth();
    const navigate = useNavigate();


    
    

    return (
        <form>
            <Header />
            <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={2} >
                <Grid item>
                    <Avatar sx={{width: 150, height: 150}} src="https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" alt="ProfilePic" />
                </Grid>
            </Grid>
            <strong>EMAIL: </strong> {currentUser.email}
            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1}>
                <Grid item xs={11} sm={8} md={3}>
                    <TextField label="User Display Name" variant="outlined" value={value.displayName} sx={{width: '100%'}} />
                </Grid>
                <Grid item xs={11} sm={8} md={3}>
                    <TextField label="Stage Name*" variant="outlined" value={value.lastName} sx={{width: '100%'}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1} > 
                <Grid item xs={11} sm={8} md={3}>
                    <TextField label="First Name*" variant="outlined" value={value.firstName} sx={{width: '100%'}} />
                </Grid>
                <Grid item xs={11} sm={8} md={3}>
                    <TextField label="Last Name*" variant="outlined" value={value.lastName} sx={{width: '100%'}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={5} rowSpacing={5} direction="row" justifyContent="center" alignItems="center" marginBottom={1} > 
                <Grid item xs={11} sm={8} md={6} textAlign="center">
                    <TextField label="Place holder(Phone number)" variant="outlined" value={value.lastName} sx={{width: 1}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1} > 
                <Grid item xs={11} sm={8} md={6} textAlign="center">
                    <TextField label="Country" variant="outlined" value={value.lastName} sx={{width: 1}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1} > 
                <Grid item xs={11} sm={8} md={3} textAlign="right">
                    <TextField label="City" variant="outlined" value={value.lastName} sx={{width: '100%'}}/>
                </Grid>
                <Grid item xs={11} sm={8} md={3}>
                    <TextField label="State" variant="outlined" value={value.lastName} sx={{width: '100%'}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1} > 
                <Grid item xs={11} sm={8} md={2} >
                    <TextField label="Postal Code " variant="outlined" value={value.lastName} sx={{width: '100%'}}/>
                </Grid>
                <Grid item xs={11} sm={8} md={2} >
                    <TextField label="Street" variant="outlined" value={value.lastName} sx={{width: '100%'}}/>
                </Grid>
                <Grid item xs={11} sm={8} md={2}>
                    <TextField label="Street 2" variant="outlined" value={value.lastName} sx={{width: '100%'}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={5} rowSpacing={5} direction="row" justifyContent="center" alignItems="center" marginBottom={1} > 
                <Grid item xs={11} sm={8} md={6}>
                    <TextField label="Birthday" variant="outlined" value={value.lastName} sx={{width: 1}}/>
                </Grid>
            </Grid>
        </form>
    )
}
