//server creation step

//import express
const express = require('express')

//import dataserveice
const dataService = require('./services/data.service')

//import jsonwebtoken
const jwt = require('jsonwebtoken')

//import cors
const cors = require('cors')

//create server app using express
const app = express()

//use cors
app.use(cors({
    origin:'http://localhost:4200'
}))

//to parse json data
app.use(express.json())

//resolving REST API

//GET - TO READ DATA
app.get('/',(req,res)=>{
    res.send("GET REQUEST")
})

//POST - TO CREATE DATA
app.post('/',(req,res)=>{
    res.send("POST REQUEST")
})

//PUT - TO UPDATE/MODIFY DATA
app.put('/',(req,res)=>{
    res.send("PUT REQUEST")
})

//PATCH - TO PARTIALLY UPDATE DATA
app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST")
})

//DELETE - TO DELETE DATA
app.delete('/',(req,res)=>{
    res.send("DELETE REQUEST")
})

//logMiddleware - application specific middleware
const logMiddleware = (req,res,next)=>{
    console.log("APPLICATION SPECIFIC MIDDLEWARE")
    next()
}

app.use(logMiddleware)

//BANK SERVER

//jwtMiddleware - to verify token
const jwtMiddleware=(req,res,next)=>{
  try  {
      const token = req.headers["x-access-token"]
      console.log(jwt.verify(token,'supersecret123456789'))
 const data = jwt.verify(token,'supersecret123456789')
 req.currentAcno =  data.currentAcno
  next()
}
catch{
    res.status(401).json({
        statusCode:401,
        status:false,
        message:"Please Log In!!!!"
    })
}
}

//REGISTER API
app.post('/register',(req,res)=>{
    //asynchronous
   dataService.register(req.body.uname,req.body.acno,req.body.password)
   .then(result=>{
    res.status(result.statusCode).json(result)
   })
  
})

//LOGIN API
app.post('/login',(req,res)=>{
    dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)
       })
 })

 //DEPOSIT API  - router specific middleware:jwtMiddleware
app.post('/deposit',jwtMiddleware,(req,res)=>{
   dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
   .then(result=>{
    res.status(result.statusCode).json(result)
   })
 })

  //WITHDRAW API- router specific middleware:jwtMiddleware
app.post('/withdraw',jwtMiddleware,(req,res)=>{
     dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amt)
     .then(result=>{
        res.status(result.statusCode).json(result)
       })
 })

   //TRANSACTION API- router specific middleware:jwtMiddleware
app.post('/transaction',jwtMiddleware,(req,res)=>{
    dataService.transaction(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
       })
 })

 //onDelete API
 app.delete('/onDelete/:acno',jwtMiddleware,(req,res)=>{
     dataService.deleteAcc(req.params.acno)
     .then(result=>{
        res.status(result.statusCode).json(result)
     })
 })

//set port number
app.listen(3000,()=>{
    console.log("Server started at 3000")
})