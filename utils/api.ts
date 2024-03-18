import { createClient } from "@supabase/supabase-js";
import { PhotoDataTypes } from "../interfaces";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const api = {
  postPhoto: async (data: PhotoDataTypes) => {
    const response = await supabase.from("photos").insert([data]);
    return response;
  },

  getPhotos: async () => {
    const { data, error } = await supabase.from("photos").select("*");
    return data;
  },

  getPhotoByName: async (name: string) => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("name", name);
    return data;
  },

  suscribeToPhotos: (callback: (photos: PhotoDataTypes) => void) => {
    const subscription = supabase
      .channel("photos")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photos",
        },
        (payload) => callback(payload.new as PhotoDataTypes)
      )
      .subscribe();
    return subscription;
  },
};

export default api;

