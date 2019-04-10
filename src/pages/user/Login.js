import styles from './Login.css';
import React from "react";
import {Login} from 'ant-design-pro';
import {Alert, Checkbox, Icon, Card} from 'antd';
import {Link} from "umi";
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import {connect} from 'dva';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({login,loading})=>({
    login,
    submitting:loading.effects['login/submit']
}))

class LoginPage extends React.Component {
    state = {
        notice: '',
        type: 'tab1',
        autoLogin: true,
    };
    onSubmit = (err, values) => {
        const { type } = this.state;
        if (!err) {
            const { dispatch } = this.props;
            dispatch({
                type: 'login/submit',
                payload: {
                    ...values,
                    type,
                },
            });
        }
    };
    onTabChange = (key) => {
        this.setState({
            type: key,
        });
    };
    changeAutoLogin = (e) => {
        this.setState({
            autoLogin: e.target.checked,
        });
    };
    render() {
        const { submitting } = this.props;
        return (
            <div className={styles.back}>
                <Card className={styles.loginCard}>
                    <Login

                        defaultActiveKey={this.state.type}
                        onTabChange={this.onTabChange}
                        onSubmit={this.onSubmit}
                        ref={form => {
                            this.loginForm = form;
                        }}
                    >
                        <Tab key="tab1" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
                            {this.state.notice && (
                                <Alert
                                    style={{ marginBottom: 24 }}
                                    message={this.state.notice}
                                    type="error"
                                    showIcon
                                    closable
                                />
                            )}
                            <UserName name="username" placeholder={"用户名"} />
                            <Password name="password" placeholder={"密码"}
                                      onPressEnter={e => {
                                          e.preventDefault();
                                          this.loginForm.validateFields(this.onSubmit);
                                      }}/>
                        </Tab>
                        <Tab key="tab2" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
                            <Mobile name="mobile" placeholder={"手机号码"} />
                            <Captcha
                                getCaptchaButtonText={"获取验证码"}
                                getCaptchaSecondText={"秒"}
                                onGetCaptcha={() => console.log('Get captcha!')}
                                name="验证码"
                                placeholder={"验证码"}
                            />
                        </Tab>
                        <div>
                            <Checkbox
                                checked={this.state.autoLogin}
                                onChange={this.changeAutoLogin}
                            >
                                保持登录
                            </Checkbox>
                            <a style={{ float: 'right' }} href="/">
                                忘记密码
                            </a>
                        </div>
                        <Submit loading={submitting}><FormattedMessage id="app.login.login" /></Submit>
                        <div className={styles.other}>
                            <FormattedMessage id="app.login.sign-in-with" />
                            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
                            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
                            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
                            <Link className={styles.register} to="/user/register">
                                <FormattedMessage id="app.login.signup" />
                            </Link>
                        </div>
                    </Login>
                </Card>
            </div>
        );
    }
}

export default LoginPage;
