"use client"
import React from 'react'
import LayoutUser from '../../components/layoutUser'
import Feature from '../../components/feature'
import Random from '../../components/RandomBook';
const page = () => {
    return (
        <LayoutUser>
            <Feature />
            <Random/>
        </LayoutUser>
    )
}

export default page