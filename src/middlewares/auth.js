const jwt=require('jsonwebtoken');
const Sponsor=require('../models/sponsor');
const Organizer= require('../models/organizer');

const sponsorAuth= async (req, res, next)=>{
    try{
    const {token}=req.cookies;
    if(!token){
        return res.status(401).send("Kindly Login")
    }
    const decodedData= jwt.verify(token, process.env.JWT_SECRET);
    const {_id}=decodedData;

    const user= await Sponsor.findById(_id);

    if(!user){
        throw new Error("User not found");
    }
    req.user=user;
    next();
}
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
}

const organizerAuth= async (req, res, next)=>{
    try{
    const {token}=req.cookies;
    if(!token){
        return res.status(401).send("Kindly Login")
    }
    const decodedData= jwt.verify(token, process.env.JWT_SECRET);
    const {_id}=decodedData;

    const user= await Organizer.findById(_id);

    if(!user){
        throw new Error("User not found");
    }
    req.user=user;
    next();
}
    catch(err){
        res.status(400).send("There is some error"+ err);
    }
}


const selectAuthMiddleware = (req, res, next) => {
    const { userType } = req.params;
    

    if (userType === "sponsor") {
        return sponsorAuth(req, res, next);
    } else if (userType === "organizer") {
        return organizerAuth(req, res, next);
    } else {
        return res.status(400).json({ error: "Invalid user type" });
    }
};

module.exports={sponsorAuth, organizerAuth, selectAuthMiddleware}


