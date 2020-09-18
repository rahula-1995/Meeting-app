
const mongoose = require("mongoose");
const meetModel = require("../models/meetModel");
const Meet = mongoose.model('Meet', meetModel.MeetSchema);
const Users = mongoose.model('Users', meetModel.UsersSchema);


exports.getUser=(req, res)=> 
{
    try
    {
//console.log(req) 
        const email= req.query.email
        const password= req.query.password
        if (email!==undefined & password!==undefined)
        {

            console.log(req.query.password)
            let params = { email: email, password: password };
            Users.find(params, (err, Users) => 
            {
                if (err) 
                {
                    return res.status(401).json({ message: err });
                }
                else if (Users.length>0)
                {
                    const claims = { email: Users[0].email, userId: Users[0]._id };
                    jwt.sign(claims, 'shh...', {expiresIn: '24h'}, function( error, token ) 
                    {
                        console.log( 'jwt token generated' );

                        if( error )
                        {
                            return res.status(401).json({ message: error.message });
                        }

                        res.status(200).json(
                        {
                            message: 'Signed in sucessfully',
                            token: token,
                            email: Users[0].email,
                            name: Users[0].name,
                            userid:Users[0]._id
                        });
                    });
                }
                else
                {
                    return res.status(401).json({ message: "Please check your credentials" });
                    //return res.send("please enter right credentials")
                }

    //res.json(Users);
            })
        }
        else
        {
            return res.status(401).json({ message: "Please enter your email and password " });
            //return res.send("please send the email and password")
        }
    }
    catch(error)
    {
        return res.status(404).json({ message: "Please check your email and password then try " });
        /*res.statusCode = 500;
        res.send(error.message);*/
    }
}
exports.addNewUser=(req, res)=> {
    try
    {
        const body = 
        {
            email: req.query.email,
            name: req.query.name,
            password: req.query.password
        };
        let newUser = new Users(body);
        newUser.save((err, User) =>
        {
            if (err) 
            {
                return res.status(401).json({ message: err });
            }
            return res.status(200).json(User);
        });
    }
    catch(error)
    {
        return res.status(401).json({ message: error });
        /*res.statusCode = 500;
        res.send(error.message);*/
    }
}
exports.Filtermeeting=(req, res,next)=> {
    try
    {
            //res.setHeader("Content-Type", 'application/json');
            //if(req.query.period>0){
        const period = req.query.period
        
        console.log(req.query.period)
        
        const search = req.query.search;
        //const userId = req.query.userId;
        const email = req.query.email;

        const filter = { date: { }, attendees: { $elemMatch: { } } };

        //if( userId ) {filter.attendees.$elemMatch.userId = userId;}

    if( email ) 
    {
        filter.attendees.$elemMatch.email = email;
    }
    else
    {
        return res.status(404).json({ message: "please send the email id" });
        //return res.send({error: 'please send the email id'});
    }

    const today = new Date();

    switch( period ) {
        case "PAST":
            filter.date.$lt = today;
            break;
        case "PRESENT":
            filter.date.$eq = today;
            break;
        case "FUTURE":
            filter.date.$gt = today;
            break;
        default: // "all" or anything else
            delete filter.date;
    }

    if( search ) 
    {
        filter.description = 
        {
            $regex: new RegExp( search, "i" )
        }
    }

    
    Meet.find( filter )
    .exec(( error, results ) => 
    {
        if( error ) 
        {
            return res.status(404).json({ message: error });
            /*error.status = 500;
            res.send( error );*/
        }
        else if (results.length>0)
        {
            return res.status(200).json(results);
        }
        else
        {
            return res.status(404).json({ message: "Nothing found for this search" });
        }

        //res.setHeader("Content-Type", 'application/json');
        //return res.status(200).json( results );
            
            
    });
    }
    catch(error)
    {
        return res.status(404).json({ message: error });
    /*res.statusCode = 500;
    res.send(error.message);*/
    }
}

    

exports.addNewMeeting=(req, res)=> 
{
    try
        {
       
            let newMeet = new Meet(req.body);
            newMeet.save((err, Meet) => 
            {
                if (err) 
                {
                    return res.status(404).json({ message: error });
                }
                return res.status(200).json( Meet );
                //res.json(Meet);
            });
        }
    catch(error)
        {
            return res.status(404).json({ message: error });
            /*res.statusCode = 500;
            res.send(error.message);*/
        }
}
exports.addAttendes=(req, res)=> 
{
    try
    {
        if(req.query.email!==undefined && req.query.meetid!==undefined)
            {
                const email = req.query.email;
                Users.find({ email: email }, { _id: true }, (err, Meets) => 
                {
                    if (err) 
                    {
                        return res.status(404).json({ message: err });
                    }
                    else if(Meets.length>0)
                    {
                    const details = { userId: String(Meets[0]._id), email: email };
                    Meet.
                        findOneAndUpdate({ _id: req.query.meetid }, { $push: { attendees: details } }, { new: true }, (err, Meet) =>
                        {
                        if (err) 
                        {
                            return res.status(404).json({ message: err });
                        }
                        return res.status(200).json(Meet);
                        });
                }
                else
                {
                    return res.status(404).json({ message: "please send the valid credentials" });
                    /*res.statusCode = 404;
                    return res.send("please send the valid credentials");*/
                }
            });
        }else
            {
                return res.status(404).json({ message: "please send the credentials" });
                /*res.statusCode = 404;
                return res.send("please send the credentials");*/
            }
    }
    catch(error)
    {
        return res.status(404).json({ message: error });
    /*res.statusCode = 400;
    res.send(error.message);*/
    }
}
exports.removeAttendes=(req, res)=> 
{
    try
    {
        
        if(req.query.email!==undefined && req.query.meetid!==undefined)
        {
            const email = req.query.email;
            const user_id = req.query.userid;
            const details = { userId: user_id, email: email };
            Meet.
                update({ _id: req.query.meetid }, { $pull: { attendees: details } }, { multi: true }, (err, Meet) => 
                {
                if (err) 
                {
                    return res.status(404).json({ message: err });
                }
                /*else if (Meet.length>0)
                {
                    return res.status(200).json(Meet);
                }
                else
                {
                    return res.status(404).json({ message: "attendes list is empty" });
                }*/console.log(Meet.length)
                
                return res.status(200).json(Meet);
            });
        }
        else
        {
            return res.status(404).json({ message: "please send the credentials" });
            /*res.statusCode = 400;
            res.send("please send the credentials");*/
        }
    }
    catch(error)
    {
        return res.status(404).json({ message: error });
        /*res.statusCode = 400;
        res.send(error.message);*/
    }
}
exports.showcalender=(req, res)=> 
{
    try
    {
        
    //console.log(req) 
        if(req.query.email!==undefined && req.query.date!==undefined )
        {
            const email = req.query.email;
            const dates = String(req.query.date);
            const date = new Date(dates);
            console.log(date, email);
            let params = { date: date, "attendees.email": email };
            Meet.find(params, (err, Users) => 
            {
                if (err) 
                {
                    return res.status(404).json({ message: err });
                }
                else if (Users.length>0)
                {
                    return res.status(200).json(Users);
                }
                else
                {
                    return res.status(404).json({ message: "Nothing found for this date and user" });
                }
            });
        }
        else
        {
            return res.status(404).json({ message: "please send the email" });
            /*res.statusCode = 400;
            res.send("please send the email");*/
        }
    }
    catch(error)
    {
        return res.status(404).json({ message: error });
    
        
    }
}

//module.exports={getUser,addNewUser,addNewMeeting,addAttendes,removeAttendes,showcalender,Filtermeeting}