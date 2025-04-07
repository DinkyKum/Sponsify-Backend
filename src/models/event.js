const mongoose= require('mongoose');
const validator= require('validator');


const eventSchema= new mongoose.Schema({
    name:{ 
        type: String,
        required: true,
        minLength: 3,
    },

    organizer:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Organizer'
    },

    about:{
        type: String,
        default: "This is the default about data"
    },

    date:{
        type: Date,
        required: true,
        validate(value){
            if(value<new Date()){
                throw new Error("Event date cannot be in the past");
            }
        }
    },

    budget:{
        type:[Number],
        maxLength:2,
    },

    eventType:{
        type:String
    },

    attendees:{
        type:[Number],
        maxLength:2,
    },


    methods:{
        type: [String],
        maxLength: 5,
    },


    logo:{
        type:String,
        default: "https://cdn-icons-png.flaticon.com/256/149/149071.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valid URL");
            }
        }
    },

    sponsors:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'Sponsor'
    }



}
)


module.exports= mongoose.model('Event', eventSchema);
