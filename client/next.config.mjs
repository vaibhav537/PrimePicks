/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:"dbqb13byp"
    },
    images: {
        domains: ["res.cloudinary.com"]
    }
};

export default nextConfig;
