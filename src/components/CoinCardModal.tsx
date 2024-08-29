import { getKoreanCurrency } from "@/lib/KoreanCurrency";
import { supabaseClient } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthContext";
import { Image } from "@chakra-ui/next-js";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface CoinCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  coin: Coin;
}

const CoinCardModal: FC<CoinCardModalProps> = ({ isOpen, onClose, coin }) => {
  const athDate = new Date(coin.ath_date);

  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { session } = useAuth();

  const router = useRouter();

  const onClickCreatePost = async () => {
    if (!text || !session) return;

    setIsLoading(true);

    const { data, error } = await supabaseClient
      .from("posts")
      .insert({ text, coin: JSON.stringify(coin), user_id: session.user.id })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating post: ", error);
    } else {
      router.push(`/post/${data.id}`);
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text>
            #{coin.market_cap_rank} {coin.name} {coin.symbol}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image src={coin.image} alt={coin.name} width={8} height={8} />
          <Flex mt={2} gap={1}>
            <Text fontWeight="semibold">총 발행량 : </Text>
            <Text>{getKoreanCurrency(coin.total_supply)}개</Text>
          </Flex>
          <Flex mt={2} gap={1}>
            <Text fontWeight="semibold">시가총액 : </Text>
            <Text>{getKoreanCurrency(coin.market_cap)}원</Text>
          </Flex>
          <Flex mt={2} gap={1}>
            <Text fontWeight="semibold">거래량(24h) : </Text>
            <Text>{getKoreanCurrency(coin.total_volume)}원</Text>
          </Flex>
          <Flex mt={2} gap={1}>
            <Text fontWeight="semibold">현재가 : </Text>
            <Text>{getKoreanCurrency(coin.current_price)}원</Text>
            <Text
              color={coin.price_change_percentage_24h >= 0 ? "red" : "blue"}
            >
              {coin.price_change_percentage_24h > 0 ? "+" : ""}
              {coin.price_change_percentage_24h.toFixed(2)}%
            </Text>
          </Flex>
          <Flex mt={2} gap={1}>
            <Text fontWeight="semibold">사상 최고가 : </Text>
            <Text>{getKoreanCurrency(coin.ath)}원</Text>
            <Text color={coin.ath_change_percentage >= 0 ? "red" : "blue"}>
              {coin.ath_change_percentage > 0 ? "+" : ""}
              {coin.ath_change_percentage.toFixed(2)}%
            </Text>
            <Text>
              {athDate.getFullYear() % 100}년{athDate.getMonth()}월
              {athDate.getDate()}일
            </Text>
          </Flex>
          <Textarea
            mt={4}
            h={40}
            resize="none"
            isDisabled={!session}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClickCreatePost}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            글작성
          </Button>
          <Button colorScheme="red" onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CoinCardModal;