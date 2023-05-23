import { useState, useContext } from "react";
import { UserContext } from "./context/UserContext";

const MessageBar = () => {
  const [newMessageText, setNewMessageText] = useState("")
   const {ws, selectedUserId, setMessages, id} = useContext(UserContext)
  
    const sendMessage = (ev) =>{
        ev.preventDefault();
        console.log('sending');
        ws.send(JSON.stringify({ 
          recipient: selectedUserId,
          text: newMessageText
        }));
        setNewMessageText('');
        setMessages(prev => ([...prev, {text: newMessageText,
                                         sender: id,
                                         recipient: selectedUserId
                                        }]))  
      }

    return (
            <form className="hidden sm:flex gap-2 " onSubmit={sendMessage}>
        
          <input type="text" className="bg-white border p-2 flex-grow rounded-sm" placeholder="Type your message" value={newMessageText}
           onChange={ev=> setNewMessageText(ev.target.value)}/>
        
          <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm"> 
        
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24   24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999   12zm0 0h7.5" />
            </svg>
           </button>
          </form>
        )
}

export default MessageBar