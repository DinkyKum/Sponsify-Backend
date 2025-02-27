const express= require('express');
const authRouter= express.Router();
const bcrypt = require('bcrypt');
const Sponsor=require('../models/sponsor');
const Organizer=require('../models/organizer');

authRouter.post('/signup/:userType', async (req, res)=>{
    try{
    const {userType}=req.params;
      if(userType!="sponsor" && userType!= "organizer") throw new Error("Invalid Route");

      let user=null;
        const {name, emailId, password, logo, address}= req.body;
  
        const Hashpassword= await bcrypt.hash(password, 10)
    
        if(userType=="sponsor"){
            const sponsor= new Sponsor({
                name, emailId, password:Hashpassword, logo, address
            });
            user=sponsor;
            await sponsor.save();
        }
        
      else if(userType=="organizer") {
    
        const organizer= new Organizer({
            name, emailId, password:Hashpassword, logo, address
        });
        user=organizer;
        await organizer.save();
      }
      const token= await user.getJWT();
      res.cookie("token", token);
      res.json({message: `${userType} Added Successfully`, data:user})
     } 
  
     catch(err){
      res.status(400).send("There is an error" + err);
     }
  })
  
authRouter.post('/login', async(req, res)=>{
      try{
        
          const {emailId, password}= req.body;
          
          let user= await Sponsor.findOne({emailId: emailId});
          
          if(user==null){
            user= await Organizer.findOne({emailId: emailId});
          }

          if(!user){
              throw new Error("Invalid Credentials")
          }
          const isPasswordValid= await user.validatePassword(password);

  
          if(isPasswordValid){
              const token= await user.getJWT();
  
              res.cookie("token", token);
              res.send(user);
          }
  
          else{
              throw new Error("Invalid Credentials")
          }
      }
      catch(err){
          res.status(400).send("There is some error" + err);
      }
  })

authRouter.post('/logout', async(req, res)=>{
    res.cookie("token", null, {expires: new Date(Date.now())});
    res.send("LoggedOut Successfully");
})

module.exports= authRouter;