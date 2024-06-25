"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useParams } from 'next/navigation'
import { ReactReader } from 'react-reader'
import Backdrop from '../../../../../components/backdrop'
import Image from 'next/image'
import Swal from 'sweetalert2'
const page = () => {
    const id = useParams().id
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [oldData, setOlddata] = useState([]);
    const [ListCategory, setListCategory] = useState([]);
    const [location, setLocation] = useState(0);
    const [Id, setId] = useState('');
    const [Title, setTitle] = useState('');
    const [Author, setAuthor] = useState('');
    const [Publisher, setPublisher] = useState('');
    const [Publish_date, setPublish_date] = useState(null);
    const [Description, setDescription] = useState('');
    const [Cover, setCover] = useState(null);
    const [oldCover, setoldCover] = useState('')
    const [File, setFile] = useState(null);
    const [Category, setCategory] = useState("");

    useEffect(() => {
        const fetchdata = async () => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/book/" + id, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setId(result._id);
                    setTitle(result.Title);
                    setAuthor(result.Author);
                    setPublisher(result.Publisher);
                    setPublish_date(result.Publish_date);
                    setoldCover(result.Image);
                    setFile(result.File);
                    setCategory(result.Category._id);
                    setDescription(result.Description);
                })
                .catch((error) => console.error(error));
            await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/category", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    setListCategory(result);
                })
                .catch((error) => console.error(error));
        }
        fetchdata();
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = {};
        if (!Title) {
            error.Title = "input Title";
        }
        // if (!Cover) {
        //     error.Cover = "input Cover";
        // }
        if (!File) {
            error.File = "input Epub file";
        }
        if (!Category) {
            error.Category = "Chose category";
        }
        setErrors(error);
        if (Object.keys(error).length === 0) {
            setIsLoading(true);
            const token = JSON.parse(localStorage.getItem('ebook_user')).token;
            var myHeaders = new Headers();
            var formdata = new FormData();

            myHeaders.append("Authorization", `Bearer ${token}`);
            formdata.append("Id", Id);
            formdata.append("Title", Title);
            formdata.append("Author", Author);
            formdata.append("Publisher", Publisher);
            formdata.append("Publish_date", Publish_date);
            formdata.append("Description", Description);
            formdata.append("Image", Cover);
            formdata.append("Category", Category);
            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };
            await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/admin/book", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    if (result.status === 'ok') {
                        Swal.fire({
                            title: "update book successfully",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1000
                        }).then(() => {
                            setIsLoading(false);
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            title: result.msg,
                            icon: "error"
                        });
                        setIsLoading(false);
                    }
                })
                .catch(error => console.log('error', error));
        }
    }
    return (
        <div>
            {isLoading && <Backdrop />}
            <div className='w-full border-b-2 p-3'>
                <p className=' font-bold'>Add New Book</p>
            </div>
            <div className='w-full mt-5'>
                <div className='w-full flex justify-between'>
                    <div className='w-full px-5'>
                        <div className='w-full'>
                            <label>Title</label>
                            <input
                                type='text'
                                className='w-full p-2 border rounded-lg'
                                value={Title}
                                onChange={e => setTitle(e.target.value)}
                            />
                            {errors.Title && <span className='text-red-500'>{errors.Title}</span>}
                        </div>
                        <div className='w-full mt-3'>
                            <label>Author</label>
                            <input
                                type='text'
                                className='w-full p-2 border rounded-lg'
                                value={Author}
                                onChange={e => setAuthor(e.target.value)}
                            />
                        </div>
                        <div className='w-full mt-3 flex justify-between gap-3'>
                            <div>
                                <label>Publisher</label>
                                <input
                                    type='text'
                                    className='w-full p-2 border rounded-lg'
                                    value={Publisher}
                                    onChange={e => setPublisher(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Publish_date</label>
                                <input
                                    type='date'
                                    className='w-full p-2 border rounded-lg'
                                    value={Publish_date}
                                    onChange={e => setPublish_date(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='w-full mt-3 flex justify-between items-center'>
                            <div>
                                <label>Image</label>
                                <input
                                    type='file'
                                    accept='.png, .jpeg'
                                    className='w-full p-2 border rounded-lg'
                                    onChange={e => setCover(e.target.files[0])}
                                />
                            </div>
                            {/* {errors.Cover && <span className='text-red-500'>{errors.Cover}</span>} */}
                            <div>
                                {Cover &&
                                    <Image src={URL.createObjectURL(Cover)} width={100} height={200} />
                                }
                                {oldCover &&
                                    <Image src={process.env.NEXT_PUBLIC_API_NAME + "/" + oldCover} width={100} height={200} />
                                }
                            </div>
                        </div>
                        {/* <div className='w-full mt-3'>
                            <label>File</label>
                            <input
                                type='file'
                                accept='.epub'
                                className='w-full p-2 border rounded-lg'
                                onChange={e => setFile(e.target.files[0])}
                            />
                            {errors.File && <span className='text-red-500'>{errors.File}</span>}
                        </div> */}

                        <div className='w-full mt-3'>
                            <label>Category</label>
                            <select
                                className='w-full p-2 border rounded-lg'
                                onChange={e => setCategory(e.target.value)}
                                defaultValue={Category}
                            >
                                {ListCategory.map((item, index) => {
                                    if (item._id === Category) {
                                        return (
                                            <option key={index} value={item._id} selected>{item.CategoryName}</option>
                                        )
                                    } else {
                                        return (
                                            <option key={index} value={item._id}>{item.CategoryName}</option>
                                        )
                                    }
                                })}
                            </select>
                            {errors.Category && <span className='text-red-500'>{errors.Category}</span>}
                        </div>
                        <div className='w-full mt-3'>
                            <label>Description</label>
                            <textarea
                                className='w-full p-2 border rounded-lg' rows={5}
                                value={Description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='w-full p-2 border border-blue-400 rounded-lg'>
                        <div style={{ height: '100vh' }}>
                            <ReactReader
                                url={process.env.NEXT_PUBLIC_API_NAME + "/epub/" + File}
                                location={location}
                                locationChanged={(epubcfi) => setLocation(epubcfi)}
                            />
                        </div>
                    </div>
                </div>
                <div className='mt-5 flex justify-center'>
                    <button onClick={handleSubmit} className='text-white bg-blue-500 p-3 rounded-lg'>SAVE</button>
                </div>
            </div>
        </div>
    )
}

export default page