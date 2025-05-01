const mongoose= require('mongoose');

const chatSchema = new mongoose.Schema(
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
      },
      senderType: {
        type: String,
        enum: ['organizer', 'sponsor'],
      },
      text: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  );
   
const investmentSchema= new mongoose.Schema({
    event:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Event'
    },

    description:{
        type: String,
        default: "This is the default description"
    },

    methods:{
        type:[String]
    },

    sponsor:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: 'Sponsor'
    },

    status:{
        type: String,
        default: 'pending'
    },

    chat:{
        type: [chatSchema],
        default: []
    }

}
)


module.exports= mongoose.model('Investment', investmentSchema);
