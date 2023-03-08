import { Box, Button, Stack, useToast,Text, Avatar } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {ChatState} from '../Context/ChatProvider';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import {getSender,getSenderImage} from '../components/Config/ChatLogics'
import GroupChatModel from './misc/GroupChatModel';

function MyChats({fetchAgain}) {
  const [loggedUser, setLoggerUser] = useState("");
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("user"));


  const fetchChats = async () => {
    try {
      const response = await fetch('https://chatapp-cdo0nah5e-santhosh3.vercel.app/', {
     headers: {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
     },
   });
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.log(error)
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  useEffect(() => {
    setLoggerUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
  },[fetchAgain]);


  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDirection="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
    >
      <Box
       pb={3}
       px={3}
       fontSize={{ base: "28px", md: "30px" }}
       fontFamily="Work sans"
       display="flex"
       w="100%"
       justifyContent="space-between"
       alignItems="center"
      >
        My Chats
        <GroupChatModel>
           <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {
          chats ? (
            <Stack overflow='scroll'>
              {
                chats.map((chat) => (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                  <Text>
                    {
                      !chat.isGroupChat ? (
                        <Box
                         display={"flex"}
                         justifyContent="space-between"
                        >
                        <Box>
                         {getSender(loggedUser, chat.users)}
                        </Box>
                        <Box>
                        <Avatar
                            variant="ghost"
                            size="sm"
                            cursor="pointer"
                            src={getSenderImage(loggedUser, chat.users)}
                            />
                        </Box>
                        </Box>
                      ):(
                       <Box
                       display={"flex"}
                       justifyContent="space-between"
                       >
                         <Box>
                         {chat.chatName}
                        </Box>
                        <Box>
                          <Avatar 
                            variant="ghost"
                            size="sm"
                            cursor="pointer"
                            name={chat.chatName}
                          />
                        </Box>
                       </Box>
                      )
                    }
                  </Text>
                  </Box>
                ))
              }
            </Stack>
          ):(
            <ChatLoading/>
          )
        }
      </Box>
    </Box>
  )
}

export default MyChats
