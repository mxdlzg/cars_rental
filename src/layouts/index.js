import styles from './index.less';
import 'ant-design-pro/dist/ant-design-pro.css';
import {Avatar, Layout, Menu} from "antd";
import {BackTop} from 'antd';
import React from "react";
import Animate from 'rc-animate';

// import UserHeader from './Header';

const {
    Header, Footer, Content,
} = Layout;


class BasicLayout extends React.Component {
    state = {
        visible: true,
    };

    componentDidMount() {
        document.addEventListener('scroll', this.handScroll, {passive: true});
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.handScroll);
    }

    handScroll = () => {
        // const {autoHideHeader} = this.props;
        const {visible} = this.state;
        //         // if (!autoHideHeader) {
        //         //     return;
        //         // }
        const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
        if (!this.ticking) {
            this.ticking = true;
            requestAnimationFrame(() => {
                if (this.oldScrollTop > scrollTop) {
                    this.setState({
                        visible: true,
                    });
                } else if (scrollTop > 300 && visible) {
                    this.setState({
                        visible: false,
                    });
                } else if (scrollTop < 300 && !visible) {
                    this.setState({
                        visible: true,
                    });
                }
                this.oldScrollTop = scrollTop;
                this.ticking = false;
            });
        }
    };

    render() {
        const props = this.props;
        const {visible} = this.state;


        return (
            <Layout className={styles.normal}>
                <Animate component="" transitionName="fade">
                    {visible ?
                        (<Header className={styles.header}>
                            <a href={"/"}>Header</a>
                            <Menu
                                mode="horizontal"
                                defaultSelectedKeys={['1']}
                                className={styles.menu}
                            >
                                <Menu.Item key="1">国内租车</Menu.Item>
                                <Menu.Item key="2">顺风车</Menu.Item>
                                <Menu.Item key="3">长租车</Menu.Item>
                            </Menu>
                            <a href={"/user/account"}><Avatar className={styles.user} icon="user"/></a></Header>)
                        : null}
                </Animate>

                <Content className={styles.content}>{props.children}</Content>
                <Footer className={styles.footer}>Footer</Footer>
                <BackTop/>
            </Layout>
        );
    }
}

export default BasicLayout;
