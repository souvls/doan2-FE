"use client";
import Image from "next/image";
import bg1 from "../assets/backgound/bg1.svg";

//component
import LayoutUser from '../components/layoutUser'
import Feature from "../components/feature";
import Popular from "../components/RandomBook";
import Seach from "../components/search";
import { use, useEffect, useState } from "react";
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [favouriteList, setFavouriteList] = useState([]);

  return (
    <LayoutUser>
      <main className="w-full h-auto">
        <div className=" relative">
          <div>
            <Image alt="" src={bg1} className="w-[100%]" />
          </div>
          <div className=" absolute right-[10%] top-24">
            <h1 className="text-white text-3xl font-bold bg-red-600 shadow-lg p-9 rounded-lg">
              WELLCOME TO MYEBOO.COM
            </h1>
            <div className="mt-5">
              <Seach />
            </div>
          </div>
        </div>
        <Feature />
        <Popular />
      </main>
    </LayoutUser>
  );
}
