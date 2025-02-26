const express= require('express');
const organizerRouter=express.Router();
const Sponsor = require('../models/sponsor');

organizerRouter.get('/organizer/viewSponsors', async(req, res)=>{
    try{
        const sponsorsData=await Sponsor.find({});
        res.send(sponsorsData);
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})


module.exports=organizerRouter;