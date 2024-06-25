"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import usericon from "../assets/usericon/3.png";
import { FaBookBookmark } from "react-icons/fa6";
import Swal from "sweetalert2";


const navbar = ({ props }) => {
  const pathname = usePathname();
  const [user, setUser] = useState([]);
  const [myfavourites, setMyFavourite] = useState([]);
  const [myBookmark, setBookmark] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  const navlink = [
    { link: "/", name: "HOME" },
    { link: "/feature", name: "FEATURED" },
    { link: "/random", name: "RANDOM" },
    { link: "/contact", name: "CONTACT" },
    { link: "/about", name: "ABOUT" },
  ];

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("ebook_user"));
    if (getUser) {
      setIsLogin(true);
      setUser(getUser);
      getMyFavourite();
    }
  }, []);

  const getMyFavourite = async () => {
    const getUser = JSON.parse(localStorage.getItem("ebook_user"));
    const token = getUser.token
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
        //console.log(result.result)
        setMyFavourite(result.result);
      }).catch(err => {
        console.log(err)
      });
    await fetch(process.env.NEXT_PUBLIC_API_NAME + "/api/auth/mybookmark", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setBookmark(result.result);
      }).catch(err => {
        console.log(err)
      });
  }
  const LoginArea = () => {
    return (
      <>
        <div className="flex gap-5 items-center">
          <Link href="/login" className="bg-gradient-to-r from-cyan-500 to-blue-500 px-2 text-white rounded-lg">LOGIN</Link>
          <Link href="/register">REGISTER</Link>
        </div>
      </>
    )
  };
  //console.log(user)
  const UserInfo = () => {
    const [isHover, setIshover] = useState(false);
    const handdleLogout = () => {
      Swal.fire({
        title: "Logout ?",
        text: "Are you sure logout?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: "Logout",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          window.location.href = "/"
        }
      });
    }
    const handdleFavourite = () => {
      //console.log(myfavourites)
      const myList = myfavourites.map((item) => {
        return (`
          <li>
            <a href="/book/${item.Book_id._id}" class="w-full block p-2 bg-slate-100 rounded-lg hover:shadow-lg hover:border-2 border-pink-500">
            <div class="flex justify-start items-start gap-2">
              <div>
                <img src="${process.env.NEXT_PUBLIC_API_NAME + "/" + item.Book_id.Image}" width="30"/>
              </div>
              <div>
                <p class='text-start text-sm'>${item.Book_id.Title}</p>
                <p class='text-start text-sm'>${item.Book_id.Author}</p>
              </div>
            </div>
              
            </a>
          </li>`)
      }).join('')
      Swal.fire({
        html: `
        <p class="py-2 text-pink-500">MY FAVOURITE</p>
        <ul class=" grid grid-cols-1 gap-1">
        ${myList}
        </ul>
        `,
        confirmButtonText: 'CLOSE',
        allowOutsideClick: false, // ป้องกันการคลิกภายนอกป๊อปอัป
        allowEscapeKey: false,    // ป้องกันการกดปุ่ม ESC เพื่อปิดป๊อปอัป
        allowEnterKey: false      // ป้องกันการกดปุ่ม Enter เพื่อปิดป๊อปอัป
      });
    }
    const handdleBookmark = async () => {
      const myList = myBookmark.map((item) => {
        return (`
          <li>
            <a href="/book/${item.Book_id._id}" class="w-full block p-2 bg-slate-100 rounded-lg hover:shadow-lg hover:border-2 border-blue-500">
            <div class="flex justify-start items-start gap-2">
              <div>
                <img src="${process.env.NEXT_PUBLIC_API_NAME + "/" + item.Book_id.Image}" width="30"/>
              </div>
              <div class="w-full">
                <p class='text-start text-sm'>${item.Book_id.Title}</p>
                <p class='text-start text-sm'>${item.Progress}%</p>
                <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div class="bg-blue-600 h-2 rounded-full" style="width: ${item.Progress}%"></div>
                </div>
              </div>
            </div>
            </a>
          </li>`)
      }).join('')
      Swal.fire({
        html: `
        <p class="py-2 text-blue-500">MY BOOKMARK</p>
        <ul class=" grid grid-cols-1 gap-1">
        ${myList}
        </ul>
        `,
        confirmButtonText: 'CLOSE',
        allowOutsideClick: false, // ป้องกันการคลิกภายนอกป๊อปอัป
        allowEscapeKey: false,    // ป้องกันการกดปุ่ม ESC เพื่อปิดป๊อปอัป
        allowEnterKey: false      // ป้องกันการกดปุ่ม Enter เพื่อปิดป๊อปอัป
      });
    }
    return (
      <>
        <div className="flex justify-start items-center gap-5 relative">
          <div className="w-full flex items-center gap-2" onMouseEnter={() => setIshover(true)}>
            <div className="flex justify-center items-center">
              <Image src={process.env.NEXT_PUBLIC_API_NAME + "/" + user.user.Avatar} width={40} height={40} />
            </div>
            <p className=" bg-red-400 rounded-full px-2 text-white">{user.user.Username}</p>
          </div>
          <div className={`w-full absolute -bottom-[170px] bg-white rounded-lg px-2 ${!isHover && 'hidden'}`} onMouseEnter={() => setIshover(true)} onMouseLeave={() => setIshover(false)}>
            <div className="w-full text-sm">
              <button className="w-full hover:bg-red-500 py-2 hover:text-white duration-500 ease-in-out rounded-lg">My Info</button>
            </div>
            <div className="w-full text-sm">
              <button className="w-full  hover:bg-pink-500 py-2 hover:text-white duration-500 ease-in-out rounded-lg" onClick={handdleFavourite}>My Favourite</button>
            </div>

            <div className="text-sm">
              <button className="w-full  hover:bg-blue-500 py-2 hover:text-white duration-500 ease-in-out rounded-lg" onClick={handdleBookmark}>My Bookmark</button>
            </div>
            {user.user.role === "admin" &&
              <Link href={"/admin/home"} className="flex w-full  hover:bg-blue-500 py-2 hover:text-white duration-500 ease-in-out rounded-lg">Admin</Link>
            }
            <div className="py-2 text-red-500">
              <button onClick={handdleLogout} className=" w-full bg-red-500 text-white p-2">Log Out</button>
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <div className=" w-full shadow-lg rounded-b-2xl bg-[#f3f2ec] fixed top-0 z-50">
      <div className=" container m-auto">
        <div className="py-5 px-5 flex justify-between items-center">
          <div>
            <h1 className=" font-bold text-2xl text-red-500">My Ebook</h1>
          </div>
          <div className="h-full flex justify-between items-center gap-10">
            {navlink.map((item, index) => {
              const isActive = pathname === item.link ? true : false;
              const active = "border-b border-slate-400";
              return (
                <Link
                  key={index}
                  href={item.link}
                  className={`h-full hover:border-b border-slate-400 ${isActive && active
                    } `}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div>{isLogin ? <UserInfo /> : <LoginArea />}</div>
        </div>
      </div>
    </div>
  );
}


export default navbar;
