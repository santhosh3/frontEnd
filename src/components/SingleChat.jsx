import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box,FormControl,IconButton,Input,Spinner,Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { getSender,getSenderFull } from './Config/ChatLogics';
import ProfileModel from './misc/ProfileModel';
import UpdateGroupChatModel from './misc/UpdateGroupChatModel';
import ScrollableChat from './ScrollableChat';
import '../App.css'
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:5000";
let socket,selectedChatCompare

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing,setTyping] = useState(false);
  const [isTyping, setIsTyping] =  useState(false);
  const {selectedChat, setSelectedChat, notification, setNotification} = ChatState();
  const user = JSON.parse(localStorage.getItem("user"));
  const toast = useToast();

   useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup",user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  },[]); 

 async function sendMessage(e){
    if(e.key === "Enter" && newMessage){
      socket.emit('stop typing',selectedChat._id)
      try {
        setNewMessage("");
        const response = await fetch('http://localhost:5000/sendMessage', {
          method : 'POST',
          headers: {
           'Authorization': `Bearer ${user.token}`,
           'Content-Type': 'application/json'
          },
          body : JSON.stringify({content:newMessage, chatId:selectedChat._id})
        })
        const data = await response.json();
        socket.emit("new message", data);
        setMessage([...message, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }
  function typingHandler(e){
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }
  async function fetchMessages(req,res){
    if(!selectedChat) return;
    try {
      const Config = {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
      };
      setLoading(true)
      const response = await fetch(`https://chatapp-cdo0nah5e-santhosh3.vercel.app/${selectedChat._id}`,Config);
      const data = await response.json();
      setMessage(data);
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  },[selectedChat]);

    useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain);
        }
      } else {
        setMessage([...message, newMessageRecieved]);
      }
    });
  });

  return (
    <>
    {
    selectedChat ? (
    <>
    <Text
      fontSize={{ base: "28px", md: "30px" }}
      pb={3}
      px={2}
      w="100%"
      fontFamily="Work sans"
      display="flex"
      justifyContent={{ base: "space-between" }}
      alignItems="center"
    >
          <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
          />
          {
            !selectedChat.isGroupChat?
            (
            <>
            {getSender(user, selectedChat.users)}
            <ProfileModel user={getSenderFull(user, selectedChat.users)}/>
            </>
            )
            :
            (
              <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModel 
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
              </>
            )
          }
    </Text>
    <Box
       display="flex"
       flexDirection="column"
       justifyContent="flex-end"
       p={3}
       bg="#E8E8E8"
       w="100%"
       h="100%"
       borderRadius="lg"
       overflowY="hidden"
    >
      {
        loading ? (<Spinner 
          size={"xl"} w={20} h={20} alignSelf="center" margin={"auto"}
        />) : (
        <div className='messages'>
           <ScrollableChat messages={message} />
        </div>
        )
      }

      <FormControl onKeyDown={sendMessage} isRequired mt={3}>
      {isTyping ? (
                <div>
                 loading...
                </div>
              ) : (
                <></>
              )}
        <Input 
         variant={"filled"}
         bg="#E0E0E0"
         placeholder='Enter a message'
         onChange={typingHandler}   
         value={newMessage}
        />
      </FormControl>

    </Box>
    </>) : (
    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
        Click on a user to start chatting
        </Text>
    </Box>
    )
    }
    </>
  )
}

export default SingleChat

