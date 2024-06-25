"use client"
import React, { useEffect, useState } from 'react';
import Backdrop from '../../../../components/backdrop'
import Image from 'next/image';
const page = () => {
  const [userList, setUserList] = useState([])
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetchdata();
    setLoading(false);
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
    await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/admin/users", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setUserList(result)
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <>
      {loading && <Backdrop />}
      <div className='w-full border-b-2 p-3'>
        <p>User List</p>
      </div>
      <div className='mt-10'>
        <table className='mt-5 w-full table-auto border rounded-lg'>
          <thead className=''>
            <tr className='w-full bg-blue-500 text-white'>
              <th className='py-2'>ID</th>
              <th>Avatar</th>
              <th>UserName</th>
              <th>Email</th>
              <th>Full name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {!loading &&
              userList && userList.map((item) => {
                return (
                  <tr className='w-full border-t-2 border-b-2 hover:bg-slate-200'>
                    <td className='text-start'>{item._id}</td>
                    <td className='py-2 text-center flex justify-center items-center'><Image alt="" src={process.env.NEXT_PUBLIC_API_NAME + "/" + item.Avatar} width={50} height={0} /></td>
                    <td className=' text-center'>{item.Username}</td>
                    <td className=' text-center'>{item.Email}</td>
                    <td className=' text-center'>{item.Fullname}</td>
                    <td className=' text-center'>{item.role}</td>
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
    </>
  )
}

export default page