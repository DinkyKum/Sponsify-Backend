const express= require('express');
const eventRouter=express.Router();
const Organizer= require('../models/organizer');
const Investment= require('../models/investment');
const Event= require('../models/event');
const {organizerAuth}= require('../middlewares/auth');

eventRouter.get('/viewEvents', async(req, res)=>{
    try{
        const eventsData=await Event.find({}).populate('organizer') 
        .exec();;
        res.send(eventsData);
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

eventRouter.get('/event/:id', async(req, res)=>{
    try{
        const eventDetails=await Event.findById(req.params.id).populate('organizer sponsors');
        res.send(eventDetails);
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

eventRouter.post('/addEvent', organizerAuth, async (req, res)=>{
    try{
        const {name, date, budget, eventType, attendees, about, methods, logo}= req.body;
        const event= new Event({name, date, budget, eventType, attendees, about, methods, logo, organizer: req.user._id});
        await event.save();

        await Organizer.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { events: event } },
            { new: true }
        );
        
        res.status(201).send(event);
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})



eventRouter.post('/updateChat', async (req, res) => {
    const { id, text, sender, senderType } = req.body;
  
    if (!id || !text || !sender || !senderType) {
      return res.status(400).send({ error: 'Event ID, sender, type and new message are required' });
    }
  
    try {
      const updatedInvestment = await Investment.findByIdAndUpdate(
        id,
        {
          $push: {
            chat: {
              sender,
              senderType,
              text,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      );
  
      if (!updatedInvestment) {
        return res.status(404).send({ error: 'Investment not found or could not be updated' });
      }
  
      res.send({
        message: 'Message added to chat successfully',
        id: updatedInvestment._id,
        updatedChat: updatedInvestment.chat,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });





eventRouter.post('/confirmDeal/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate the ID
      if (!id) {
        return res.status(400).send({ error: 'Investment ID is required' });
      }
  
      // Find the investment by ID
      const investment = await Investment.findById(id);
      
      // Check if investment exists
      if (!investment) {
        return res.status(404).send({ error: 'Investment not found' });
      }
  
      // Update the status to 'confirmed'
      investment.status = 'confirmed';
  
      // Save the updated investment
      await investment.save();
  
      // Respond with the updated investment
      res.send({
        message: 'Investment status updated successfully',
        investment,
      });
  
    } catch (err) {
      // Log the error for debugging purposes
      console.error('Error in confirmDeal API:', err);
  
      // Return a generic error message
      res.status(500).send({ error: 'There was an error confirming the deal' });
    }
  });
  
  
  

module.exports=eventRouter;