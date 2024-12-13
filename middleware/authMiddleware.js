const jwt = require('jsonwebtoken')

module.exports = function(req,res,next){
    if (req.method === "OPTIONS"){
        next()
    }
   
    try{
       
        const token = req.headers.authorization.split(' ')[1] //Bearer sdfwpoejfow
        if (!token){
           return res.status(401).json({message:'Не авторизован'})
        }
        console.log('1111111111111111111')
        console.log(req.headers.authorization)
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    }catch (e) {
        res.status(401).json({message: "Не авторизован d"})
    }
}