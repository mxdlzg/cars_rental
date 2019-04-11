
export default {
    'GET /api/rental/filter-conditions':{
        status:'ok',
        data:{
            options:[{
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
            optionsSeat:[
                {label: '5座以下', value: '5座以下'},
                {label: '5座以上', value: '5座以上'},
            ],
            optionsPrice:[
                {label: '0-150', value: '0-150'},
                {label: '150-300', value: '150-300'},
                {label: '300-500', value: '300-500'},
                {label: '500+', value: '500+'},
            ],
            optionsBrand:[
                {label: '不限', value: '不限'},
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

}
