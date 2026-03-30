// lib/uploadImage.ts
import axios from "axios";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "flipbook_unsigned"); // from Cloudinary

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dshhe6ovi/image/upload",
    formData,
  );

  return res.data.secure_url;
}
