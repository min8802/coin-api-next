import { getKoreanCurrency } from "@/lib/KoreanCurrency";
import { fetchOwner, supabaseClient } from "@/lib/supabaseClient";
import { Image } from "@chakra-ui/next-js";
import { Button, Flex, Text } from "@chakra-ui/react";
import { FC, MouseEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

interface PostCardProps {
  post: Post;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const coin = JSON.parse(post.coin);
  const createdAt = new Date(post.created_at);

  const [nickname, setNickname] = useState<string>("");

  const router = useRouter();

  const onClickLike = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); //하면 페이지 클릭되는걸 멈추게 해줌 , 부모에 있는 routing기능이 동작안하는 걸 볼 수 있음
    //버튼 2개가 동시에 동작하는 거 할때 이 기능 써서 버튼 하나는 동작안하게끔 설정해 줄 수 있음
    //자식 컴포넌트에서 함수실행 했을 때 상위 컴포넌트의 함수가 실행되버릴때 이 함수 참고 !

    console.log("like");
  }

  useEffect(() => {
    const fetchPostOwner = async() => {
        const {data, error} = await supabaseClient.from("profiles").select("*").eq("user_id", post.user_id);
        if(error) {
            console.error("Error profile", error);
        } else {
            if(data.length === 0) {
                setNickname(`#${post.user_id.substring(post.user_id.length -4)}`)
            } else {
                setNickname(data[0].nickname);
            }
        }
    }
    fetchPostOwner();
  }, [])

  useEffect(()=>{
    fetchOwner(post.user_id, setNickname);
  },[])

  return (
    <Flex flexDir="column" bgColor="gray.100" p={2} w="600px" rounded="md" gap={4} onClick={() => router.push(`/post/${post.id}`)} cursor="pointer">
      <Flex alignItems="center" gap={2}>
        <Image src={coin.image} alt={coin.name} width={8} height={8} />
        <Flex mt={2} gap={1} alignItems="center">
          <Text>
            {createdAt.getFullYear() % 100}년 {createdAt.getMonth() + 1}월{" "}
            {createdAt.getDate()}일 {createdAt.getHours()}시,
          </Text>
          <Text>{getKoreanCurrency(coin.current_price)}원</Text>
          <Text color={coin.price_change_percentage_24h >= 0 ? "red" : "blue"}>
            {coin.price_change_percentage_24h > 0 ? "+" : ""}
            {coin.price_change_percentage_24h.toFixed(2)}%
          </Text>
          <Button variant="ghost" onClick={onClickLike}>
            <FaRegHeart />
          </Button>
        </Flex>
      </Flex>
      <Flex>{nickname}</Flex>
      <Flex fontWeight="semibold">➡️ {post.text}</Flex>
    </Flex>
  );
};

export default PostCard;