export default {
    'GET /api/car/*':{
        id:1,
        src:'http://localhost:8000/static/cars1.cd308486.jpg',
        name:'大众朗逸',
        description:'三厢|1.6自动|乘坐5人|空间：空间较大，建议乘坐5人+3行李箱',

    },

    'GET /api/order/queryPrice':(req,res)=>{
        setTimeout(()=>{
            res.send({
                data:{
                    detail:[
                        {
                            name:'车辆租赁及服务费',
                            price:'¥190',
                            num:2,
                            amount:'¥180'
                        },
                        {
                            name:'基础服务费',
                            price:'¥30',
                            num:2,
                            amount:'¥60'
                        },
                        {
                            name:'车辆整备费',
                            price:'¥35',
                            num:1,
                            amount:'¥35'
                        }
                    ],
                    amount:'¥3500',
                    fetchCarDate:"2019/4/26 00:00:00",
                    fetchLocation:"浦东新区启航路1200号",
                    returnCarDate:"2019/4/27 00:00:00",
                    returnLocation:"奉贤区海泉路100号"
                }
            })
        },1000)
    },
    "POST /api/order/submitOrder":(req,res)=>{
        setTimeout(()=>{
            res.send({
                status:"ok",
                success:true,
                data:{
                    orderId:14255345646,
                    createdDate:"2019-04-26 20:22:23"
                }
            })
        },600);
    }
}