// ESM
import { v2 as cloudinary } from "cloudinary";

// Create a function to configure Cloudinary that will be called after environment variables are loaded
const configureCloudinary = () => {
  try {
    // Log the environment variables before configuration
    console.log('Configuring Cloudinary with:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'PRESENT' : 'MISSING'
    });

    // Configure Cloudinary with direct values (no string interpolation)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });

    // Verify configuration
    console.log('Cloudinary configuration successful');
  } catch (error) {
    console.error('Error configuring Cloudinary:', error);
  }
};

// Export both the cloudinary instance and the configuration function
export { configureCloudinary };
export default cloudinary;
