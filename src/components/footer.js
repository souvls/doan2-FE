import React from 'react'
import { SlSocialFacebook } from "react-icons/sl";
import { SlSocialSkype } from "react-icons/sl";
import { SlSocialYoutube } from "react-icons/sl";
const footer = () => {
    return (
        <div className=' bg-slate-500'>
            <div className="container w-[960px] m-auto">
                <div className='py-20 flex justify-between'>
                    <div className="text-white">
                        <p>Đồ án 2: Xay đựng ứng dụng đọc sách trực tuyến</p>
                        <p>Sinh viện thực hiện: Soulixai VILASIT</p>
                        <p>Lớp: Kỹ thuật phần mềm K43, Khoa CNTT, Trường Đại học Quy Nhơn</p>
                        <p>Giáo viện hưởng dẫn: Phạm Văn Việt</p>
                    </div>
                    <div className=' flex justify-center items-center gap-5'>
                        <SlSocialFacebook color='white' size={50}/>
                        <SlSocialSkype color='white' size={50}/>
                        <SlSocialYoutube color='white' size={50}/>
                    </div>
                </div>
            </div>
            <div className='bg-black py-2'>
                <p className='text-center  text-red-500'>Copyright@2024 soulixai vilasit</p>
            </div>
        </div>
    )
}

export default footer