import React from 'react';
import Result from '@/components/Result';
import {Button, Row, Col, Icon, Steps} from 'antd';
import styles from "./OrderResult.less"

const {Step} = Steps;

const desc1 = (
    <div style={{fontSize: 14, position: 'relative'}}>
        <div style={{marginTop: 8, marginBottom: 4}}>
            曲丽丽
            <Icon type="dingding" style={{marginLeft: 8}}/>
        </div>
        <div style={{marginTop: 8, marginBottom: 4}}>2016-12-12 12:32</div>
    </div>
);

const desc2 = (
    <div style={{fontSize: 14, position: 'relative'}}>
        <div style={{marginTop: 8, marginBottom: 4}}>
            周毛毛
            <Icon type="dingding" style={{color: '#00A0E9', marginLeft: 8}}/>
        </div>
        <div style={{marginTop: 8, marginBottom: 4}}><a href={"/"}>催一下</a></div>
    </div>
);

function extra(param){
    const {orderId,createdDate} = param;

    return(
        <div >
            <div style={{fontSize: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500, marginBottom: 20}}>
                订单
            </div>
            <Row style={{marginBottom: 16}}>
                <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                    <span style={{color: 'rgba(0, 0, 0, 0.85)'}}>订单 ID：</span>
                    {orderId}
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                    <span style={{color: 'rgba(0, 0, 0, 0.85)'}}>创建人：</span>
                    曲丽丽
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <span style={{color: 'rgba(0, 0, 0, 0.85)'}}>创建时间：</span>
                    {createdDate}
                </Col>
            </Row>
            <Steps progressDot current={1}>
                <Step title="选择车辆" description={desc1}/>
                <Step title="提交订单" description={desc2}/>
                <Step title="订单支付"/>
                <Step title="预定成功"/>
            </Steps>
        </div>
    )
}

const actions = (
    <div>
        <Button href={"/pay/OrderPay"} type="primary">支付订单</Button>
        <Button href={"/order/OrderDetail"}>查看订单</Button>
    </div>
);

class OrderResult extends React.Component {
    componentDidMount(){
        window.scrollTo(0,0);
    }

    render() {
        return (
            <Result className={styles.main}
                type="success"
                title="提交成功"
                description="提交结果页用于反馈一系列操作任务的处理结果，如果仅是简单操作，使用 Message 全局提示反馈即可。本文字区域可以展示简单的补充说明，如果有类似展示“单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。"
                extra={extra(this.props.location.query)}
                actions={actions}
                style={{width: '100%'}}
            />)
    }
}

export default OrderResult;

