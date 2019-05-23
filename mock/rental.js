export default {
    'GET /api/rental/filter-conditions': {
        status: 'ok',
        data: {
            options: [
                {
                    value: '上海',
                    label: '上海',
                    children: [{
                        value: '奉贤区',
                        label: '奉贤区',
                        children: [{
                            value: '海湾镇',
                            label: '海湾镇',
                        }],
                    }],
                },
                {
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
                {key: '所有', value: '所有', type: 'icon-car', selected: true},
                {key: 'SUV', value: 'SUV', type: 'icon-suv', selected: false},
                {key: '轿车', value: '轿车', type: 'icon-jiaocheqiche', selected: false},
                {key: '卡车', value: '卡车', type: 'icon-icon3', selected: false},
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
    'GET /api/rental/stores': {
        status: 'ok',
        data: [
            {label: '海泉路1店', value: 'ID0010224海泉路1店'},
            {label: '历下区总店', value: 'ID0010225历下区总店'},
        ]
    },
    'GET /api/rental/cars': (req, res) => {
        const page = parseInt(req.query.page);
        setTimeout(() => {
            if (!req.query.more) {
                res.send({
                    status: 'ok',
                    data: {
                        // short:[1,2,3,6,7],
                        // week:[1,2,3,45],
                        // month:[1,2,3,4],
                        content: [
                            {
                                id: 1,
                                bookAble: true,
                                buyDate: "2019-04-23T21:25:30.000+0800",
                                carcaseId: null,
                                defaultRentPrice: 0,
                                engineId: null,
                                insuranceId: null,
                                manufactureDate: null,
                                rentAble: false,
                                typeId: null,
                                description: "测试车辆1",
                                brandName: null,
                                fuelId: null,
                                typeName: null,
                                storeId: 1,
                                capability: null,
                                latestAvailableDate: "2019-04-23T21:35:58.000+0800",
                                serviceTypeId: 1
                            },
                            {
                                id: 2,
                                bookAble: true,
                                buyDate: "2019-04-23T21:25:30.000+0800",
                                carcaseId: null,
                                defaultRentPrice: 0,
                                engineId: null,
                                insuranceId: null,
                                manufactureDate: null,
                                rentAble: false,
                                typeId: null,
                                description: "测试车辆2",
                                brandName: null,
                                fuelId: null,
                                typeName: null,
                                storeId: 1,
                                capability: null,
                                latestAvailableDate: "2019-04-23T21:35:58.000+0800",
                                serviceTypeId: 1
                            },
                            {
                                id: 3,
                                bookAble: true,
                                buyDate: "2019-04-23T21:25:30.000+0800",
                                carcaseId: null,
                                defaultRentPrice: 0,
                                engineId: null,
                                insuranceId: null,
                                manufactureDate: null,
                                rentAble: false,
                                typeId: null,
                                description: "测试车辆3",
                                brandName: null,
                                fuelId: null,
                                typeName: null,
                                storeId: 1,
                                capability: null,
                                latestAvailableDate: "2019-04-23T21:35:58.000+0800",
                                serviceTypeId: 1
                            }
                        ],
                        pageable: {
                            sort: {
                                unsorted: true,
                                sorted: false,
                                empty: true
                            },
                            offset: 0,
                            pageSize: 3,
                            pageNumber: 0,
                            unpaged: false,
                            paged: true
                        },
                        totalElements: 4,
                        last: false,
                        totalPages: 2,
                        number: 0,
                        size: 3,
                        first: true,
                        sort: {
                            unsorted: true,
                            sorted: false,
                            empty: true
                        },
                        numberOfElements: 3,
                        empty: false
                    }
                })
            } else {
                res.send({
                    status: 'ok',
                    data: {
                        content: [
                            {
                                id: 8,
                                bookAble: true,
                                buyDate: null,
                                carcaseId: null,
                                defaultRentPrice: 0,
                                engineId: null,
                                insuranceId: null,
                                manufactureDate: null,
                                rentAble: false,
                                typeId: null,
                                description: "测试车辆8",
                                brandName: null,
                                fuelId: null,
                                typeName: null,
                                storeId: 1,
                                capability: null,
                                latestAvailableDate: "2019-04-20T19:57:14.000+0800",
                                serviceTypeId: 2
                            }
                        ],
                        pageable: {
                            sort: {
                                sorted: false,
                                unsorted: true,
                                empty: true
                            },
                            offset: 3,
                            pageNumber: 1,
                            pageSize: 3,
                            unpaged: false,
                            paged: true
                        },
                        totalElements: 4,
                        last: true,
                        totalPages: 2,
                        number: 1,
                        size: 3,
                        sort: {
                            sorted: false,
                            unsorted: true,
                            empty: true
                        },
                        numberOfElements: 1,
                        first: false,
                        empty: false
                    },
                })
            }
        }, 1000)
    }

}
