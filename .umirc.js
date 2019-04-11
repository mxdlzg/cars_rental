import path from 'path';
//import routesConfig from './src/config/router.config';
//import {FormattedMessage, formatMessage} from 'umi-plugin-react/locale';

export default {
    treeShaking: true,
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: {
                immer: true,
                dynamicImport:undefined
            },
            dynamicImport: false,
            title: 'cars_rental',
            dll: false,

            routes: {
                exclude: [
                    /components\//,
                ],
            },
            locale: {
                default: 'zh-CN', //默认语言 zh-CN
                baseNavigator: true, // 为true时，用navigator.language的值作为默认语言
                antd: true // 是否启用antd的<LocaleProvider />
            },
            resolve: {
                extensions: ['.js', '.vue', '.json'],
                alias: {
                    '@': path.resolve(__dirname, 'src/')
                }
                // configuration options
            },
        }]
    ],
    routes: [
        // app
        {
            path: '/user',
            component: '../layouts/BasicLayout',
            routes: [
                {path: '/user', redirect: '/user/login'},
                {path: '/user/login', name: 'login', component: './user/Login'},
                {path: '/user/register', name: 'register', component: './user/Register'},
                {path: '/user/register-result', name: 'register-result', component: './user/RegisterResult'},
                {
                    path: '/user/account', name: 'account', component: './user/account/Account',
                    Routes:['src/pages/Authorized'],
                    authority:['user'],
                    routes: [
                        {path: '/user/account', redirect: '/user/account/orders'},
                        {path: '/user/account/orders', name: 'orders', component: './user/account/Orders'},
                        {path: '/user/account/assets', name: 'assets', component: './user/account/Assets'},
                        {path: '/user/account/invoices', name: 'invoices', component: './user/account/Invoices'},
                    ]
                },
                {component: '404'},
            ]
        },
        {
            path: '/order',
            component: '../layouts/index',
            Routes:['src/pages/Authorized'],
            authority: ['user'],
            routes: [
                {path: '/order/OrderDetail', name: 'orderdetail', component: './order/OrderDetail'},
                {path: '/order/OrderResult', name: 'orderresult', component: './order/OrderResult'},
                {path: '/order/RentalOrder', name: 'rentalorder', component: './order/RentalOrder'},
                {component: '404'},
            ]
        },
        {
            path: '/pay',
            Routes:['src/pages/Authorized'],
            authority: ['user'],
            component: '../layouts/index',
            routes: [
                {path: '/pay/OrderPay', name: 'orderpay', component: './pay/OrderPay'},
                {component: '404'},
            ]
        },
        //public
        {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
                {path: '/', component: './index'/*, authority: ['admin', 'user']*/},
                {path: '/rental/SelfDriving', name: "自驾租车", component: './rental/SelfDriving'},
                {component: '404'},
            ]
        },

    ]

}
