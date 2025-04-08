const express= require('express');
const profileRouter=express.Router();
const {validateSponsorEditData, validateOrganizerEditData}= require('../utils/Validations');
const {selectAuthMiddleware}=require('../middlewares/auth')
const Investment= require('../models/investment');

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

profileRouter.get('/myInvestments', async (req, res) => {
    try {
      const user = req.user; // assuming user is attached to req via middleware
  
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      let investments;
  
      // If user is an organizer/company
      if (user.role === 'organizer') {
        // Find events organized by this user
        const organizerEvents = await Event.find({ organizer: user._id }).select('_id');
  
        const eventIds = organizerEvents.map(event => event._id);
  
        // Find investments into those events
        investments = await Investment.find({ event: { $in: eventIds } })
          .populate('event')
          .populate('sponsor');
  
      } else if (user.role === 'sponsor') {
        // If user is a sponsor, return their own investments
        investments = await Investment.find({ sponsor: user._id })
          .populate('event')
          .populate('sponsor');
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
  
      res.status(200).json(investments);
  
    } catch (err) {
      console.error(err);
      res.status(500).send("There is some error: " + err.message);
    }
  });
  


module.exports=profileRouter;