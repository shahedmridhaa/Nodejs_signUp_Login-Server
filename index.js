const express = require("express")
const mongoose = require("mongoose")
mongoose.set('strictQuery', false)
const cors = require("cors")
const port = 4000
const app = express()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')




// ===import file====
const signUpSchema = require ("./schema/signUpSchema")


// model
const User = mongoose.model("User", signUpSchema)


//middleware
app.use(cors())
dotenv.config()
app.use(express.json())


//database connect
const connectionDB = async () => {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/userForm')
      console.log('dataBase Connected')
    } catch (error) {
      console.log('dataBase not Connected')
      console.log(error.message)
    }
  }



//   =====SignUp=====
  app.post("/signUp", async(req, res) =>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    try{
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword
    })
    const newData = await newUser.save()
    res.status(200).send(newData)

   }catch(err){
     res.status(500).send("Authentication Failed")
     console.log(err.message);
   }
  })



  
// ===Login===
app.post('/login', async (req, res) => {
  try{
    const user = await User.find({ email: req.body.email })
    if (user && user.length > 0) {
       const isvalidPassword = await bcrypt.compare(req.body.password, user[0].password)

      if (isvalidPassword) {

        //generate token
        const token = jwt.sign(
           {
             email: user[0].email,
             userId: user[0]._id,
           },
          process.env.JWT_SECRET,
          {
            expiresIn: '1h',
          },
        )
      
        
        res.status(200).send(token)
        console.log(token);
      } else {
        res.status(401).send({ message: 'Authentication Faild' })
      }
    } else {
      res.status(401).send({ message: 'Authentication Faild' })
    }
  }catch(error){
    res.status(400).send({ message: 'Authentication Faild' })
    
  }
})


  

app.listen(port, async () =>{
    console.log(`server start port ${port}`);
    await connectionDB()
})


//login-app
//3km6NbBFKZKdcaQm