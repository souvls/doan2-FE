import React, { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { FaBookOpen } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdBackup } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { FaChartLine } from "react-icons/fa";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
const sideBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [toogle1, setToggle1] = useState(false);
    const [toogle2, setToggle2] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    }
    return (
        <div className='w-[250px] bg-blue-500 h-full fixed top-0 left-0 z-50'>
            <div className=' relative h-full w-full'>
                <div>
                    <p className='text-white font-bold text-xl text-center m-5'>Admin System</p>
                </div>
                <div className=''>
                    <Link href="/admin/home" className={`w-full px-5 py-2 hover:bg-blue-900  hover:text-white hover:duration-500 ease-in-out flex justify-start items-center gap-3 ${pathname === '/admin/home' ? ' text-black bg-white' : 'text-white'}`}><FaChartLine size={30} /> <span>Dash Board</span></Link>
                </div>
                <div className={`w-full px-5 py-2 hover:bg-blue-900 hover:text-white  hover:duration-500 ease-in-out ${pathname.startsWith("/admin/book/") || pathname.startsWith("/admin/category/") ? ' text-black bg-white' : 'text-white'}`}>
                    <div onClick={() => setToggle1(!toogle1)} className='flex justify-between items-center'>
                        <p className='flex justify-start items-center gap-3'><FaBookOpen size={30} /> <span>Book Manager</span></p>
                        <IoIosArrowDown />
                    </div>
                    <div className={`bg-white rounded-lg text-blue-500 px-3 py-3 flex flex-col transition duration-500 ease-in-out ${!toogle1 && 'hidden'}`} >
                        <Link href="/admin/book/list" className='py-2hover:text-blue-900'>Book List</Link>
                        <Link href="/admin/book/add" className='py-2 hover:text-blue-900'>Book Add</Link>
                        <Link href="/admin/category/list" className='py-2 hover:text-blue-900'>Category List</Link>
                    </div>
                </div>
                <div className={`w-full px-5 py-2 hover:bg-blue-900 hover:text-white  hover:duration-500 ease-in-out ${pathname.startsWith("/admin/user") ? 'text-black bg-white' : 'text-white'}`}>
                    <div onClick={() => setToggle2(!toogle2)} className='flex justify-between items-center'>
                        <p className='flex justify-start items-center gap-3'><HiUserGroup size={30} /> <span>User Manager</span></p>
                        <IoIosArrowDown />
                    </div>
                    <div className={`bg-white rounded-lg text-blue-500 px-3 py-3 flex flex-col transition duration-500 ease-in-out ${!toogle2 && 'hidden'}`} >
                        <Link href="/admin/user/list" className='py-2 hover:text-blue-900'>User List</Link>
                    </div>
                </div>
                <div>
                    <Link href="/admin/backup" className={`w-full px-5 py-2 hover:bg-blue-900 hover:text-white  hover:duration-500 ease-in-out flex justify-start items-center gap-3 ${pathname === '/admin/backup' ? 'text-black bg-white' : 'text-white'}`}><MdBackup size={30} /> <span>Backup Data</span></Link>
                </div>
                <div className='w-full absolute bottom-10 px-5 py-2 text-red-50' >
                    <div onClick={handleLogout} className='w-full flex justify-center items-center'>
                        <button className='flex justify-start items-center gap-3 bg-white p-3 rounded-lg text-red-500'><CiLogout size={30} /> <span>Log out</span></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default sideBar