import axios from "axios";

// Function to upload pictures and return the URLs
export async function uploadPictures(pictures: FileList): Promise<string[]> {
  const pictureUrls: string[] = [];

  if (pictures && pictures.length > 0) {
    const formData = new FormData();

    Array.from(pictures).forEach((file) => {
      formData.append("pictures", file);
    });

    try {
      const response = await axios.post("/your-upload-endpoint", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Assuming the backend returns an array of URLs of the uploaded images
      return response.data.pictureUrls;
    } catch (error) {
      console.error("Error uploading pictures:", error);
      throw new Error("Failed to upload pictures");
    }
  }

  return pictureUrls;
}
