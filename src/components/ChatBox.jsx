import { Box } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat';

function ChatBox({fetchAgain,setFetchAgain}) {
  const {selectedChat} = ChatState();
  return (
    <Box
     display={{base : selectedChat ? "flex" : "none", md: "flex"}}
     alignItems="center"
     flexDirection={"column"}
     p={3}
     bg="white"
     w={{base:"100%", md:"68%"}}
     borderRadius="9"
     borderWidth={"8px"}
    >
      <SingleChat
       fetchAgain={fetchAgain}
       setFetchAgain={setFetchAgain}
      />
    </Box>
  )
}

export default ChatBox
