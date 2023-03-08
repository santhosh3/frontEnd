import React from 'react'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Input,
  } from '@chakra-ui/react'

import { ArrowBackIcon, AttachmentIcon,SunIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';

function ChatImg({setFetchAgain,fetchAgain,newMessage,setNewMessage}) {

  
  const {selectedChat, setSelectedChat, notification, setNotification} = ChatState();
  return (
    <div>
        <Popover placement='top'>
        <PopoverTrigger>
           <AttachmentIcon/>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverArrow />
             <PopoverBody
              bg='rgb(62,61,60)' color='white'
             >
            <label htmlFor="file-input">
            <SunIcon
                type="file" 
            />
            <input
            id="file-input"
            type="file"
            accept=".jpg, .jpeg, .png"
            value={newMessage}
            style={{ display: 'none' }}
            />
            </label>
            </PopoverBody> 
        </PopoverContent>
        </Popover>
    </div>
  )
}

export default ChatImg
