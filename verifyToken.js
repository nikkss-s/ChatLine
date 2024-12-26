const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const verifyToken = (req, res, next) => {

    const bearerToken = req.body.token
    
    if(bearerToken == undefined){
        res.send({message: 'Unauthorized Access..\nPlz Login first..'})
    }else{
        try{
            jwt.verify(bearerToken, process.env.SECRET_KEY)
            next()
        }catch(err){
            next(new Error('Session Expired. Plz Login Again..'))
        }
    }
}

module.exports = verifyToken