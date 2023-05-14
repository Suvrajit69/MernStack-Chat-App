import { useState, useContext } from 'react'
import axios from 'axios';
import { UserContext } from './context/UserContext';

const RegisterAndLogin = () =>{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register')

    const {setUsername : setLoggedInUsername, setId } = useContext(UserContext)

    const handleSubmit = async (ev)=>{
     ev.preventDefault()
     const url = isLoginOrRegister === 'register' ? '/register' : '/login';
     console.log(isLoginOrRegister)
     const {data} = await axios.post(url, {username,password})
        // console.log(data)
     setLoggedInUsername(username);
     setId(data.id)
    }

    return (
    <div className='bg-blue-50 h-screen flex items-center'>
        <form className='w-64 mx-auto mb-12' onSubmit={handleSubmit}>

            <input value={username}
            onChange={event => setUsername(event.target.value)} type="text" placeholder='username' className='block w-full p-2 mb-2 border'/>

            <input value={password} onChange={event => setPassword(event.target.value)} type="password" placeholder='password' className='block w-full p-2 mb-2 border'/>

            <button className='bg-blue-500 text-white block w-full rounded-sm p-2'>
                {isLoginOrRegister === 'register' ? 'Register':'Login'}
            </button>
            <div className='text-center mt-2'>
             {isLoginOrRegister === 'register' && (
                <div>
                    Already a member?
                 <button onClick={()=> setIsLoginOrRegister('login')}>
                 Login here
                 </button>
                </div>
             )}
             {isLoginOrRegister === 'login' && (
                <div>
                  Already a member?
                 <button onClick={()=> setIsLoginOrRegister('register')}>
                    Register 
                 </button>
                </div>
             )}
            </div>

        </form>
    </div>
)}

export default RegisterAndLogin;
