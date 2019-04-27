import React from 'react';
import Result from '@/components/Result';
import {Button, Row, Col, Icon, Steps} from 'antd';
import styles from "./OrderResult.less"
import router from "umi/router";
import {stringify} from "qs";

const {Step} = Steps;

function desc(params) {
    return (
        <div style={{fontSize: 14, position: 'relative'}}>
            <div style={{marginTop: 8, marginBottom: 4}}>
                {params.name}
                <Icon type="dingding" style={{color: '#00A0E9', marginLeft: 8}}/>
            </div>
            <div style={{marginTop: 8, marginBottom: 4}}>{params.date}</div>
        </div>
    )
}

function extra(param) {
    const {id, operateDate, current} = param;

    return (
        <div>
            <div style={{fontSize: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500, marginBottom: 20}}>
                订单
            </div>
            <Row style={{marginBottom: 16}}>
                <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                    <span style={{color: 'rgba(0, 0, 0, 0.85)'}}>订单 ID：</span>
                    {id}
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <span style={{color: 'rgba(0, 0, 0, 0.85)'}}>创建时间：</span>
                    {operateDate}
                </Col>
            </Row>
            <Steps progressDot current={current}>
                <Step title="选择车辆"/>
                <Step title="提交订单" description={current === "1" ? desc({name: "订单提交完毕", date: operateDate}) : null}/>
                <Step title="订单支付" description={current === "2" ? desc({name: "订单支付完毕", date: operateDate}) : null}/>
                <Step title="预定成功" description={current === "3" ? desc({name: "订单预订完成", date: operateDate}) : null}/>
            </Steps>
        </div>
    )
}

function actions(params) {
    const {id, needPay} = params;
    return (
        <div>
            {needPay
                ? <Button type="primary" onClick={() => {router.push({pathname:"/pay/OrderPay",search:stringify({id:id})})}}>
                    支付订单
                </Button>
                : null
            }
            <Button type={needPay ? "" : "primary"} onClick={()=>{
                router.push({
                    pathname:"/order/OrderDetail",search:stringify({id:id})
                })
            }}>查看订单</Button>
        </div>
    )
}

class OrderResult extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const {type, description} = this.props.location.query;
        return (
            <Result className={styles.main}
                    type={type}
                    title="操作成功"
                    description={description}
                    extra={extra(this.props.location.query)}
                    actions={actions(this.props.location.query)}
                    style={{width: '100%'}}
            />)
    }
}

export default OrderResult;

