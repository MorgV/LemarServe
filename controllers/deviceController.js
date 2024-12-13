const uuid = require('uuid')
const path = require('path')
const {Device, DeviceInfo, DeviceTable} = require('../modules/modules')
const db = require('../db')
const ApiError = require('../error/ApiError')

class DeviceController {
    async create(req,res, next){
        try{
            let {name, price, brandId, typeId, info, deviceTableId} = req.body 
            const {img}= req.files
            let fileName = uuid.v4()+ ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static',fileName))
            const device = await Device.create({name, price, brandId, typeId, img: fileName,deviceTableId})

            if(info){
                info = JSON.parse(info)
                info.forEach(i => 
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id 
                    })
                )
            }

            return res.json(device)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req,res){
        let {brandId, typeId, limit, page,text} = req.query
        // text = 1
        if(text){
            let zapros =await db.query("SELECT devices.* FROM devices,device_tables WHERE( devices.name LIKE '%"+text+"%' or device_tables.serialnumber  LIKE '%"+text+"%') and  device_tables.id = devices.id ")
            let otvet ={
                rows: zapros[0] ,
                count:zapros[0].length
            }
            console.log(otvet.rows)
            return res.json(otvet)
        }
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        if(!brandId && !typeId){
            devices = await Device.findAndCountAll({limit, offset})
        }
        if(brandId && !typeId){
            devices = await Device.findAndCountAll({where: {brandId},limit, offset})
        }
        if(!brandId && typeId){
            devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        if(brandId && typeId){
            devices = await Device.findAndCountAll({where: {typeId, brandId}, limit, offset})
        }
        return res.json(devices)
    }

    async getOne(req,res){
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{ model: DeviceInfo, as: 'info'}]
            },
        )
        return res.json(device)
    }

    async getTable(req,res){

        return res.json(await DeviceTable.findAndCountAll())
    }
}

    module.exports = new DeviceController()