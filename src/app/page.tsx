"use client";

import CoinCard from "@/components/CoinCard";
import { Button, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const visibleCoins = coins.slice(0, currentPage * itemsPerPage);
  //slice(0,x) -> 0부터 몇개까지 보여줄건지 슬라이싱 할 수 있음
  //밑에 visibleCoins로 맵핑하면 10개만 우선 보임

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("/api/coins");

        if (!res.ok) {
          throw new Error("Failed to fetch coins");
        }

        const data = await res.json();

        setCoins(data);
      } catch (error: any) {
        console.error(error);

        setError(error.message);
      } finally {
        setLoading(false);
      } //try로 빠지든 catch로 빠지든 finally 마지막에 실행됨
    };

    fetchCoins();
  }, []);

  useEffect(() => console.log(coins), [coins]);

  if (loading) return <Flex>Loading...</Flex>;
  if (error) return <Flex>Error: {error}</Flex>;

  return (
    <Flex bgColor="red.100" flexDir="column" alignItems="center" py={8} gap={2}>
      {visibleCoins.map((v, i) => (
        <CoinCard key={i} coin={v} />
      ))}
      {visibleCoins.length < coins.length && (
        <Button mt={4} onClick={() => setCurrentPage(currentPage + 1)}>
          더보기
        </Button>
      )}
    </Flex>
  );
};

export default Home;