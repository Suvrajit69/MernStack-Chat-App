const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const  mongoose  = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs') 
const ws = require('ws') 
const User = require('./models/user');

const app = express();
// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin:"http://localhost:5173"
}))

const port = 3000;

mongoose.connect(process.env.MONGO_URL,{
    dbName: "usersDb"})
.then(()=>console.log("database connected"))
.catch((e)=>console.log(e))

const bcryptSalt = bcrypt.genSaltSync(10);
app.get("/", (req,res)=>{
    res.json('test ok');
});

app.get('/profile', (req,res)=>{
  const token = req.cookies?.token;
//   console.log(token)
  if(token){
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData)=>{
        if (err) throw err;
        res.json(userData)
        // console.log(userData)
    });
  }else{
    res.status(401).json('no token');
  }
});

app.post('/register', async (req,res)=>{
    
    const {username, password} = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, bcryptSalt)

      const createdUser = await User.create({
                                            username:username,
                                            password: hashedPassword
      });

      jwt.sign({userId: createdUser._id, username}, process.env.JWT_SECRET,{},(err,token)=>{
         if(err) throw err;
         res.cookie('token', token, {sameSite: 'none', secure: true}).status(201).json({
            // {sameSite: 'none', secure: true}
             id: createdUser._id,
          });
      })
    } catch (error) {
        if(error) throw error;
        res.status(500).json(err)
    }
});

app.post('/login', async (req,res)=>{
  const {username, password} = req.body
  const foundUser = await User.findOne({username})
// console.log(foundUser._id)
  if(foundUser._id){
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if(passOk){
      jwt.sign({userId: foundUser._id, username}, process.env.JWT_SECRET,{},(err,token)=>{
        if(err) throw err;
        res.cookie('token', token, {sameSite: 'none', secure: true}).status(201).json({
           // {sameSite: 'none', secure: true}
            id: foundUser._id,
         });
     })
    }
  }
})
const server = app.listen(3000);

const wss = new ws.WebSocketServer({server});

wss.on('connection', (connection, req)=>{
  
  const cookies = req.headers.cookie;
  if(cookies){
    const tokenCookieString = cookies.split(";").find(string => string.startsWith('token'));
    if(tokenCookieString){
      const token = tokenCookieString.split('=')[1]
      if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData)=>{
          if(err) throw err;
          const {userId, username} = userData;
          connection.userId = userId;
          connection.userName = username;
        })
      }
    }
  }
  [...wss.clients].forEach(client=> {
   client.send(JSON.stringify({
     online: [...wss.clients].map(c => ({userId: c.userId, username: c.userName}))
   })) 
  })
});