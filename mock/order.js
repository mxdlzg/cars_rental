export default {
    'GET /api/car/*': {
        id: 1,
        src: 'http://localhost:8000/static/cars1.cd308486.jpg',
        name: '大众朗逸',
        description: '三厢|1.6自动|乘坐5人|空间：空间较大，建议乘坐5人+3行李箱',

    },

    'GET /api/order/queryPrice': (req, res) => {
        setTimeout(() => {
            res.send({
                data: {
                    detail: [
                        {
                            name: '车辆租赁及服务费',
                            price: '¥190',
                            num: 2,
                            amount: '¥180'
                        },
                        {
                            name: '基础服务费',
                            price: '¥30',
                            num: 2,
                            amount: '¥60'
                        },
                        {
                            name: '车辆整备费',
                            price: '¥35',
                            num: 1,
                            amount: '¥35'
                        }
                    ],
                    amount: '¥3500',
                    fetchCarDate: "2019/4/26 00:00:00",
                    fetchLocation: "浦东新区启航路1200号",
                    returnCarDate: "2019/4/27 00:00:00",
                    returnLocation: "奉贤区海泉路100号"
                }
            })
        }, 1000)
    },
    "POST /api/order/submitOrder": (req, res) => {
        setTimeout(() => {
            res.send({
                status: "ok",
                success: true,
                data: {
                    id: "2019040101000026102",
                    createdDate: "2019-04-26 20:22:23",
                }
            })
        }, 600);
    },
    "GET /api/order/queryPayInfo": {
        success: true,
        data: {
            id: "2019040101000026102",
            description: "账号1728227443-腾讯云",
            totalPrice: '￥2000',
            createdDate: "2019-04-26 20:26:39",
            finished: false,
            payDate: "2019-04-26 20:22:23",
        }
    },
    "GET /api/order/queryOrderList": {
        success:true,
        content: [
            {id:"2019040101000026102",avatar: "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png"},
            {id:"2019040101000026102",avatar: "https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png"},
            {id:"2019040101000026102",avatar: "https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png"},
            {id:"2019040101000026102",avatar: "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png"},
            {id:"2019040101000026102",avatar: "https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png"},
            {id:"2019040101000026102",avatar: "https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png"},
        ],
        last:false,
        number:1,
    }
}