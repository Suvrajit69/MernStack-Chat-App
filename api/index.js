const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const  mongoose  = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs'); 
const User = require('./models/user');
const Message = require('./models/message');
const ws = require('ws'); 
const fs = require('fs');

const app = express();
// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin:"http://localhost:5173"
}))
app.use('/uploads', express.static(__dirname + '/uploads'));
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
  if(foundUser._id){
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if(passOk){
      jwt.sign({userId: foundUser._id, username}, process.env.JWT_SECRET,{},(err,token)=>{
        if(err) throw err;
        res.cookie('token', token, {sameSite: 'none', secure: true}).status(201).json({
            id: foundUser._id,
         });
     })
    }
  }
})

app.post('/logout', (req, res)=>{
  res.cookie('token', '', {sameSite: 'none', secure: true}).json('ok')

})

const getUserDataFromToken = async (req) =>{
  return new Promise((resolve, reject)=>{
   const token = req.cookies.token; 
    if(token){
      jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData)=>{
        if(err) throw err;
        resolve(userData);
      });
    }else{
      reject('no token')
    }
  })
  }

app.get('/messages/:userId',async (req,res)=>{
  const{userId} = req.params;
  const userData = await getUserDataFromToken(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: {$in: [userId, ourUserId]},
    recipient: {$in: [userId, ourUserId]}
  }).sort({createdAt: 1});
  res.json(messages);
})

app.get('/people', async (req, res)=>{
  const users = await User.find({}, {'_id': 1, username: 1});
  res.json(users)
})

const server = app.listen(3000);

const wss = new ws.WebSocketServer({server});

wss.on('connection', (connection, req)=>{

  const notifyOnlinePeople=()=>{
    wss.clients.forEach(client=> {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({userId: c.userId, username: c.userName}))
     })) 
    })   
  }
  // notify evryone aout online people (when someone connect)
  connection.isAlive = true;

  connection.timer = setInterval(()=>{
    connection.ping()
    connection.deathTimer = setTimeout(()=>{
      connection.isAlive = false;
      clearInterval(connection.timer)
      connection.terminate()
      notifyOnlinePeople()
    }, 1000)
  },5000)
  
  connection.on('pong', ()=>{
    clearTimeout(connection.deathTimer)
  })

  const cookies = req.headers.cookie;
  if(cookies){
    const tokenCookieString = cookies.split(";").find(string => string.startsWith('token'));
    console.log('ddddd')
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
  
  connection.on('message', async (message)=>{
    let filename
    messageData = JSON.parse(message.toString());
    const {recipient, text, file} = messageData;
    if(file){
      const parts = file.name.split('.')
      const ext = parts[parts.length - 1]
      filename = Date.now() + '.' + ext;
      const path = __dirname + '/uploads/' + filename;
      const bufferData = new Buffer(file.data.split(',')[1], 'base64')
      fs.writeFile(path, bufferData, ()=>{
        console.log('file saved:' + path)
      })
      // fs.writeFile()
    }
    if(recipient && (text || file)){
     const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null
      });
      [...wss.clients]
      .filter(client => client.userId === recipient)
      .forEach(client => client.send(JSON.stringify({
        text,
        file: file ? filename : null,
        sender: connection.userId,
         recipient,
         _id: messageDoc._id,
        })))
    }
  })
  
   
});