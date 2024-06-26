"use client"
import React, { useActionState, useEffect, useState } from 'react'
import LayoutUser from '../../../components/layoutUser'
import LoadingSpin from '../../../components/loadingSpin'
import Image from 'next/image'
import ePub from "epubjs"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaBookBookmark } from "react-icons/fa6";
import { LinearProgress, Box, Typography, Rating } from "@mui/material";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
//import EpubViewer from '../../../components/epubViewer'
import { ReactReader } from 'react-reader'
import Swal from 'sweetalert2'

const comment = [
  { avatar: "", userName: '' }
]
const page = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.bookid;
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState()
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bookInstance, setBookInstance] = useState([]);
  const [cover, setCover] = useState("");

  const [rating, SetRating] = useState(0);
  const [titleRating, setTitleRating] = useState('');
  const [textComment, setTextComment] = useState('');
  const [listComment, setListComment] = useState([]);
  const [listMyFavourite, setListMyfavourite] = useState([]);
  const [isFavourite, setIsfavourite] = useState(false);
  const [errors, setErros] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/book/" + id, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        setBook(result);
        const epub = ePub(process.env.NEXT_PUBLIC_API_NAME + "/epub/" + result.File);
        setBookInstance(epub);
        epub.ready.then(async () => {
          await epub.locations.generate(1000);
          setTotalPages(epub.locations.total);
        });

        /////////////////////////////////////////////////////////
        const user = JSON.parse(localStorage.getItem("ebook_user"))
        if (user) {
          const token = user.token
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${token}`);
          const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
          };
          await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/auth/myfavourite", requestOptions)
            .then((response) => response.json())
            .then((result) => {
              const x = result.result
              for (const i of x) {
                if (i.Book_id._id === id) {
                  setIsfavourite(true);
                } else {
                  setIsfavourite(false);
                }
              }

            })
          await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/autosave/" + result._id, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.status === "ok") {
                setLocation(result.result.Location);
                setProgress(result.result.Progress)
              }
            });
        }

      })
      .catch((error) => console.error(error));
    await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/book/review/" + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log(result);
        setListComment(result);
      });
    setLoading(false)
  }

  useEffect(() => {
    if (bookInstance.locations) {
      const currentPage = bookInstance.locations.locationFromCfi(location);
      setCurrentPage(currentPage);
      setProgress(Math.ceil((currentPage / bookInstance.locations.length()) * 100));
    }
    const user = JSON.parse(localStorage.getItem("ebook_user"))
    if (user) {
      autoSaveLocation();
    }
  }, [location])
  useEffect(() => {
    if (rating === 0) {
      setTitleRating('');
    } else if (rating === 1) {
      setTitleRating('Useless')
    } else if (rating === 2) {
      setTitleRating('Poor')
    } else if (rating === 3) {
      setTitleRating('Ok')
    } else if (rating === 4) {
      setTitleRating('Good')
    } else if (rating === 5) {
      setTitleRating('Excellent')
    }
  }, [rating])


  const autoSaveLocation = async () => {
    const token = JSON.parse(localStorage.getItem('ebook_user')).token;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const raw = JSON.stringify({
      "Book_id": book._id,
      "Location": location,
      "Progress": progress
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/autosave", requestOptions)
      .then((response) => response.json())
      .catch(error => console.log('error', error));
  }

  const handdleFavourite = async () => {
    const user = JSON.parse(localStorage.getItem('ebook_user'));
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${user.token}`);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow"
    };
    setIsfavourite(!isFavourite);
    await fetch(process.env.NEXT_PUBLIC_API_NAME + '/api/auth/user/favorite?User_id=' + user.user._id + '&Book_id=' + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
      })
      .catch(error => console.log('error', error));
  }
  const handleComment = async () => {
    const error = {}
    if (rating <= 0) {
      error.Rating = "select rating";
    }
    if (!textComment) {
      error.textComment = "input comment";
    }
    setErros(error);
    //console.log(error)
    if (Object.keys(error).length <= 0) {
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem('ebook_user')).token;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        const raw = JSON.stringify({
          "Book_id": book._id,
          "User_id": JSON.parse(localStorage.getItem('ebook_user')).user._id,
          "Rating": rating,
          "Comment": textComment
        });

        const requestOptions = {
          method: "PUT",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/auth/user/review", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            setLoading(false);
            if (result) {
              window.location.reload();
            }

          })
          .catch(error => { setLoading(false); console.log('error', error) });

      } catch (err) {
        fetchData();
        Swal.fire({
          icon: "error",
          title: "You must log in first!",
          footer: '<a href="/login">Click for Login</a>'
        });
      }
    }

  }
  return (
    <div>
      <LayoutUser>
        <div className='w-[960px] container m-auto'>
          {loading ? <div className='m-auto'> <LoadingSpin /></div>
            :
            <>
              <div className=' flex justify-around  py-10 shadow-lg rounded-lg'>
                <div className='flex flex-col gap-3'>
                  <p>Title : <span className='font-bold'>{book.Title}</span></p>
                  <p>Author : <span className=''>{book.Author}</span></p>
                  <p>Publisher : <span className=''>{book.Publisher}</span></p>
                  <p className='flex'>Rating : <span className=' flex justify-start items-center'>{book.Rating !== 0 && [...Array(book.Rating)].map(() => { return (<MdOutlineStar size={25} color='gold' />) })}</span></p>
                  <p>Description : <span className=''>{book.Description}</span></p>
                  <div className='flex justify-start gap-2'>
                    <button onClick={handdleFavourite} className={`p-2 border rounded-lg flex justify-center items-center gap-2 ${isFavourite ? 'bg-pink-500 text-white' : 'bg-white text-pink-500'}`}>Favourite <FaHeart className={`${isFavourite ? 'bg-pink-500 text-white' : 'bg-white text-pink-500'}`} /></button>
  {/* <button className='p-2 border rounded-lg flex justify-center items-center gap-2 bg-blue-500 text-white'>Bookmark <FaBookBookmark /></button> */}
                  </div>
                </div>
                <div>
                  <Image alt="" src={process.env.NEXT_PUBLIC_API_NAME + "/" + book.Image} width={100} height={0} />
                </div>
              </div>
              <div className='my-5 border-2 rounded-lg overflow-hidden'>
                <div style={{ height: '100vh' }}>
                  <ReactReader
                    url={process.env.NEXT_PUBLIC_API_NAME + "/epub/" + book.File}
                    location={location}
                    locationChanged={(epubcfi) => setLocation(epubcfi)}
                  />
                </div>
              </div>
              {/* comment */}
              <div className='mt-14  border-t-2'>
                <div className='w-[960px] container m-auto shadow-lg p-5 my-5'>
                  <div className='w-full flex justify-between gap-10'>
                    <div className='w-[40%]'>
                      <h1 className=' text-xl py-3 border-b-2'>Comment</h1>
                      <div className='py-3 flex justify-between items-center'>
                        <div>
                          {[...Array(5)].map((star, index) => {
                            return (
                              <>
                                {index + 1 <= rating ?
                                  <button onClick={() => SetRating(index + 1)}><MdOutlineStar size={30} className=' text-yellow-300 ' /></button>
                                  :
                                  <button onClick={() => SetRating(index + 1)} ><MdOutlineStarBorder size={30} className=' text-yellow-300' /></button>
                                }
                              </>
                            )
                          })}
                        </div>
                        {titleRating}
                      </div>
                      <span className='text-red-500'>{errors && errors.Rating}</span>
                      <div className='flex justify-start gap-3'>
                        <input
                          type='text'
                          className=' border p-2 rounded-lg'
                          value={textComment}
                          onChange={(e) => setTextComment(e.target.value)} />
                        <button onClick={handleComment} className='p-2 bg-green-500 text-white rounded-lg'>sent</button>
                      </div>
                      <span className='text-red-500'>{errors && errors.textComment}</span>
                    </div>
                    <div className='w-[600%]'>
                      <h1 className=' text-xl py-3 border-b-2 text-end'>List Comment</h1>
                      <div className='mt-3 p-4 w-full h-[500px] border rounded-lg overflow-hidden scroll-auto bg-lime-50'>
                        {listComment && listComment.map((item, index) => {
                          return (
                            <div key={index} className=' w-full  p-3 border-b-2'>
                              <div className=' flex justify-between items-center'>
                                <div className=' flex justify-start items-center gap-2'>
                                  <div className=' w-15 h-15 overflow-hidden rounded-full'>
                                    <Image alt='avarta' src={process.env.NEXT_PUBLIC_API_NAME + "/" + item.User_id.Avatar} width={50} height={50} />
                                  </div>
                                  <div>
                                    <h1 className=' font-bold'>{item.User_id.Username}</h1>
                                    <p>{item.Comment}</p>
                                  </div>
                                </div>
                                <div className=' flex justify-start items-start'>
                                  {[...Array(5)].map((start, index) => {
                                    return (
                                      <div key={index}>
                                        {index + 1 <= item.Rating ? <MdOutlineStar size={20} color='gold' /> : <MdOutlineStarBorder size={20} color='gold' />}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=' w-full fixed bottom-0 z-50'>
                <div className='w-[200px] container ps-5'>
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="body2" color="textSecondary">{progress}% read</Typography>
                  </Box>
                </div>
              </div>
            </>
          }
        </div>
      </LayoutUser>

    </div>
  )
}

export default page
