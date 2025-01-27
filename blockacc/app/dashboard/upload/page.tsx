// app/page.tsx (or wherever your upload component is located)
"use client";

import { useUser } from "@/lib/UserContext"
import { uploadFile } from "@/utils/supabase/storage/storage";
import { ChangeEvent, useRef, useState, useTransition } from "react";
import { convertBlobUrlToFile } from "@/utils/supabase/storage/convertURL";

export default function HomePage() {
  // const user = useUser(); // Access the user data here
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newImageUrls]);
    }
  };

  const [isPending, startTransition] = useTransition();

  const handleClickuploadFilesButton = async () => {
    startTransition(async () => {
      for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url);

        const { imageUrl, error } = await uploadFile({
          file: imageFile,
          bucket: "supa_files_bucket",
          userId: user.id, // Pass userId from context
        });

        if (error) {
          console.error("Error uploading file:", error);
          return;
        }

        console.log("Uploaded file:", imageUrl);
      }
      setImageUrls([]); // Clear the image URLs after upload
    });
  };

  return (
    <div className="bg-slate-500 min-h-screen flex justify-center items-center flex-col gap-8">
      <input
        type="file"
        hidden
        multiple
        ref={imageInputRef}
        onChange={handleImageChange}
        disabled={isPending}
      />
      <button
        className="bg-slate-600 py-2 w-40 rounded-lg"
        onClick={() => imageInputRef.current?.click()}
        disabled={isPending}
      >
        Select Images
      </button>
      <button
        onClick={handleClickuploadFilesButton}
        className="bg-slate-600 py-2 w-40 rounded-lg"
        disabled={isPending}
      >
        {isPending ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  );
}