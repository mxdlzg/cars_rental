export default {
    'GET /api/car/*':{
        id:1
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
                    amount:'¥3500'
                }
            })
        },1000)
    }
}