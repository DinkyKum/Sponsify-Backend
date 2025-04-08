const express= require('express');
const sponsorRouter=express.Router();
const Sponsor = require('../models/sponsor');
const Event= require('../models/event');
const {sponsorAuth}= require('../middlewares/auth');
const Investment = require('../models/investment');

sponsorRouter.get('/viewSponsors', async(req, res)=>{
    try{
        const sponsorsData=await Sponsor.find({});
        res.send(sponsorsData);
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

sponsorRouter.get('/sponsor/:id', async(req, res)=>{
    try {
            const sponsorId = req.params.id;
            const sponsor = await Sponsor.findById(sponsorId)
                .populate('events') 
                .exec();
    
            if (!sponsor) {
                return res.status(404).json({ message: 'Sponsor not found' });
            }
    
            res.status(200).json(sponsor);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error', error: err.message });
        }
})

sponsorRouter.post('/invest/:id', sponsorAuth, async (req, res) => {
    try {
      const eventId = req.params.id;
      const sponsorId = req.user._id;
      const { description, methods } = req.body;
  
      // Step 1: Check if this sponsor already invested in this event
      const existingInvestment = await Investment.findOne({
        sponsor: sponsorId,
        event: eventId
      });
  
      if (existingInvestment) {
        return res.status(400).json({ message: 'You have already sponsored this event.' });
      }
  
      // Step 2: Create new investment
      const investment = new Investment({
        sponsor: sponsorId,
        description,
        methods,
        event: eventId
      });
  
      await investment.save();
  
      // Step 3: Update sponsor and event references
      await Sponsor.findByIdAndUpdate(
        sponsorId,
        { $addToSet: { events: eventId } },
        { new: true }
      );
  
      await Event.findByIdAndUpdate(
        eventId,
        { $addToSet: { sponsors: sponsorId } },
        { new: true }
      );
  
      res.status(201).send(investment);
    } catch (err) {
      console.error('Investment Error:', err);
      res.status(500).send('There is some error: ' + err.message);
    }
  });
  

module.exports=sponsorRouter;