import { Image } from "@chakra-ui/next-js";
import { Flex, Text, useDisclosure } from "@chakra-ui/react";
import { FC } from "react";
import CoinCardModal from "./CoinCardModal";

interface CoinCardProps {
    coin : Coin
}

const CoinCard : FC<CoinCardProps> = ({ coin }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()


    return (
        <>
        <Flex bgColor="gray.50" w="600px" p={2} rounded="md" justifyContent="space-between" alignItems="center" gap={2} onClick={onOpen} cursor="pointer">
            <Text w={8}>{coin.market_cap_rank}</Text>
            <Image src={coin.image} alt={coin.name} width={8} height={8}/> 
            <Text w={80}>{coin.name}</Text>
            <Text w={32}>{coin.current_price.toLocaleString()} 원</Text>
            <Text w={20} color={coin.price_change_percentage_24h >= 0 ? "red" : "black"}>
                {coin.price_change_percentage_24h > 0 ? "+" : <></>}
                {coin.price_change_percentage_24h.toFixed(2)}
            </Text>
        </Flex>
        <CoinCardModal isOpen={isOpen} onClose={onClose} coin={coin}/>
        </>
        //각 요소들에 width를 주니까 space-between해도 보기좋게 정렬 시킬 수 있네
    )
}

export default CoinCard;