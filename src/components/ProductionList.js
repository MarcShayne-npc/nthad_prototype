import React from 'react'
import Header from './Header'
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import firebase from '@firebase/app-compat';


function ProductionList(){
    
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

   

    return (
        <div>
            <Header />
           
           Product List
        </div>
    )
}

export default ProductionList
