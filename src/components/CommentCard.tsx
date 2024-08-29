import { fetchOwner } from "@/lib/supabaseClient";
import { Flex, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from "date-fns/locale/ko";

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: FC<CommentCardProps> = ({ comment }) => {
    const createdAt = formatDistanceToNow(parseISO(comment.created_at), {locale: ko, addSuffix: true});

    const [nickName, setNickname] = useState("");

  useEffect(() => {
    fetchOwner(comment.user_id, setNickname);
  }, []);

  return (
    <Flex>
        <Text display="flex" justifyContent="end" pr={2} w={40}>
        {nickName}
        </Text>
        <Text w={60}>{comment.text}</Text>
        <Text>{createdAt === "1분 미만 전" ? "1분 미만" : createdAt}</Text>
  </Flex>
  );
};
//addsuffix를 붙여주면 ~~전 이렇게 표시됨
export default CommentCard;