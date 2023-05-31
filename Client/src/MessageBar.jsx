import { useState, useContext } from "react";
import { UserContext } from "./context/UserContext";
import axios from "axios";
const MessageBar = () => {
  const [newMessageText, setNewMessageText] = useState("")
   const {ws, selectedUserId, setMessages, id} = useContext(UserContext)  
    const sendMessage = (ev, file = null) =>{
      if(ev){
       ev.preventDefault();
      }
        console.log('sending');
        ws.send(JSON.stringify({ 
          recipient: selectedUserId,
          text: newMessageText,
          file
        }));
        setNewMessageText('');
        setMessages(prev => ([...prev, {text: newMessageText,
          sender: id,
          recipient: selectedUserId,
          _id: Date.now()
        }]))
        if(file){
          axios.get('/messages/'+selectedUserId).then(res =>{
            setMessages(res.data);
          })          
        }
      }
      
       const sendFile =(ev)=>{
          const reader = new FileReader()
          reader.readAsDataURL(ev.target.files[0]) // returns base64 data not binary data
          reader.onload = () => {  // this is a function that would be run after we read the data
            sendMessage(null, {
              name: ev.target.files[0].name,
              data: reader.result
            });
          }
       }
         
    return (
            <form className="hidden sm:flex gap-2 " onSubmit={sendMessage}>
        
          <input type="text" className="bg-white border p-2 flex-grow rounded-sm" placeholder="Type your message" value={newMessageText}
           onChange={ev=> setNewMessageText(ev.target.value)}/>

           <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-300">
             <input type="file" className="hidden" onChange={sendFile}/>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
               <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
             </svg>
           </label>
        
          <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm"> 
        
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24   24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999   12zm0 0h7.5" />
            </svg>
           </button>
          </form>
        )
}

export default MessageBar