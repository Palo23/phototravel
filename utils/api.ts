import { createClient } from "@supabase/supabase-js";
import { PhotoDataTypes } from "../interfaces";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const api = {
  postPhoto: async (data: PhotoDataTypes) => {
    const response = await supabase.from("travel").insert([data]);
    return response;
  },

  getPhotos: async (name?: string) => {
    if (name && name.trim() !== '') {
        const { data, error } = await supabase
            .from("travel")
            .select("*")
            .filter("name", "ilike", `%${name}%`)
        return data;
    } else {
        const { data, error } = await supabase.from("travel").select("*");
        return data;
    }
},

  getPhotoByName: async (name: string) => {
    const { data, error } = await supabase
      .from("travel")
      .select("*")
      .ilike("name", `%${name}%`);
    return data;
  },

  getPhotoByTravelName: async (travelName: string) => {
    const { data, error } = await supabase
      .from("travel")
      .select("*")
      .eq("travel_name", travelName);
    return data;
  },

  suscribeToPhotos: (callback: (photos: PhotoDataTypes) => void) => {
    const subscription = supabase
      .channel("travel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "travel",
        },
        (payload) => callback(payload.new as PhotoDataTypes)
      )
      .subscribe();
    return subscription;
  },

  getTravelNames: async () => {
    const { data, error } = await supabase
      .from("travel")
      .select("travel_name");

    if (error) {
        console.error(error);
        return [];
    }

    const uniqueTravelNames = Array.from(new Set(data.map(item => item.travel_name)));

    return uniqueTravelNames;
  }
};

export default api;

