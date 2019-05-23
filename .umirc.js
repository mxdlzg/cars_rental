import path from 'path';
//import routesConfig from './src/config/router.config';
//import {FormattedMessage, formatMessage} from 'umi-plugin-react/locale';

export default {
    treeShaking: true,
    proxy: {
        '/server/static': {
            target: 'http://localhost:8080/',
            changeOrigin: true,
            pathRewrite: { '^/server/static': '/' },
        },
        '/api': {
            target: 'http://localhost:8080/',
            changeOrigin: true,
            // pathRewrite: { '^/api': '' },
        },
    },
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: {
                immer: true,
                dynamicImport: undefined
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
                {path: '/user/register-result', component: './user/RegisterResult'},
                {
                    path: '/user/account', name: 'account', component: './user/account/Account',
                    Routes: ['src/pages/Authorized'],
                    authority: ['user'],
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
            component: '../layouts/BasicLayout',

            routes: [
                {path: '/order', redirect: "/"},
                {
                    Routes: ['src/pages/Authorized'],
                    path: '/order/OrderDetail',
                    authority: ['user'],
                    name: 'orderdetail',
                    component: './order/OrderDetail'
                },
                {
                    Routes: ['src/pages/Authorized'],
                    path: '/order/OrderResult',
                    authority: ['user'],
                    name: 'orderresult',
                    component: './order/OrderResult'
                },
                {
                    Routes: ['src/pages/Authorized'],
                    path: '/order/RentalOrder',
                    authority: ['user'],
                    name: 'rentalorder',
                    component: './order/RentalOrder'
                },
                {component: '404'},
            ]
        },
        {
            path: '/pay',
            component: '../layouts/BasicLayout',
            routes: [
                {
                    Routes: ['src/pages/Authorized'],
                    path: '/pay/OrderPay',
                    authority: ['user'],
                    name: 'orderpay',
                    component: './pay/OrderPay'
                },
                {component: '404'},
            ]
        },
        {
            path: '/management',
            component: '../layouts/BasicLayout',
            // name: 'management',
            // icon: 'management',
            routes: [
                {path: '/management', redirect: "/management/Analysis"},
                {
                    Routes: ['src/pages/Authorized'],
                    authority: ['admin'],
                    path: '/management/Analysis',
                    name: 'analysis',
                    component: './management/Analysis',
                },
                {
                    Routes: ['src/pages/Authorized'],
                    authority: ['admin'],
                    path: '/management/Monitor',
                    name: 'monitor',
                    component: './management/Monitor',
                },
                {
                    Routes: ['src/pages/Authorized'],
                    authority: ['admin'],
                    path: '/management/Workplace',
                    name: 'workplace',
                    component: './management/Workplace',
                },
                {component: '404'},
            ],
        },
        //public
        {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
                {path: '/', component: './index'/*, authority: ['admin', 'user']*/},
                {path: '/rental/SelfDriving', name: "自驾租车", component: './rental/SelfDriving'},
                {path: '/management', name: "超级控制台"},
                {path: '/500', component: '500'},
                {component: '404'},
            ]
        },
        {component: '404'},

    ]
}
