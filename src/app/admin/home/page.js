"use client"
import React, { useEffect, useState } from 'react'
import { BsPeopleFill } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { BeatLoader } from 'react-spinners';
import { Chart as ChartJS } from 'chart.js/auto'
import { Pie } from 'react-chartjs-2';
const page = () => {
  const [dashboard1, setDashboar1] = useState([]);
  const [rangRating, setRangRating] = useState([]);
  const [rangFavourite, setRangFavourite] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetchdata();
    setLoading(false)
  }, [])
  const fetchdata = async () => {
    const token = JSON.parse(localStorage.getItem('ebook_user')).token;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/admin/dashboard1", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log(result)
        setDashboar1(result)
      })
      .catch((error) => {
        console.error(error);
      });
    await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/admin/avgrating", requestOptions)
      .then((response) => response.json())
      .then((result1) => {
        //console.log(result1.result)
        setRangRating(result1.result)
      })
      .catch((error) => {
        console.error(error);
      });
    await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/admin/avgfavourite", requestOptions)
      .then((response) => response.json())
      .then((result2) => {
        //console.log(result2.result)
        setRangFavourite(result2.result)
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const Spinner = () => {
    return (
      <BeatLoader color="#36d7b7" size={10} loading />
    )
  }
  if (!loading) {
    if (rangRating[0]) {
      console.log(rangRating.name)
    }

  }
  return (
    <div>
      <div className='w-full border-b-2 p-3'>
        <p>Dash Borad</p>
      </div>
      {/* Show Count */}
      <div className=' mt-5 flex justify-start gap-4'>
        <div className='w-[180px] p-3 flex justify-around items-center bg-blue-500 text-white rounded-lg'>
          <BsPeopleFill size={30} />
          <div>
            <p className=' text-center'>Count User</p>
            <hr></hr>
            <p className=' text-center'>
              {loading ?
                <Spinner /> :
                dashboard1 && dashboard1.numUser
              }
            </p>
          </div>
        </div>
        <div className='w-[180px] p-3 flex justify-around items-center bg-lime-500 text-white rounded-lg'>
          <FaBookOpen size={30} />
          <div>
            <p className=' text-center'>Count Book</p>
            <hr></hr>
            <p className=' text-center'>
              {loading ?
                <Spinner /> :
                dashboard1 && dashboard1.numBook
              }
            </p>
          </div>
        </div>
      </div>
      {/* Show table top book rating ,favourite */}
      <div className=' mt-5'>
        <div className=' flex justify-start gap-3'>
          <div className='w-[70%] p-2 border bg-white shadow-lg rounded-lg'>
            <p className=' font-bold'>Top 5 Book Rating</p>
            <table className='w-full'>
              <thead>
                <tr className=' bg-blue-500 text-white'>
                  {/* <th>ID</th> */}
                  <th>Name</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {loading ?
                  <tr><td><Spinner /></td></tr> :
                  dashboard1 && dashboard1.bookRating && dashboard1.bookRating.map((item) => {
                    return (
                      <tr>
                        {/* <td className='border'>{"..." + item._id.slice(-5)}</td> */}
                        <td className='border'>{item.Title}</td>
                        <td className='border'>{item.Author}</td>
                        <td className='border'>{item.Category&&item.Category.CategoryName}</td>
                        <td className='border text-blue-500'>{item.Rating}</td>

                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          <div className='w-[30%] p-2 border bg-white shadow-lg rounded-lg'>
            <p className=' font-bold'>Top 3 Category Rating</p>
            <Pie data={{
              labels: [
                !loading && rangRating[0] && rangRating[0].name,
                !loading && rangRating[1] && rangRating[1].name,
                !loading && rangRating[2] && rangRating[2].name
              ],
              datasets: [{
                label: 'rating',
                data: [
                  !loading && rangRating[0] && rangRating[0].rating,
                  !loading && rangRating[1] && rangRating[1].rating,
                  !loading && rangRating[2] && rangRating[2].rating
                ],
                backgroundColor: [
                  'rgb(255, 99, 132)',
                  'rgb(54, 162, 235)',
                  'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
              }]
            }} />
          </div>
        </div>
      </div>
      <div className=' mt-5'>
        <div className=' flex justify-start gap-3'>
          <div className='w-[70%] p-2 border bg-white shadow-lg rounded-lg'>
            <p className=' font-bold'>Top 5 Book Favoutite</p>
            <table className='w-full'>
              <thead>
                <tr className=' bg-pink-500 text-white'>
                  {/* <th>ID</th> */}
                  <th>Name</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Favourite</th>
                </tr>
              </thead>
              <tbody>
                {loading ?
                  <tr><td><Spinner /></td></tr> :
                  dashboard1 && dashboard1.bookFavourite && dashboard1.bookFavourite.map((item) => {
                    return (
                      <tr>
                        {/* <td className='border'>{"..." + item._id.slice(-5)}</td> */}
                        <td className='border'>{item.Title}</td>
                        <td className='border'>{item.Author}</td>
                        <td className='border'>{item.Category&&item.Category.CategoryName}</td>
                        <td className='border text-blue-500'>{item.Favourite}</td>

                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          <div className='w-[30%] p-2 border bg-white shadow-lg rounded-lg'>
            <p className=' font-bold'>Top 3 Category Favourite</p>
            <Pie data={{
              labels: [
                !loading && rangFavourite[0] && rangFavourite[0].name,
                !loading && rangFavourite[1] && rangFavourite[1].name,
                !loading && rangFavourite[2] && rangFavourite[2].name
              ],
              datasets: [{
                label: 'favourite',
                data: [
                  !loading && rangFavourite[0] && rangFavourite[0].favourite,
                  !loading && rangFavourite[1] && rangFavourite[1].favourite,
                  !loading && rangFavourite[2] && rangFavourite[2].favourite
                ],
                backgroundColor: [
                  'rgb(255, 99, 132)',
                  'rgb(54, 162, 235)',
                  'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
              }]
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page