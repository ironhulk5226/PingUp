// ESM
import ImageKit from "imagekit";

// Create a function to configure ImageKit
const configureImageKit = () => {
  try {
    // Log the environment variables (masking private key for security)
    console.log("Configuring ImageKit with:", {
      publicKey:`${process.env.IMAGEKIT_PUBLIC_KEY}`,
      privateKey:`${process.env.IMAGEKIT_PRIVATE_KEY}` ? "PRESENT" : "MISSING",
      urlEndpoint:`${process.env.IMAGEKIT_URL_ENDPOINT}`,
    });

    const imagekit = new ImageKit({
      publicKey:`${process.env.IMAGEKIT_PUBLIC_KEY}`,
      privateKey:`${process.env.IMAGEKIT_PRIVATE_KEY}`,
      urlEndpoint:`${process.env.IMAGEKIT_URL_ENDPOINT}`,
    });

    console.log("ImageKit configuration successful");
    return imagekit;
  } catch (error) {
    console.error("Error configuring ImageKit:", error);
    throw error;
  }
};

// Create a single instance so it can be reused across your app
// const imagekit = configureImageKit();

// Export both
export { configureImageKit };
// export default imagekit;
