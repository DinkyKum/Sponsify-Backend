const express= require('express');
const profileRouter=express.Router();
const {validateSponsorEditData, validateOrganizerEditData}= require('../utils/Validations');
const {selectAuthMiddleware}=require('../middlewares/auth')

profileRouter.get('/profile/:userType', selectAuthMiddleware, async(req, res)=>{
    try{
        const user= req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

profileRouter.put('/profile/edit/:userType', selectAuthMiddleware, async(req, res)=>{
   try { 

    const {userType}=req.params;
    userType=="sponsor"?validateSponsorEditData(req): validateOrganizerEditData(req);
    
    const loggedInUser= req.user;

    Object.keys(req.body).forEach((k)=>
        loggedInUser[k]=req.body[k]
    )

    await loggedInUser.save();

    res.send("User Updated Succesfully" + loggedInUser);
}
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})


module.exports=profileRouter;