import React from 'react'
import { useState, useEffect } from 'react';
import { Grid, TextField, Avatar, Typography } from '@mui/material';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';
import Button from '@mui/material/Button';
import { db } from '../firebase'
import { collection, getDocs, setDoc, doc } from "firebase/firestore"; 
import { Mail } from '@mui/icons-material';
import AlertMessage from './AlertMessage';

export default function EditUser() {

    //all the data that is being pass through firestore
    //There is no "productioncompaniesowned" and productionsowned defaulted to be an empty array
    const [newDisplayName,setDisplayName] = useState("");
    const [newStageName,setStageName] = useState("");
    const [newFirstName, setFirstName] = useState("");
    const [newLastName, setLastName] = useState("");
    const [newAvatar, setAvatar] = useState(false);
    const [newBirthday, setBirthday] = useState(new Date());
    const [newStreet, setStreet] = useState("");
    const [newUnit, setUnit] = useState("");
    const [newCity, setCity] = useState("");
    const [newState, setState] = useState("");
    const [newCountry, setCountry] = useState("");
    const [newPostalcode, setPostalCode] = useState("");
    const [newCountryCode, setCountryCode] = useState("+1");
    const [newNumber, setNumber] = useState("");
    const [status, setStatusBase] = useState("");
    const [disable, setDisable] = useState(false);

    //current user that is logged in
    const { currentUser } = useAuth();

    //for debugging purposes will (REMOVE LATER)
    const usersCollectionRef = getDocs(collection(db, "user"))
    // Used for reference
    // Getting the document of "user" in firebase with sub content
    // useEffect(() =>{
    //     const getUsers = async()=>{
    //         const usersCollectionRef = getDocs(collection(db, "user"))
    //         console.log((await usersCollectionRef).docs.map((doc)=>({...doc.data(), id: doc.id})))

    //     }
    //     getUsers();
    // },[])

    //When user press submit button
    const handleEditUser = async() =>{
        //Add or update document in firestore
        //Only required fields are needed if emptry on non-required field
        //will leave blank value or string
        try{
            console.log(newStreet)
            await setDoc(doc(db, "user", currentUser.uid), { 
                user_fields:{
                    displayname: newDisplayName,
                    legalfirstname: newFirstName,
                    legallastname: newLastName,
                    stagename: newStageName,
                    email: currentUser.email,
                    hasavatar: newAvatar, 
                    birthday: newBirthday,
                },
                address: {
                    street: newStreet,
                    unit: newUnit,
                    city: newCity,
                    state: newState,
                    country: newCountry,
                    postalcode: newPostalcode
                },
                phone: {
                    countrycode: newCountryCode,
                    number: newNumber
                },
                productioncompaniesowned: [''],
                productionsowned: [''],
    
             })
             setStatusBase({ lvl:"success",msg: "Account Edited/Updated", key: Math.random() });
             console.log("Edit Profile Submit")
        }
        //when user required field is empty
        catch{
            setStatusBase({ lvl:"error",msg: "Failed to edit account", key: Math.random() });
            console.log("Failled to edit account")
        }
    }

    return (
        <form>
            <Header />
            <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={2} >
                <Grid item>
                    <Avatar sx={{width: 150, height: 150}} src="" alt="ProfilePic" />
                </Grid>
                <Grid item xs={4}>
                    <Button variant="outlined">Upload</Button>
                    <Typography variant="subtitle1">Image format must be JPG only</Typography>
                    <Typography variant="subtitle1">Max file size is 200kb</Typography>
                </Grid>
            </Grid>

            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1}>
                <Grid item xs={11} sm={8} md={6}>
                    <h2>Account Information</h2>
                </Grid>
            </Grid>

            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1}>
                <Grid item xs={11} sm={8} md={3}>
                    <TextField error={newDisplayName===""} helperText={newDisplayName === "" ? 'Required' : ' '} label="User Display Name*" id="outlined-required" type="text" variant="outlined" onChange={(event) => {setDisplayName(event.target.value)}} sx={{width: '100%'}} />
                </Grid>
                <Grid item xs={11} sm={8} md={3}>
                    <TextField label="Stage Name*" error={newStageName===""} helperText={newStageName === "" ? 'Required' : ' '} id="outlined-required" type="text" variant="outlined" onChange={(event) => {setStageName(event.target.value)}} sx={{width: '100%'}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1} > 
                <Grid item xs={11} sm={8} md={3}>
                    <TextField label="First Name*" error={newFirstName===""} helperText={newFirstName === "" ? 'Required' : ' '} type="text" variant="outlined" onChange={(event) => {setFirstName(event.target.value)}} sx={{width: '100%'}} />
                </Grid>
                <Grid item xs={11} sm={8} md={3}>
                    <TextField label="Last Name*" error={newLastName===""} helperText={newLastName === "" ? 'Required' : ' '} type="text" variant="outlined" onChange={(event) => {setLastName(event.target.value)}} sx={{width: '100%'}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={0} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1}>
                    <Grid item xs={8.5} sm={6.5} md={3}>
                        <TextField label="E-Mail*" id="outlined-required" type="email" defaultValue={currentUser.email} variant="outlined" InputProps={{readOnly: true,}} sx={{width: '100%'}} />
                    </Grid>
                    <Grid item  md={1}>
                        <Button variant="outlined" style={{height:'54px'}}><Mail /></Button>
                    </Grid>
               
                    <Grid item xs={11} sm={8} md={2}>
                        <TextField label="Birthday*" error={newBirthday=== ""} helperText={newBirthday === Date(0) ? 'Required' : ''} InputLabelProps={{shrink: true,}} type="date" variant="outlined" onChange={(event) => {setBirthday(event.target.value)}} sx={{width: 1}}/>
                    </Grid>
            </Grid>
            
            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1}>
                <Grid item xs={11} sm={8} md={6}>
                    <h2>Contact Information</h2>
                </Grid>
            </Grid>

            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1} >
                <Grid item xs={11} sm={8} md={2} textAlign="center">
                    <TextField label="Country Code" type="text" variant="outlined" onChange={(event) => {setCountryCode(event.target.value)}} sx={{width: 1}}/>
                </Grid>
                <Grid item xs={11} sm={8} md={4} textAlign="center">
                    <TextField label="Phone number" type="tel" variant="outlined" onChange={(event) => {setNumber(event.target.value)}} sx={{width: 1}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1} > 
                <Grid item xs={11} sm={8} md={6} textAlign="center">
                    <TextField label="Country" type="text" variant="outlined" onChange={(event) => {setCountry(event.target.value)}} sx={{width: 1}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1} > 
                <Grid item xs={11} sm={8} md={3} textAlign="right">
                    <TextField label="City" type="text" variant="outlined" onChange={(event) => {setCity(event.target.value)}} sx={{width: '100%'}}/>
                </Grid>
                <Grid item xs={11} sm={8} md={3}>
                    <TextField label="State" type="text" variant="outlined" onChange={(event) => {setState(event.target.value)}} sx={{width: '100%'}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={1} rowSpacing={1} direction="row" justifyContent="center" alignItems="center" marginBottom={1} > 
                <Grid item xs={11} sm={8} md={2} >
                    <TextField label="Postal Code" type="text" variant="outlined" onChange={(event) => {setPostalCode(event.target.value)}} sx={{width: '100%'}}/>
                </Grid>
                <Grid item xs={11} sm={8} md={2} >
                    <TextField label="Street" type="text" variant="outlined" onChange={(event) => {setStreet(event.target.value)}} sx={{width: '100%'}}/>
                </Grid>
                <Grid item xs={11} sm={8} md={2}>
                    <TextField label="Unit" type="text" variant="outlined" onChange={(event) => {setUnit(event.target.value)}} sx={{width: 1}}/>
                </Grid>
            </Grid>

            <Grid container columnSpacing={5} rowSpacing={5} direction="row" justifyContent="right" alignItems="center" marginBottom={1} > 
                <Grid item xs={4}>
                <Button onClick={handleEditUser} variant="outlined">Update</Button>
                {status ? <AlertMessage level={status.lvl}key={status.key} message={status.msg} /> : null}
                </Grid>
            </Grid>
        </form>
            
    )
}
