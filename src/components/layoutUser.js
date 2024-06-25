"use client"
import React,{useEffect} from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const LayoutUser = ({ children }) => {

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '80px' , paddingBottom:'20px'}}>
                {children}
            </div>
            <Footer />
        </>
    )
}

export default LayoutUser