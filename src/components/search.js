"use client"
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
//icon
import { CiSearch } from "react-icons/ci";
const search = () => {
    const [books, setBooks] = useState([]);
    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const handdleSearch = async () => {
        if (key) {
            setLoading(true);
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/book/search?key=" + key, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    //setBooks(result);
                    console.log(result.length)
                    if (result.length > 0) {
                        const myList = result.map((item) => {
                            return (`
                              <li>
                                <a href="/book/${item._id}" class="w-full block p-2 bg-slate-100 rounded-lg hover:shadow-lg hover:border-2 border-blue-500">
                                <div class="flex justify-start items-start gap-2">
                                  <div>
                                    <img src="${process.env.NEXT_PUBLIC_API_NAME + "/" + item.Image}" width="30"/>
                                  </div>
                                  <div class="w-full">
                                    <p class='text-start text-sm'>${item.Title}</p>
                                    <p class='text-start text-sm'>${item.Author}</p>
                                  </div>
                                </div>
                                </a>
                              </li>`)
                        }).join('')
                        Swal.fire({
                            html: `
                            <p class="py-2 text-blue-500">SEARCH RESULT</p>
                            <ul class=" grid grid-cols-1 gap-1">
                            ${myList}
                            </ul>
                            `,
                            confirmButtonText: 'CLOSE',
                            allowOutsideClick: false, // ป้องกันการคลิกภายนอกป๊อปอัป
                            allowEscapeKey: false,    // ป้องกันการกดปุ่ม ESC เพื่อปิดป๊อปอัป
                            allowEnterKey: false      // ป้องกันการกดปุ่ม Enter เพื่อปิดป๊อปอัป
                        });
                    } else {
                        Swal.fire({
                            icon:"error",
                            title:"Name book does not exits",
                            confirmButtonText: 'CLOSE',
                            allowOutsideClick: false, // ป้องกันการคลิกภายนอกป๊อปอัป
                            allowEscapeKey: false,    // ป้องกันการกดปุ่ม ESC เพื่อปิดป๊อปอัป
                            allowEnterKey: false      // ป้องกันการกดปุ่ม Enter เพื่อปิดป๊อปอัป
                        });
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }
    return (
        <div className='w-full'>
            <div className='flex gap-4'>
                <div className='w-[80%] relative'>
                    <input
                        type='text'
                        className='w-full py-4 px-8 rounded-full outline-none shadow-lg'
                        placeholder='name book...'
                        value={key}
                        onChange={e => setKey(e.target.value)}
                    />
                    <div className='h-full absolute top-0 flex justify-start items-center'>
                        <CiSearch size={30} />
                    </div>
                </div>
                <button onClick={handdleSearch} className='w-[20%] flex  justify-center items-center p-4 rounded-full outline-none bg-white shadow-lg'>SEARCH</button>
            </div>
        </div>
    )
}

export default search