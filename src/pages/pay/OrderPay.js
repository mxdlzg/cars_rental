import React from 'react'
import styles from './OrderPay.css'
import {Steps, Card, Collapse, Icon, Divider,Button} from "antd";
import weChat from '@/assets/wechatpay.png';
const ButtonGroup = Button.Group;
const Step = Steps.Step;
const Panel = Collapse.Panel;
const steps = [{
    title: '选择车型',
    content: '1',
}, {
    title: '填写订单',
    content: '2',
}, {
    title: '在线支付',
    content: '3',
}, {
    title: '预订成功',
    content: '4',
}];
const customPanelStyle = {
    background: '#ffffff',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
};


class OrderPay extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            num:'20190401010000261024502342752244',
            current: 2,
            price:'￥2000'
        };
    }

    render(){
        const {current,num,price} = this.state;
        return(
            <div className={styles.main}>
                <Steps className={styles.steps} current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title}/>)}
                </Steps>
                <div className="steps-content">
                    <Card className={styles.card}>
                        <div>
                            <div className={styles.left}>
                                <h2><b>订单编号：</b></h2><h3>{num}</h3>
                                <h2><b>支付金额：</b></h2><h3>{price}</h3>
                            </div>
                            <Collapse
                                className={styles.right}
                                bordered={false}
                                defaultActiveKey={['1']}
                                expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                            >
                                <Panel header="订单详情" key="1" style={customPanelStyle}>
                                    <p>
                                        商品名称：
                                        账号1728227443-腾讯云
                                        <br/>
                                        支付订单：
                                        E-190401190270062870
                                        <br/>
                                        应付金额：
                                        ￥1.00
                                        <br/>
                                        购买时间：
                                        2019年04月01日
                                    </p>
                                </Panel>
                            </Collapse>
                        </div>
                        <Divider/>
                        <h2><b>支付方式：</b></h2>
                        <ButtonGroup >
                            <Button><Icon type="alipay-circle" />支付宝</Button>
                            <Button><Icon type="wechat" />微信支付</Button>
                            <Button><Icon type="credit-card" />银行卡支付</Button>
                        </ButtonGroup>
                        <br/><br/>
                        <img alt={"weChat"} src={weChat}/>
                        <br/>
                        <Button className={styles.finished} style={{fontSize:'17px', width: '15%', height: '100%', float: 'right'}                            }
                                icon="money-collect"
                                href="/order/OrderResult"
                                type="primary"><br/>已完成支付</Button>
                        <br/>
                    </Card>
                </div>
            </div>
        )
    }
}

export default OrderPay;