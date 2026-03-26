const mongoose = require ("mongoose");

const doctorAvialabilitySchema = new mongoose.Schema ({

    doctorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true,
    },
    days:{
        type : [String],// ["online", "offline"]
        required : true,
    },
    startTime : {
        type : String,
        required : true,
    },
    endTime : {
        type : String,
        required : true,
    },
    mode : {
        type : [String],
        required : true,
    },
    isEmergencyAvailable : {
        type : Boolean,
        default : false,
    },

},{ timestamps: true });

module.exports = mongoose.model ("DoctorAvailability",doctorAvialabilitySchema);