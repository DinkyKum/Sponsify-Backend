const express= require('express');
const profileRouter=express.Router();
const {validateSponsorEditData, validateOrganizerEditData}= require('../utils/Validations');
const {selectAuthMiddleware}=require('../middlewares/auth')
const Investment= require('../models/investment');
const Event= require('../models/event');

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

profileRouter.get('/myDeals/:userType', selectAuthMiddleware, async (req, res) => {
    try {
      const user = req.user;
      const userType = req.params.userType; // "sponsor" or "organizer"
  
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      let investments;
  
      if (userType === 'organizer') {
        const organizerEvents = await Event.find({ organizer: user._id }).select('_id');
        const eventIds = organizerEvents.map(event => event._id);
  
        investments = await Investment.find({ event: { $in: eventIds } })
          .populate({
            path: 'event',
            populate: {
              path: 'organizer',
              model: 'Organizer', // or your Organizer model
            }
          })
          .populate('sponsor');
  
      } else if (userType === 'sponsor') {
        investments = await Investment.find({ sponsor: user._id })
          .populate({
            path: 'event',
            populate: {
              path: 'organizer',
              model: 'Organizer',
            }
          })
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