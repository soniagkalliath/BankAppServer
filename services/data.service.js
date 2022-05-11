//jsonwebtoken import
const jwt = require('jsonwebtoken')

//import db
const db= require('./db')

//database
database = {
  1000: { acno: 1000, uname: "Neer", password: 1000, balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "Laisha", password: 1001, balance: 3000, transaction: [] },
  1002: { acno: 1002, uname: "Vyom", password: 1002, balance: 4000, transaction: [] }
}

//register - index.js will give uname,acno,password-asynchronous
const register = (uname, acno, password) => {
//asynchronous
return  db.User.findOne({acno})
.then(user=>{
  console.log(user)
  if (user) {
    //already exist acno
    return {
      statusCode: 401,
      status: false,
      message: "Account Number already exist..."
    }
  }
  else{
    const newUser = new db.User({
        acno,
        uname,
        password,
        balance: 0,
        transaction: []
      })
      newUser.save()
      return {
        statusCode: 200,
        status: true,
        message: "Successfully registered... Please Log in!!!!"
      }
  }

})
}

//login
const login = (acno, pswd) => {

return  db.User.findOne({acno,password:pswd})
.then(user=>{
  if(user){
    currentUser = user.uname
    currentAcno = acno
    //token generate
    const token = jwt.sign({
      currentAcno: acno
    },'supersecret123456789')
    return {
      statusCode: 200,
      status: true,
      message: "Login successful!!!!",
      currentAcno,
      currentUser,
      token
    }
  }
  else {

    return {
      statusCode: 401,
      status: false,
      message: "Invalid Creditials!!!!"
    }
  }
})  
}

   //deposit
  const deposit = (acno,pswd,amt)=>{
    var amount = parseInt(amt)

    return db.User.findOne({acno,password:pswd})
    .then(user=>{
      if(user){
       user.balance +=amount
        user.transaction.push({
          type:"CREDIT",
          amount:amount
        })
        user.save()
       // console.log(database)
      
        return {
          statusCode: 200,
          status: true,
          message: amount + " successfully deposited.. And new balance is : "+  user.balance
        }
      }
      else {

        return {
          statusCode: 401,
          status: false,
          message: "Invalid Creditials!!!!"
        }
      }

    })
   }


     //withdraw
    const withdraw = (req,acno,pswd,amt)=>{
      var amount = parseInt(amt)

      return db.User.findOne({acno,password:pswd})
      .then(user=>{
        if(req.currentAcno!=acno){
          return {
            statusCode: 422,
            status: false,
            message: "Operation denied!!!"
          }
        }
        if(user){
          if(user.balance>amount){
           user.balance -=amount
            user.transaction.push({
              type:"DEBIT",
              amount:amount
            })
         //   console.log(database)
        user.save()
         return {
          statusCode: 200,
          status: true,
          message: amount + " successfully debitted.. And new balance is : "+  user.balance
        }

        }
        else{
          return {
            statusCode: 401,
            status: false,
            message: "Insufficient Balance"
          }
        }
      }
        else {
          return {
            statusCode: 401,
            status: false,
            message: "Invalid Creditials!!!!"
          }
        }
      })
       
     }

      //trasaction 
     const transaction=(acno)=>{
       return db.User.findOne({acno})
       .then(user=>{
         if(user){
          return {
            statusCode: 200,
            status: true,
            transaction:user.transaction
          }
         }
         else{
          return {
            statusCode: 401,
            status: false,
            message: "User doesnot exist!!!!"
          }
         }
       })       
       }

       //deleteAcc

  const deleteAcc=(acno)=>{
    return db.User.deleteOne({acno})
    .then(user=>{
      if(!user){
        return{
          statusCode: 401,
          status: false,
          message: "OPeration Failed!!!!"
        }
      }
      else{
        return {
          statusCode: 200,
          status: true,
          message: "Account Number "+acno+" deleted successfully..."
        }
      }
    })
  }

//export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  transaction,
  deleteAcc
}

