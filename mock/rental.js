export default {
    'GET /api/rental/filter-conditions': {
        status: 'ok',
        data: {
            options: [{
                value: '上海',
                label: '上海',
                children: [{
                    value: '奉贤区',
                    label: '奉贤区',
                    children: [{
                        value: '奉贤',
                        label: '奉贤',
                    }],
                }],
            }, {
                value: '山东',
                label: '山东',
                children: [{
                    value: '济南',
                    label: '济南',
                    children: [{
                        value: '历下区',
                        label: '历下区',
                    }],
                }],
            }],
            optionsCar: [
                {key:'所有',value:'所有',type:'icon-car',selected:true},
                {key:'SUV',value:'SUV',type:'icon-suv',selected:false},
                {key:'轿车',value:'轿车',type:'icon-jiaocheqiche',selected:false},
                {key:'卡车',value:'卡车',type:'icon-icon3',selected:false},
            ],
            optionsSeat: [
                {label: '5座以下', value: '5座以下'},
                {label: '5座以上', value: '5座以上'},
            ],
            optionsPrice: [
                {label: '0-150', value: '0-150'},
                {label: '150-300', value: '150-300'},
                {label: '300-500', value: '300-500'},
                {label: '500+', value: '500+'},
            ],
            optionsBrand: [
                {label: '奥迪', value: '奥迪'},
                {label: '宝马', value: '宝马'},
                {label: '奔驰', value: '奔驰'},
                {label: '本田', value: '本田'},
                {label: '福特', value: '福特'},
                {label: '沃尔沃', value: '沃尔沃'},
                {label: '起亚', value: '起亚'},
                // {label: 'Orange', value: 'Orange', disabled: false},
            ]
        }
    },
    'GET /api/rental/stores':{
        status: 'ok',
        data:[
            {label: '海泉路1店', value: 'ID0010224海泉路1店'},
            {label: '历下区总店', value: 'ID0010225历下区总店'},
        ]
    },
    'GET /api/rental/cars': (req, res) => {
        const page = parseInt(req.query.page);
        setTimeout(()=>{
            if (!req.query.more) {
                res.send({
                    status: 'ok',
                    data:{
                        short:[1,2,3,6,7],
                        week:[1,2,3,45],
                        month:[1,2,3,4]
                    }
                })
            }else {
                res.send({
                    status: 'ok',
                    data:[1,2,3,6,7],
                    page:page>3?-1:page+1,
                })
            }
        },1000)
    }

}
