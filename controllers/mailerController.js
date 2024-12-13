const nodemailer = require('nodemailer')
const ApiError = require('../error/ApiError')
const { Orders, UserOrders } = require('../modules/modules')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'erikhan03@gmail.com',
        pass:'mips xybe lgjy wpeq',
    }
})

class MailerController {
    async sendMessage(req,res, next){
        try{
            let {mail,orderNumber,product,sum,phone,userId,FIO} = req.body
            console.log('MAIL|')
            console.log(typeof mail)
            console.log('MAILphone|')
            console.log(typeof phone)

            // ${element.deviceElement.id}.</b> ${element.deviceElement.name} - ${element.countDevice} ${element.deviceElement.price}
            // "userOrdersId"id: {type: DataTypes.INTEGER,  primaryKey: true, autoIncrement: true}, // userid,
            const status = 'В обработке'
            console.log('MAILstatus|')
            console.log(typeof FIO)
            console.log(FIO)
            await UserOrders.create({userId,orderNumber,mail,phone,sum,status,FIO}).then(
                data =>      
                product.map((element,index) => {
                try {
                    const nevermore = data.id
                    const countDevice = element.countDevice
                    const price = element.deviceElement.price
                   
                    const DeviceId = element.deviceElement.id
                    Orders.create({countDevice,price,nevermore,DeviceId})
                } catch (error) {
                    console.log('ошибка')
                }
            })
            )



            const productText = product.map((element,index) =>`<span><b>  ${index+1}.</b> ${element.deviceElement.name} - ${element.countDevice} шт</span>`)
            
            const html = `
            <img src = 'cid:unique@openjavascript.info' width='400' alt = "Grapefruit slice atop a pile of other slices"></img>
            <h5>Приветствуем Вас в нашем Интернет-магазине!</h5>
            <p>Мы рады предоставить Вам уникальный выбор продукции, а также отличное качество обслуживания. Наша команда стремится сделать Вашу покупку максимально удобной и комфортной.</p>
            <p>Ваш уникальный номер заказа: <b>№ ${orderNumber}</b></p>
            <p>Обратитесь с ним к продавцу по адресу: <b>ул. Куйбышева, 26-К, Владимир, Владимирская обл., 600009</b> </p> 
            <p>Товар:<p>${productText}</p></p> 
            <p>Сумма: <b>${sum}руб.</b></p> 
             <p>Не забывайте, что мы всегда готовы помочь и ответить на любые вопросы. Вы можете связаться с нами через телефон и электронную почту. Будьте уверены, что мы заботимся о Вашем комфорте и стремимся превзойти все ожидания.</p>
             <h5>С уважением, команда запЧасти дляФорда.</h5>`

            const mailOptions = {
                from: 'erikhan03@gmail.com',
                to: mail,
                subject: 'Подтверждение заказа',
                html: html,
                attachments: [{
                    filename: process.env.REACT_APP_API_URL + '/d292cb97-0118-4f6f-9e3a-33a01ffd70bf.jpg',
                    path: process.env.REACT_APP_API_URL + '/d292cb97-0118-4f6f-9e3a-33a01ffd70bf.jpg',
                    cid: 'unique@openjavascript.info'
                },]
            }
            transporter.sendMail(mailOptions)
        }catch (e) {
            next(ApiError.badRequest(e.message))    
        }
    }
    async generateСode(req,res, next){
        try{
            let {email} = req.query

            const code = 12345
            console.log(req.query)
            const html = `
            <img src = 'cid:unique@openjavascript.info' width='400' alt = "Grapefruit slice atop a pile of other slices"></img>
            <h5>Приветствуем Вас в нашем Интернет-магазине!</h5>
            <p>Код: <b>${code}</b></p>
            <h5>С уважением, команда запЧасти дляФорда.</h5>`

            const mailOptions = {
                from: 'erikhan03@gmail.com',
                to: email,
                subject: 'Подтверждение почты',
                html: html,
                attachments: [{
                    filename: process.env.REACT_APP_API_URL + '/d292cb97-0118-4f6f-9e3a-33a01ffd70bf.jpg',
                    path: process.env.REACT_APP_API_URL + '/d292cb97-0118-4f6f-9e3a-33a01ffd70bf.jpg',
                    cid: 'unique@openjavascript.info'
                },]
            }
            console.log('sendMail')
            transporter.sendMail(mailOptions)
            console.log('sendMail2')
            return res.json(code)
        }catch (e) {
            next(ApiError.badRequest(e.message))    
        }
    }
}
module.exports = new MailerController()