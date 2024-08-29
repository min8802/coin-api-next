import { createClient } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";

export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
//fetchPostOwner를 fetchOwner로 변경함
export const fetchOwner = async (
  userId: string,
  setNickname: Dispatch<SetStateAction<string>>
) => {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching proifle: ", error);
  } else {
    if (data.length === 0) {
      setNickname(`#${userId.substring(userId.length - 4)}`);
    } else {
      setNickname(data[0].nickname);
    }
  }
};