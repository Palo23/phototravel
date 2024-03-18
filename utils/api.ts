import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

interface PhotoDataTypes {
    name: string,
    url: string,
}

const api = {
    postPhoto: async (data: PhotoDataTypes) => {
        const response = await supabase
            .from('photos')
            .insert([data]);
        return response;
    },

    getPhotos: async () => {
        const { data, error } = await supabase
            .from('photos')
            .select('*');
        return data;
    },

    getPhotoByName: async (name: string) => {
        const { data, error } = await supabase
            .from('photos')
            .select('*')
            .eq('name', name);
        return data;
    }
}

export default api;