const express= require('express');
const organizerRouter=express.Router();
const Organizer= require('../models/organizer');
const { organizerAuth } = require('../middlewares/auth');


organizerRouter.get('/viewOrganizers', async(req, res)=>{
    try{
        const organizersData=await Organizer.find({});
        res.send(organizersData);
    }
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
})

organizerRouter.get('/organizer', organizerAuth, async (req, res) => {
    try {
        const organizerId = req.user._id;

        const organizer = await Organizer.findById(organizerId)
            .populate('events') 
            .exec();

        if (!organizer) {
            return res.status(404).json({ message: 'Organizer not found' });
        }

        res.status(200).json(organizer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});


module.exports=organizerRouter;