import axios from "axios";
import { useEffect, useRef } from "react";
import {  useContext } from "react"
import {UserContext} from "./context/UserContext"
import MessageBar from "./MessageBar";
import UsersSidebar from "./UsersSidebar";

const Chat = () => {
  const {id, selectedUserId, messages, setMessages} = useContext(UserContext);
  const divUnderMessages = useRef();
 console.log(selectedUserId)
  useEffect(()=>{
    const div = divUnderMessages.current;
    if(div){
      div.scrollIntoView({behavior: 'smooth', block:'end', inline: "nearest" });
    }
  },[messages]);

  useEffect(()=>{
    if(selectedUserId){
      axios.get('/messages/'+selectedUserId).then(res =>{
        setMessages(res.data);
      })
    }
  },[selectedUserId])
    

  const messageBarRendering = () =>{
    if(selectedUserId ===  id){
      return null;
    }
    else if(selectedUserId){
      
      return <MessageBar/>
        
      }
      else{
        return null;
      }
  
  }

  return (
    <div className="flex h-screen ">
      <UsersSidebar/>
      <div className="flex flex-col bg-blue-100 sm:w-2/3 sm:p-2">
        <div className="flex-grow flex  font-medium">
          {!selectedUserId && (
            <div className="hidden w-full sm:items-center justify-center sm:flex items-center gap-1 flex-wrap text-slate-400 font-medium"><span className="text-2xl">&larr;</span>Select a person to chat</div>
          )}
          {!!selectedUserId && (
            messages && (
                selectedUserId !== id && (
                  <div className="relative h-full w-full">
              <div className="overflow-y-scroll overflow-x-hidden absolute top-0 left-0 right-0 bottom-2">
                {messages.map(message =>(
                  <div key={message._id} className={`${message.sender === id ? 'text-right': 'text-left'}`}>

                 <div className={" max-w-xl text-left inline-block p-2 my-2 rounded-md text-sm " +(message.sender === id ? 'bg-blue-500 text-white':'bg-white text-gray-500')}>
                   {message.text}
                   {message.file && (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                       <path fill-rule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clip-rule="evenodd" />
                      </svg>
                      <a className="underline" target='__blank' href={axios.defaults.baseURL + '/uploads/' + message.file}>
                        {message.file}
                      </a>
                    </div>
                   )}
                  </div>

                </div>
               ))}
            <div ref={divUnderMessages}></div>
            </div>
           </div>
          )
          ))}
        </div>
        {messageBarRendering()}
      </div>
    </div>
  )
}
export default Chat