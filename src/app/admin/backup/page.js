"use client"
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
const page = () => {
  const [loading, setLoading] = useState(false)
  const handdleBackup = async () => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem('ebook_user')).token;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/admin/backup", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //console.log(result)
        setLoading(false);
        if (result.status === 'ok') {
          Swal.fire({
            title: "Sucess",
            icon: "success"
          });
        }else{
          Swal.fire({
            title: "Error",
            icon: "error"
          });
        }
        //console.log(result)
        //setListCategory(result)
      })
      .catch((error) => {
        setLoading(true);
        console.error(error)
      });
  }
  const AlertLoading = () => {
    let timerInterval;
    Swal.fire({
      title: "Backup data",
      text: "Wait for upload",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      confirmButtonText: 'CLOSE',
      allowOutsideClick: false, // ป้องกันการคลิกภายนอกป๊อปอัป
      allowEscapeKey: false,    // ป้องกันการกดปุ่ม ESC เพื่อปิดป๊อปอัป
      allowEnterKey: false      // ป้องกันการกดปุ่ม Enter เพื่อปิดป๊อปอัป
    })
  }
  return (
    <div>
      {loading && <AlertLoading />}
      <button onClick={handdleBackup} className=' bg-blue-500 p-2 text-white rounded-lg'>Backup</button>
    </div>
  )
}

export default page