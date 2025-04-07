const express= require('express');
const eventRouter=express.Router();
const Organizer= require('../models/organizer');
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
        const eventDetails=await Event.findById(req.params.id);
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




module.exports=eventRouter;