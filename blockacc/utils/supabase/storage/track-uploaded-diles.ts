import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!);

interface TrackFileParams {
  userId: string;
  bucket: string;
  path: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  isPrivate?: boolean;
}

export async function trackUploadedFile({
  userId,
  bucket,
  path,
  fileName,
  fileSize,
  contentType,
  isPrivate = true,
}: TrackFileParams) {
  const { data, error } = await supabase
    .from("user_uploaded_files")
    .insert([
      {
        user_id: userId,
        bucket_name: bucket,
        file_path: path,
        file_name: fileName,
        file_size: fileSize,
        content_type: contentType,
        is_private: isPrivate,
      },
    ]);

  if (error) {
    console.error("Error inserting file metadata:", error);
    return { success: false, error };
  }

  return { success: true, data };
}
