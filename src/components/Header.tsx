"use client";

import { useAuth } from "@/providers/AuthContext";
import { Link } from "@chakra-ui/next-js";
import {
  Avatar,
  Flex,
  LinkBox,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

const Header: FC = () => {
  const { session, profile } = useAuth();

  const pathname = usePathname();

  if (pathname === "/sign-in") return <></>;

  return (
    <Flex justifyContent="space-between" p={4}>
      <Flex gap={4}>
      <Flex>Coin API</Flex>
      <Link variant="link" href="/">Home</Link>
      <Link variant="link" href="/posts">Posts</Link>
      </Flex>
      <Flex>
        {session ? (
          <Menu>
            <MenuButton>
              {profile ? (
                <Flex alignItems="center" gap={1}>
                  <Avatar size="sm" name={profile.nickname} />
                  {profile.nickname}
                </Flex>
              ) : (
                session.user.email
              )}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => supabaseClient.auth.signOut()}>
                로그아웃
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Link href="/sign-in">로그인</Link>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;