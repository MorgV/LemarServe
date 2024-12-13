const ApiError = require('../error/ApiError')
const { UserOrders,Orders, Device } = require('../modules/modules')

class orderController {
    async getOne(req,res){
        const {id} = req.params
        console.log(req.params)
        let orders = await Orders.findAndCountAll({where: {nevermore:id}})
        // let newArray = orders.rows.map(el => Device.findOne({where:{id:el.DeviceId}}).then())

        return res.json(orders)
    }
    async getAll(req,res){
        let orders = await UserOrders.findAndCountAll()
        return res.json(orders)
    }
    // async getOne(req,res){

    //     let orders = await UserOrders.findAndCountAll()
    //     return res.json(orders)
    // }
    async create(req,res){
        try{
            let {userId} = req.body 
            // const device = await Device.create({name, price, brandId, typeId, img: fileName,deviceTableId})
            // return res.json(device)
            //         await UserOrders.create({userId: user.id})
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }
}
module.exports = new orderController()