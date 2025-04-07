const mongoose= require('mongoose');
const validator= require('validator');
const jwt=require('jsonwebtoken');
const bcrypt= require('bcrypt');

const organizerSchema= new mongoose.Schema({
    name:{ 
        type: String,
        required: true,
        minLength: 3,
    },

    emailId:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a valid Email Id");
            }
        }
    },

    password:{
        required: true,
        type: String,
        minLength:8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password");
            }
        }
    },

    address:{
        type:String,
        required:true
    },

    events:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'Event'
    },

    logo:{
        type:String,
        default: "https://www.shutterstock.com/image-vector/no-image-available-picture-coming-600nw-2057829641.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valid URL");
            }
        }
    },

    about:{
        type: String,
        default: "This is the default about data"
    },
}
)

organizerSchema.methods.getJWT= async function(){
    const token= await jwt.sign({_id:this._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
    return token;
}

organizerSchema.methods.validatePassword= async function(passwordInputByUser){
    const isPasswordValid= await bcrypt.compare(passwordInputByUser, this.password);
    return(isPasswordValid);
}

module.exports= mongoose.model('Organizer', organizerSchema);
