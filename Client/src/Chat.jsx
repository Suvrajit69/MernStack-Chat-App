import {  useContext } from "react"
import {UserContext} from "./context/UserContext"
import MessageBar from "./MessageBar";
import UsersSidebar from "./UsersSidebar";

const Chat = () => {
  const {id, selectedUserId, messages} = useContext(UserContext);
   
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
    <div className="flex h-screen overflow-scroll">
      <UsersSidebar/>
      <div className="flex flex-col bg-blue-100 sm:w-2/3 sm:p-2">
        <div className="flex-grow flex  font-medium">
          {!selectedUserId && (
            <div className="hidden w-full sm:items-center justify-center sm:flex items-center gap-1 flex-wrap text-slate-400 font-medium"><span className="text-2xl">&larr;</span>Select a person to chat</div>
          )}
          {!!selectedUserId && (
            messages && (
             <div className="w-full">
                {messages.map(message =>(
                <div key={messages} className={`${message.sender === id ? 'text-right': 'text-left'}`}>

                 <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " +(message.sender === id ? 'bg-blue-500 text-white':'bg-white text-gray-500')}>

                   sender: {message.sender} <br />
                   my id: {id} <br />
                   {message.text}
                  </div>

                </div>
               ))}
            </div>
          )
          )}
        </div>
        {messageBarRendering()}
      </div>
    </div>
  )
}
export default Chat