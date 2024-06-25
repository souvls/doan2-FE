"use client"
import React, { useEffect } from 'react'
import SideBar from '../../components/admin/sideBar'
import { useRouter } from 'next/navigation';

const layout = ({ children }) => {
    const router = useRouter();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('ebook_user'));
        // kiểm trá token
        if (user) {
            if (!user.user.role === "admin") {
                router.push("/");
            }
        } else {
            router.push("/");
        }
    }, [])
    return (
        <div>
            <div>
                <SideBar />
            </div>
            <div className='ms-[250px] p-5'>
                {children}
            </div>
        </div>
    )

}


export default layout