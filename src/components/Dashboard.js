import React from 'react'
import Header from './Header'
import { AuthProvider, useAuth } from '../contexts/AuthContext';



function Dashboard() {
    
    const { currentUser, logout } = useAuth();


    return (
        <div>
            <Header />
            <strong>EMAIL: </strong> {currentUser.email}
        </div>
    )
}

export default Dashboard
