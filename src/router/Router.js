"use client";
import React, { useEffect, useState } from 'react';
import LayoutAdmin from '../layout/LayoutAdmin';
import LayoutUser from '../layout/LayoutUser';

const router = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(Boolean);
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storage = window.localStorage;
            const user = JSON.parse(storage.getItem('ebook_user'));
            // kiểm trá token
            if (user) {
                if (user.user.role === "admin") {
                    return (
                        <LayoutAdmin > {children} </LayoutAdmin>
                    )
                } else {
                    return (
                        <LayoutUser>{children}</LayoutUser>
                    )
                }
            }
        }
    }, [])
}

export default router
