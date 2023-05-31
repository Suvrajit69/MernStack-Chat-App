import { useState, createContext, useEffect } from "react";
import axios from 'axios';
export const UserContext = createContext({});

export const UserContextProvider =(props)=>{

  const [username, setUsername] =useState(null);
  const [id, setId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [ws, setWs] = useState(null);
  const [onlinePeople,  setOnlinePeople] = useState({})
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    const connectToWs =()=>{
      const ws = new WebSocket('ws://localhost:3000');
      setWs(ws);
      ws.addEventListener('message', handleMessage);
      ws.addEventListener('close', ()=> connectToWs())
      console.log('message')
    }
    connectToWs()
  },[]);  
  
  const handleMessage = (e) =>{
    const messageData = JSON.parse(e.data)
    if('online' in messageData){
      const people = {};
      messageData.online.forEach(({userId, username}) => {
        people[userId] = username
      })
      setOnlinePeople(people)    
    }else if('text' in messageData){
      setMessages(prev => [...prev,{...messageData}])
    }
  }

  useEffect(() => {
    axios.get('/profile').then(response =>{
      setId(response.data.userId);
      setUsername(response.data.username);
    })
    
    
  }, [])
  

  return(
    <UserContext.Provider value={{username, setUsername, id, setId, setSelectedUserId, selectedUserId, ws, setWs, onlinePeople, handleMessage, setMessages, messages}}>
      {props.children}
    </UserContext.Provider>
  )

};