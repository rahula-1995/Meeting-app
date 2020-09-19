const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
const validator = require("validator");
//var ObjectId = mongoose.Types.ObjectId;
exports.UsersSchema = new Schema({
    name: 
    {
        type: String,
        required: true
    },
    email: 
    {
        type: String,
        required: true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Enter a valid Email")
            }
        },
        lowercase:true,
        unique:true
    },
    phone_number:
    {
        type: Number,
    },
    password: 
    {
        type: String,
        required: true
    }
});

exports.MeetSchema = new Schema({
    name: 
    {
        type: String,
        required: true
    },
    date: 
    {
        type: Date,
        default: Date.now,
        required: true
    },
    startTime: 
    {
        hours: 
        {
            type: Number,
            required: true,
            min: 0,
            max: 23
        },
        minutes: {
            type: Number,
            required: true,
            min: 0,
            max: 59
        }
    },
    endTime: 
    {
        hours: 
        {
            type: Number,
            required: true,
            min: 0,
            max: 23
        },
        minutes: 
        {
            type: Number,
            required: true,
            min: 0,
            max: 59
        }
    },
    description: 
    {
        type: String,
        required: 'Enter password'
    },
    attendees: 
    [
        {
            userId: 
            {
                type: ObjectIdSchema,
                required: true
            },
            email: 
            {
                type: String,
                required: true,
                validate(value)
                {
                    if(!validator.isEmail(value))
                    {
                        throw new Error("Enter a valid Email")
                    }
                },
                lowercase:true
                
            },
            _id: false
        }
    ]
});