
const { where } = require('sequelize')
const ApiError = require('../error/ApiError')
const {Basket} = require('../modules/modules')


class BasketController {
    async getAll(req,res){
        let {userId} = req.query
        console.log("Все")

        const basket = await Basket.findAndCountAll({where: {userId}})
        
        return res.json(basket)
    }

    async AddToBasket(req,res, next){
        try{
            let {userId, deviceId,countDevice} = req.body 
            const basket = await Basket.create({userId,deviceId,countDevice})
            console.log("добавление")

            return res.json(basket)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async deleteOne(req,res,next){
        let {userId,deviceId} = req.query 
        try {
            console.log({deviceId})
            console.log("Удаление")
            await Basket.destroy({where: {userId,deviceId}})

            return res.json("Удалиние")
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }
    async updateCount(req,res, next){
        try{
            console.log("ЦЦЦЦЦЦЦЦЦЦЦ")
            // console.log({deviceId})
            let user = req.body 
            let {userId,deviceId,countDevice} = user.params
            console.log({userId})
            console.log({deviceId})
            console.log({countDevice})
            // console.log({deviceId})
            // console.log({countDevice})
            const basket = await Basket.findOne({where: {userId,deviceId}})
            
            console.log(basket.countDevice)
            basket.update({countDevice:countDevice});
            console.log(basket.countDevice)
            return res.json("все ок")
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

    module.exports = new BasketController()