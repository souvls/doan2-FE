"use client";
import React, { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";
import Backdrop from '../../../../components/backdrop'
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Image from 'next/image';
import Link from 'next/link';
import Swal from 'sweetalert2';
const page = () => {
  const [booklist, setBooklist] = useState([]);
  const [booklistCurrent, setBooklistCurrent] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [numShow, setNumShow] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");
  useEffect(() => {
    fetchdata();
  }, []);
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
    await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/admin/books", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setPageCount(result.length);
        setBooklist(result);
        setBooklistCurrent(result)
        setPageCount(result.length / 5)

      })
      .catch((error) => {
        console.error(error);
      });
    await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/category", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setCategoryList(result)
      })
      .catch((error) => {
        console.error(error);
      });
    setLoading(false);
  }
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage);
  };
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Do you sure?",
      text: "delete book id " + id,
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      icon: "question",
      denyButtonText: `Delete`
    }).then(async (result) => {
      if (result.isDenied) {
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
        await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/admin/book/" + id, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result.status === 'ok') {
              fetchdata();
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
    });
  }
  const handleSearch = async () => {
    const result = [];
    if (key !== "") {
      for (const i of booklist) {
        if (i.Title.toLowerCase().startsWith(key.toLowerCase()) || i.Title.toLowerCase().endsWith(key.toLowerCase())) {
          result.push(i);
        }
      }
      setBooklistCurrent(result)
    } else {
      setBooklistCurrent(booklist)
    }
  }
  const handleCGR = (e) => {
    const result = []
    if (e.target.value !== '') {
      for (const i of booklist) {
        if (i.Category._id === e.target.value) {
          result.push(i);
        }
      }
      setBooklistCurrent(result)
    }
    else {
      setBooklistCurrent(booklist)
    }
  }
  return (
    <>
      {loading && <Backdrop />}
      <div className='w-full border-b-2 p-3'>
        <p>List book</p>
      </div>
      <div className='mt-10'>
        <div className=' flex justify-between items-center'>
          <div>
            <input
              type='text'
              className=' border p-2 rounded-lg me-2'
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <button onClick={handleSearch} className=' bg-blue-500 text-white p-2 rounded-lg'>SEARCH</button>
          </div>
          <div>
            <select onChange={handleCGR} className=' border p-2 rounded-lg'>
              <option value={''}>All...</option>
              {categoryList.map(item => {
                return (
                  <option value={item._id}>{item.CategoryName}</option>
                )
              })}
            </select>
          </div>
        </div>
        <table className='mt-5 w-full table-auto border rounded-lg'>
          <thead className=''>
            <tr className='w-full bg-blue-500 text-white'>
              <th className='py-2'>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>Publish_date</th>
              <th>Cover</th>
              <th>Category</th>
              {/* <th>Description</th> */}
              <th>Rating</th>
              <th>Favourite</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {!loading &&
              booklistCurrent && booklistCurrent.map((item) => {
                return (
                  <tr className='w-full border-t-2 border-b-2 hover:bg-slate-200'>
                    <td className='text-start'>{"..." + item._id.slice(-3)}</td>
                    <td className='text-center font-medium'>{item.Title}</td>
                    <td className='text-center'>{item.Author}</td>
                    <td className='text-center'>{item.Publisher}</td>
                    <td className='text-center'>{item.Publish_date}</td>
                    <td className='py-2 text-center flex justify-center items-center'><Image alt="" src={process.env.NEXT_PUBLIC_API_NAME + "/" + item.Image} width={50} height={0} /></td>
                    <td className='text-center'>{item.Category&&item.Category.CategoryName}</td>
                    {/* <td className='text-start'>{item.Description}</td> */}
                    <td className='text-center'>{item.Favourite}</td>
                    <td className='text-center'>{item.Rating}</td>
                    <td className=''><Link href={"/admin/book/edit/" + item._id} className='flex justify-center items-center'><MdEdit color='blue' size={20} /></Link></td>
                    <td className=''><button onClick={() => handleDelete(item._id)} className='flex justify-center items-center'><MdDelete color='red' size={20} /></button></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      <div className=''>
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

      </div>
    </>
  )
}

export default page