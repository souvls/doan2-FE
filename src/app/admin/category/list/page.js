"use client"
import React, { useState, useEffect } from 'react'
import ReactPaginate from "react-paginate";
import Backdrop from '../../../../components/backdrop';
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
const page = () => {
    const [loading, setLoading] = useState(false);
    const [newCgt, setNewCgr] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [numShow, setNumShow] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {

        fetchdata();
    }, [])
    const fetchdata = async () => {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem('ebook_user')).token;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/category", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setCategoryList(result)
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }
    const handdleAdd = async () => {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem('ebook_user')).token;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        const data = JSON.stringify({
            CategoryName: newCgt
        })
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: data,
            redirect: "follow"
        };
        await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/admin/category/add", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'ok') {
                    fetchdata();
                    setNewCgr("");
                    setLoading(false);
                    Swal.fire({
                        icon: "success",
                        title: result.msg
                    })
                } else {
                    setLoading(false);
                    Swal.fire({
                        icon: "error",
                        title: result.msg
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }
    const handleDelete = async (id) => {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem('ebook_user')).token;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
            method: "DELETE",
            headers: myHeaders,
            redirect: "follow"
        };
        await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/admin/category/" + id, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 'ok') {
                    fetchdata();
                    setNewCgr("");
                    setLoading(false);
                    Swal.fire({
                        icon: "success",
                        title: result.msg
                    })
                } else {
                    setLoading(false);
                    Swal.fire({
                        icon: "error",
                        title: result.msg
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }
    const handdleUpdate = async (id) => {
        const { value: newCGR } = await Swal.fire({
            title: "update",
            input: "text",
            inputLabel: "new categoryname",
            inputPlaceholder: "..."
        });
        if (newCGR) {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('ebook_user')).token;
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);
            const data = JSON.stringify({
                id : id,
                newName: newCGR
            });
            const requestOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: data,
                redirect: "follow"
            };
            await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/admin/category/update", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result.status === 'ok') {
                        fetchdata();
                        setNewCgr("");
                        setLoading(false);
                        Swal.fire({
                            icon: "success",
                            title: result.msg
                        })
                    } else {
                        setLoading(false);
                        Swal.fire({
                            icon: "error",
                            title: result.msg
                        })
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }
    return (
        <>
            {loading && <Backdrop />}
            <div className='w-full border-b-2 p-3'>
                <p>Category List</p>
            </div>
            <div className='mt-10'>
                <table className='w-full table-auto'>
                    <thead className=''>
                        <tr className='w-full bg-blue-500 text-white'>
                            <th className='py-2'>ID</th>
                            <th>Category Name</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {!loading &&
                            categoryList.map((item) => {
                                return (
                                    <tr className='w-full border-t-2 border-b-2 hover:bg-slate-200'>
                                        <td className='text-start py-2'>{"..." + item._id}</td>
                                        <td className='text-center font-medium'>{item.CategoryName}</td>
                                        <td className=''><button onClick={() => handdleUpdate(item._id)} className='flex justify-center items-center'><MdEdit color='blue' size={20} /></button></td>
                                        <td className=''><button onClick={() => handleDelete(item._id)} className='flex justify-center items-center'><MdDelete color='red' size={20} /></button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            {/* <div className=''>
                <ReactPaginate
                    previousLabel={<IoMdArrowDropleft />}
                    nextLabel={<IoMdArrowDropright />}
                    breakLabel={"..."}
                    containerClassName="flex justify-center items-center gap-5"
                    pageClassName="page-item"
                    pageLinkClassName=" bg-blue-500 rounded-lg text-white px-2"
                    previousClassName="page-item"
                    previousLinkClassName="page-link prev"
                    nextClassName="page-item"
                    nextLinkClassName="page-link next"
                    marginPagesDisplayed={0}
                    pageRangeDisplayed={8}
                    activeLinkClassName="active"
                    onPageChange={({ selected }) =>
                        handlePageClick(selected + 1)
                    }
                    pageCount={pageCount}
                />

            </div> */}
            <div className='mt-20 pt-10 border-t-2'>
                <div>
                    <input
                        className='p-2 border rounded-lg'
                        type='text'
                        placeholder='category name...'
                        value={newCgt}
                        onChange={e => setNewCgr(e.target.value)}
                    />
                    <button onClick={handdleAdd} className=' bg-blue-500 text-white p-2 ms-3 rounded-lg'>Add</button>
                </div>

            </div>
        </>
    )
}

export default page