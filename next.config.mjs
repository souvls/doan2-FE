/** @type {import('next').NextConfig} */
const nextConfig = {
eslint: {
    ignoreDuringBuilds: true,
},
    images: {
        //domains: ['localhost'], 
        domains:['doan2-be.onrender.com']
      },
};

export default nextConfig;
