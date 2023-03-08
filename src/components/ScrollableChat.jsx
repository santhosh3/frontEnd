import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isSameSender,isLastMessage, isSameSenderMargin, isSameUser } from './Config/ChatLogics';
import { Image } from '@chakra-ui/react';

function ScrollableChat({messages}) {

  const user = JSON.parse(localStorage.getItem("user"));

  return (   
    <ScrollableFeed>
      {
        messages && messages.map((m,i) => (
          <div key={m._id} style={{display:"flex"}}>
           <span
            style={{
              backgroundColor: `${
                m.sender._id === user._id ? "#8EE3F8" : "#B9F5D0"
              }`, borderRadius: "20px", padding: "5px 15px", maxWidth: "75%",
              marginLeft : isSameSenderMargin(messages,m,i,user._id),
              marginTop : isSameUser(messages,m,i,user._id) ? 3 : 10,
            }}
           >
            {
            (m.content.slice(0,4) !== 'http') ? m.content : 
            <Image
            src={m.content}
            alt={m.content}
            style={{borderRadius:"1px", padding:"0", margin:"0"}}
          />         
            }
           </span>
          </div>
        ))
      }
    </ScrollableFeed>
  )
}

export default ScrollableChat
