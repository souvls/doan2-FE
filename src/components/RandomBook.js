import { useEffect, useState } from 'react';
import React from 'react'
import Image from 'next/image';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
//img
import cover_book from "../assets/cover_book/bookcover.png";
import Link from 'next/link';
const feature = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchdata = async () => {
            setLoading(true);
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/book/random", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result)
                    setBooks(result);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }
        fetchdata();
    }, [])
    return (
        <div className="w-full bg-white mt-20">
            <div className="container w-[960px] m-auto">
                <div>
                    <h1 className="text-center text-3xl font-black m-10">RANDOM</h1>
                </div>
                <div className=" grid grid-cols-4 gap-5">
                    {loading ? "loading"
                        :
                        books.map((item) => {
                            return (
                                <Link href={"/book/" + item._id} className=' relative'>
                                    <div className='h-[450px] border-2 rounded-lg shadow-lg p-2 hover:shadow-2xl hover:border-2 hover:border-black' >
                                        <div className='h-[300px] flex justify-center items-center overflow-hidden'>
                                            <Image alt='' src={process.env.NEXT_PUBLIC_API_NAME + "/" + item.Image} width={200} height={0} />
                                        </div>
                                        <div className=' border-t-2 py-2'>
                                            <p className=' font-bold'>{item.Title}</p>
                                            <p className='text-xs'>{item.Author}</p>
                                            <p className='text-xs'>{item.Publisher}</p>
                                        </div>
                                        <div className='absolute bottom-3 left-3 flex justify-start items-center'>
                                            <div className=' flex justify-center items-center gap-1 px-2 shadow-lg rounded-lg border'>
                                                <FaRegHeart color='red' size={20} />
                                                {item.Favourite}
                                            </div>
                                            <div className=' flex justify-start'>
                                                {
                                                    [...Array(5)].map((star,indexstar) => {
                                                        return (
                                                            <div key={indexstar}>
                                                                {
                                                                item.Rating > indexstar ? <MdOutlineStar color='gold'/> : <MdOutlineStarBorder color='gold'/>
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default feature