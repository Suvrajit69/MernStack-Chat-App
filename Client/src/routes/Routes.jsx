import { useContext } from "react"
import Chat from "../Chat";
import { UserContext } from "../context/UserContext"
import RegisterAndLogin from "../RegisterAndLogin"

const Routes = () => {
    const {username} = useContext(UserContext);
    // console.log(username, id)
    
    if(username){
        return <Chat/>;
    }

  return (
    <RegisterAndLogin/>
  )
}

export default Routes