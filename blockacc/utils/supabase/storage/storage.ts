// utils/supabase/storage/storage.ts
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

function getStorage() {
  const { storage } = createClient();
  return storage;
}

export const uploadFile = async ({
  file,
  bucket,
  folder = "private",
  userId,
}: {
  file: File;
  bucket: string;
  folder?: string;
  userId: string;
}) => {
  const supabase = createClient();
  const path = `${folder}/${uuidv4()}-${file.name}`;

  console.log("Uploading file to path:", path);

  // Upload the file to Supabase Storage
  const { data, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (uploadError) {
    console.error("File upload failed:", uploadError);
    return { imageUrl: "", error: "File upload failed" };
  }

  console.log("File uploaded successfully. Inserting metadata...");

  // Insert file metadata into the database
  const { error: dbError } = await supabase
    .from("user_uploaded_files")
    .insert([
      {
        user_id: userId,
        bucket_name: bucket,
        file_path: path,
        file_name: file.name,
        file_size: file.size,
        content_type: file.type,
        is_private: folder === "private",
      },
    ]);

  if (dbError) {
    console.error("Error inserting file metadata:", dbError);
    return { imageUrl: "", error: "Metadata tracking failed" };
  }

  console.log("Metadata inserted successfully.");

  return {
    imageUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${path}`,
    error: "",
  };
};

export const deleteImage = async (imageUrl: string) => {
  const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
  const firstSlashIndex = bucketAndPathString.indexOf("/");

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).remove([path]);

  return { data, error };
};