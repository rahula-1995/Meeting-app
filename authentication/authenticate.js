const jwt = require( 'jsonwebtoken' );

const authenticate=( req, res, next )=> 
{
    try
    {
        if(req.header( 'Authorization' ))
        {
            const token = req.header( 'Authorization' );
            jwt.verify(token, 'shh...', function(err, claims) 
            {
                if( err ) 
                {
                    return res.status(401).json({ message: 'Please send the valid token' });
                //throw new Error("Go away Intruder");
                //return res.send({error: 'Please send the valid token'});
                };
            

                req.claims = claims;
            
                next();
            });
        }
        else
        {
            return res.status(401).json({ message: 'you are not Authorized to acess the resourse without token' });
            //throw new Error("Please send the token");
            //return res.send({error: 'you are not Authorization to acess the resourse without token'});
        }
    }
    catch(error)
    {
        return res.status(401).json({ message: 'Please authenticate to access the resourse' });
        /*console.log(error);
        res.status(401);
        return res.send({error: 'Please authenticate to access the resourse'});*/
    }   
}

module.exports = {
    authenticate
};