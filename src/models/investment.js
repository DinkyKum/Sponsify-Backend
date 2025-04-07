const mongoose= require('mongoose');

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
    }

}
)


module.exports= mongoose.model('Investment', investmentSchema);
