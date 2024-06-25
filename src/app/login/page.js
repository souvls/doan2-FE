"use client";
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Swal from 'sweetalert2';

//component
import LayoutUser from '../../components/layoutUser'
import Backdrop from '../../components/backdrop';
const page = () => {
    const router = useRouter();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([])
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const token = JSON.parse(localStorage.getItem('ebook_user')).token;
            if (token) {
                router.back();
            }
        }catch{
            
        }

    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        const error = {}
        if (!username) {
            error.username = "!username";
        }
        if (!password) {
            error.password = "!pasword";
        }
        setErrors(error);

        if (Object.keys(error).length <= 0) {
            setLoading(true);
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "Email": username,
                "Password": password
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };
            fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/login", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result.status === 'ok') {
                        //save token
                        localStorage.setItem("ebook_user", JSON.stringify(result))
                        console.log(result)
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1000,
                            title: result.msg,
                        }).then(() => {
                            //redirect admin or user
                            if (result.user.role === 'admin') {
                                router.push('/admin/home');
                            } else {
                                router.push('/');
                            }
                        });
                    } else {
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            showConfirmButton: false,
                            timer: 1000,
                            title: result.msg,
                        })
                    }
                }).catch((err) => {
                    console.log(err)

                })
                .catch((error) => console.error(error));
            setLoading(false);
        }
    }
    return (
        <LayoutUser>

            <div className='w-[30%] mx-auto my-20 p-10  bg-white border-2 rounded-lg shadow-lg'>
                <div>
                    <p className='text-center font-bold text-xl p-3'>LOGIN</p>
                </div>
                <div>
                    <div className='mb-5'>
                        <input
                            type='text'
                            className='w-full p-3 rounded-lg bg-slate-200'
                            placeholder='username'
                            value={username}
                            onChange={e => setUserName(e.target.value)}
                        />
                        <span className='text-red-500'>{errors.username}</span>
                    </div>
                    <div className='mb-5'>
                        <input
                            type='password'
                            className='w-full p-3 rounded-lg bg-slate-200 '
                            placeholder='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <span className='text-red-500'>{errors.password}</span>
                    </div>
                    <button
                        className='w-full p-2 text-center bg-green-500 text-white rounded-lg'
                        onClick={handleSubmit}
                    >
                        Login
                    </button>
                    <div className=' flex justify-between'>
                        <span className='text-sm text-blue-500 pt-3'>Forget password</span>
                        <Link href="register" className='text-sm text-blue-500 pt-3'>I don't have account</Link>
                    </div>
                </div>
            </div>
        </LayoutUser>

    )
}

export default page