import React from 'react';
import pathToRegexp from 'path-to-regexp';
import {connect} from 'dva';
import {message} from 'antd';
import Authorized from '@/utils/Authorized';
import {getAuthority} from '@/utils/authority';
import Exception403 from '@/pages/Exception/403';
import {stringify} from "qs";
import router from 'umi/router';

function AuthComponent({children, location, routerData}) {
    const auth = getAuthority();
    const isLogin = auth && auth[0] !== 'guest';
    const getRouteAuthority = (path, routeData) => {
        let authorities = false;
        routeData.forEach(route => {
            // match prefix
            if (pathToRegexp(`${route.path}(.*)`).test(path)) {
                authorities = route.authority || authorities;

                // get children authority recursively
                if (route.routes) {
                    authorities = getRouteAuthority(path, route.routes) || authorities;
                }
            }
        });
        return authorities;
    };

    return (
        <Authorized
            authority={getRouteAuthority(location.pathname, routerData)}
            noMatch={isLogin ? <Exception403/> :
                (
                    <div>
                        {message.info("请登录账户后继续操作！")}
                        {router.push({
                            pathname: "/user/login",
                            search: stringify({
                                redirect: window.location.href,
                            })
                        })}
                        {/*<Redirect*/}
                            {/*to={}/>*/}
                    </div>
                )
            }
        >
            {children}
        </Authorized>
    );
}

export default connect(({menu: menuModel}) => ({
    routerData: menuModel.routerData,
}))(AuthComponent);