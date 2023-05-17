import { useEffect, useState, useContext } from "react"
import Avatar from "./Avatar";
import Logo from "./Logo";
import {UserContext} from "./context/UserContext"
const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {id} = useContext(UserContext);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    setWs(ws);
    ws.addEventListener('message', handleMessage)
    
  }, []);

  
  const handleMessage = (e) =>{
    
    const messageData = JSON.parse(e.data)
    if('online' in messageData){
      // showOnlinePeople(messageData.online)
      const people = {};
      messageData.online.forEach(({userId, username}) => {
        people[userId] = username
      });
      

      setOnlinePeople(people)    
      
    }
  }
  onlinePeople[id] = 'You';
  
  
  // const showOnlinePeople =(peopleArray)=>{
  //   // console.log(peopleArray)
  //   const people = {};
  //   peopleArray.forEach(({userId, username}) => {
  //     people[userId] = username
  //   });
  //   setOnlinePeople(people)
  // };
   
   


  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <Logo/>
        {Object.keys(onlinePeople).map(userId =>(
          <div key={userId} onClick={()=> setSelectedUserId(userId)}
           className={`border-b border-gray-100 py-2  flex items-center gap-2 relative ${userId === selectedUserId ? 'bg-blue-200' : ''}`}>
            <span  className={`absolute w-1 h-full ${userId === selectedUserId ? 'bg-blue-600' : ''}`}></span>
            <Avatar  userId={userId} userName={onlinePeople[userId]}/>
           <span className="text-gray-800 font-medium cursor-pointer">            {onlinePeople[userId]}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-100 w-2/3 p-2">
        <div className="flex-grow flex items-center justify-center text-slate-400 font-medium">
          {!selectedUserId && (
            <div className="flex items-center gap-1"><span className="text-2xl">&larr;</span>Select a person to chat</div>
          )}
        </div>
        <div className="flex gap-2 " >

          <input type="text" className="bg-white border p-2 flex-grow rounded-sm" placeholder="Type your message"/>
          <button className="bg-blue-500 p-2 text-white rounded-sm"> 

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24   24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999   12zm0 0h7.5" />
           </svg>

          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat