const admin = require('./firebase');

const verifyToken = async(req, res, next) => {
    const token = req.headers.authorization;  //frontend send same format

    if(!token){
        return req.status(401).send({message: 'Unauthorized: No token provided'});

       
    }
    try{
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    }catch(e){
        console.log(e.message);
        res.status(401).send({message: 'Unauthorized: Invalid token provided'});
    }
};

module.exports = verifyToken;