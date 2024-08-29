"use client";

import CommentCard from "@/components/CommentCard";
import { getKoreanCurrency } from "@/lib/KoreanCurrency";
import { fetchOwner, supabaseClient } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthContext";
import { Image } from "@chakra-ui/next-js";
import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const Post: NextPage = () => {
  const [coin, setCoin] = useState<Coin>();
  const [createdAt, setCreatedAt] = useState<Date>();
  const [post, setPost] = useState<Post>();
  const [nickname, setNickname] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);

  //postId
  const { id } = useParams();
  const router = useRouter();

  const { session } = useAuth();

  const onClickCreateComment = async () => {
    if (!text || !session) return;

    const { data, error } = await supabaseClient
        .from("comment")
        .insert({ text, post_id: id, user_id: session.user.id })
        .select("*")
        .single();

        if (error) {
            console.error("Error creating comment: ", error);
        } else {
            console.log("data", data);
            setText("");
            setComments([...comments, data]);
        }

    console.log("data", data);
    console.log("error", error);
  };

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching posts: ", error);

        router.push("/posts");
      } else {
        setPost(data);
      }
    };
    const fetchComments = async () => {
        const { data, error } = await supabaseClient
        .from("comment")
        .select("*")
        .eq("post_id", id)
        .order("id", { ascending: true });
  
        if (error) {
          console.error("Error fetching posts: ", error);
  
          router.push("/posts");
        } else {
          setComments(data);
        }
      };

    fetchPost();
    fetchComments();
  }, []);

  useEffect(() => {
    if (!post) return;

    fetchOwner(post.user_id, setNickname);
    setCoin(JSON.parse(post.coin));
    setCreatedAt(new Date(post.created_at));
  }, [post]);

  useEffect(() => console.log(comments), [comments]);

  if (!post) return <Flex>Post {id}</Flex>;

  return (
    <Flex flexDir="column" mt={8} mx="auto" w="600px" gap={2}>
      <Flex alignItems="center" gap={2}>
        {coin && (
          <Image
            rounded="full"
            src={coin.image}
            alt={coin.name}
            width={8}
            height={8}
          />
        )}
        {coin && createdAt && (
          <Flex mt={2} gap={1}>
            <Text>
              {createdAt.getFullYear() % 100}년 {createdAt.getMonth() + 1}월{" "}
              {createdAt.getDate()}일 {createdAt.getHours()}시,
            </Text>
            <Text>{getKoreanCurrency(coin.current_price)}원</Text>
            <Text
              color={coin.price_change_percentage_24h >= 0 ? "red" : "blue"}
            >
              {coin.price_change_percentage_24h > 0 ? "+" : ""}
              {coin.price_change_percentage_24h.toFixed(2)}%
            </Text>
          </Flex>
        )}
      </Flex>
      <Flex>{nickname}</Flex>
      <Flex fontWeight="semibold">➡️ {post.text}</Flex>
      <Textarea
        mt={4}
        h={40}
        resize="none"
        isDisabled={!session}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={onClickCreateComment} alignSelf="end">댓글작성</Button>
      <Flex flexDir="column">
        {comments.map((v,i) => (
          <CommentCard key={i} comment={v}/>
        ))}
      </Flex>
    </Flex>
  );
};

export default Post;