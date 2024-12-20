import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config();
// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Environment variable for Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY, // Environment variable for API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Environment variable for API Secret
});

// Export the configured Cloudinary instance
export default cloudinary;
