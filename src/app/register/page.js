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
    const [email, setEmail] = useState("");
    const [fullname, setFullName] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [errors, setErrors] = useState([])
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        // try {
        //     const token = JSON.parse(localStorage.getItem('ebook_user')).token;
        //     if (token) {
        //         router.back();
        //     }
        // } catch {

        // }
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        const error = {}
        if(!fullname){
            error.fullname = "fullname";
        }
        if (!username) {
            error.username = "username";
        }
        if(!email){
            error.email = "email"
        }
        if (!password1) {
            error.password1 = "pasword";
        }
        if(!password2){
            error.password2 = "confirm password";
        }
        if(password2 !== password1){
            error.password2 = "pasword not match";
        }
        setErrors(error);

        if (Object.keys(error).length <= 0) {
            setLoading(true);
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "Fullname":fullname,
                "Username":username,
                "Email": username,
                "Password": password1
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };
            fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/register", requestOptions)
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
                            router.push('/');
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
                    <p className='text-center font-bold text-xl p-3'>REGISTER</p>
                </div>
                <div>
                    <div className='mb-5'>
                        <input
                            type='text'
                            className='w-full p-3 rounded-lg bg-slate-200'
                            placeholder='Fullname'
                            value={fullname}
                            onChange={e => setFullName(e.target.value)}
                        />
                        <span className='text-red-500'>{errors.fullname}</span>
                    </div>
                    <div className='mb-5'>
                        <input
                            type='text'
                            className='w-full p-3 rounded-lg bg-slate-200'
                            placeholder='Username'
                            value={username}
                            onChange={e => setUserName(e.target.value)}
                        />
                        <span className='text-red-500'>{errors.username}</span>
                    </div>
                    <div className='mb-5'>
                        <input
                            type='text'
                            className='w-full p-3 rounded-lg bg-slate-200'
                            placeholder='Email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <span className='text-red-500'>{errors.email}</span>
                    </div>
                    <div className='mb-5'>
                        <input
                            type='password'
                            className='w-full p-3 rounded-lg bg-slate-200 '
                            placeholder='Password'
                            value={password1}
                            onChange={e => setPassword1(e.target.value)}
                        />
                        <span className='text-red-500'>{errors.password1}</span>
                    </div>
                    <div className='mb-5'>
                        <input
                            type='password'
                            className='w-full p-3 rounded-lg bg-slate-200 '
                            placeholder='Confirm Password'
                            value={password2}
                            onChange={e => setPassword2(e.target.value)}
                        />
                        <span className='text-red-500'>{errors.password2}</span>
                    </div>
                    <button
                        className='w-full p-2 text-center bg-green-500 text-white rounded-lg'
                        onClick={handleSubmit}
                    >
                        Register
                    </button>
                    <div className=' flex justify-between'>
                        {/* <span className='text-sm text-blue-500 pt-3'>Forget password</span> */}
                        <Link href="login" className='text-sm text-blue-500 pt-3'>I have account, Login</Link>
                    </div>
                </div>
            </div>
        </LayoutUser>

    )
}

export default page