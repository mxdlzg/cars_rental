import React, {Fragment, PureComponent} from 'react'
import styles from './OrderDetail.less'
import DescriptionList from '@/components/DescriptionList';
import PageHeader from '@/components/PageHeader';
import {Badge, Button, Card, Col, Divider, Icon, Popover, Row, Steps, Tabs, Tag, Skeleton, Empty} from 'antd';
import {connect} from "dva/index";
import router from "umi/router";
import {stringify} from "qs";

const TabPane = Tabs.TabPane;

const {Step} = Steps;
const {Description} = DescriptionList;
const ButtonGroup = Button.Group;

function action(params) {
    return (
        <Fragment>
            <ButtonGroup>
                {params.stateId === 1 || params.stateId === 2 ? <Button onClick={() => {
                    params.dispatch({
                        type: "order/cancelOrder",
                        payload: {id: params.id},
                    })
                }}>取消订单
                </Button> : null}
            </ButtonGroup>
            {params.stateId === 2 ? <Button type="primary" onClick={() => {
                params.dispatch({
                    type: "order/takeCar",
                    payload: {id: params.id},
                })
            }}>取车
            </Button> : null}
            {params.stateId === 1 ? <Button type="primary" onClick={() => {
                router.push({
                    pathname: '/pay/OrderPay',
                    search: stringify({id: params.id})
                })
            }}>支付订单
            </Button> : null}
            {params.stateId === 3? <Button type="primary" onClick={() => {
                params.dispatch({
                    type: "order/checkout",
                    payload: {id: params.id},
                })
            }}>还车结算</Button> : null}
            {params.stateId === 4? <Button type="primary">订单已完成</Button> : null}
        </Fragment>
    )
}

function extra(param) {
    return (
        <Row>
            <Col xs={24} sm={12}>
                <div className={styles.textSecondary}>订单状态</div>
                <div className={param.orderTypeId===2 ? styles.headingWarn : styles.headingSuccess}>{param.orderType}</div>
            </Col>
            <Col xs={24} sm={12}>
                <div className={styles.textSecondary}>订单金额</div>
                <div className={styles.headingPrice}>{param.totalPrice}</div>
            </Col>
            <Col xs={24} sm={12}>
                <div className={styles.textSecondary}>进度状态</div>
                <div className={param.isPaid ? styles.headingSuccess : styles.heading}>{param.payStatus}</div>
            </Col>
        </Row>
    )
}

function description(params) {
    return (
        <DescriptionList className={styles.headerList} size="small" col="2">
            <Description term="创建人">{params.belongUser}</Description>
            <Description term="预订产品">{params.description}</Description>
            <Description term="创建时间">{params.createdDate}</Description>
            <Description term="关联单据">
                {/*<a href={"/"}></a>*/}
            </Description>
            <Description term="租车日期">{params.startDate + " ~ " + params.endDate}</Description>
            <Description term="备注">{params.marker}</Description>
        </DescriptionList>
    )
}

function desc(params) {
    return (
        <div className={styles.stepDescription}>
            <Fragment>
                {params.name}
                <Icon type="dingding-o" style={{color: '#00A0E9', marginLeft: 8}}/>
            </Fragment>
            <div>{params.date}</div>
        </div>
    )
}

const tabList = [
    {
        key: 'overview',
        tab: '概览',
    },
    {
        key: 'detail',
        tab: '详情',
    },
];

const popoverContent = (
    <div style={{width: 160}}>
        吴加号
        <span className={styles.textSecondary} style={{float: 'right'}}>
      <Badge status="default" text={<span style={{color: 'rgba(0, 0, 0, 0.45)'}}>未响应</span>}/>
    </span>
        <div className={styles.textSecondary} style={{marginTop: 4}}>
            耗时：2小时25分钟
        </div>
    </div>
);

const customDot = (dot, {status}) =>
    status === 'process' ? (
        <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
            {dot}
        </Popover>
    ) : (
        dot
    );

@connect(({order, loading, user}) => ({
    orderLoading: loading.effects['order/orderDetail'],
    ...order,
    ...user,
}))
class OrderDetail extends PureComponent {
    state = {
        operationkey: 'tab1',
        stepDirection: 'horizontal',
        tabKey: "overview",
        //test data
        current: 2,
        operateDate: "2016-12-12 12:32:00",
        userInfo: {
            name: "付小小",
            idCard: "332194428****034921",
            phoneNum: "18112***678",
            eMail: "mxdlzg@163.com",
        },
        startLocation: {
            name: "海泉路总店",
            id: 212324555,
            date: "2016-12-12 12:32:00",
            location: "上海市奉贤区海泉路",
            description: "这是一段关于海泉路门店的描述信息"
        },
        endLocation: {
            name: "海泉路总店",
            id: 212324555,
            date: "2016-12-12 12:32:00",
            location: "上海市奉贤区海泉路",
            description: "这是一段关于海泉路门店的描述信息"
        }
    };

    componentDidMount() {
        this.props.dispatch({
            type: "order/orderDetail",
            payload: this.props.location.query,
        })
    }

    onTabChange = (value) => {
        this.setState({
            tabKey: value
        })
    };


    render() {
        const {stepDirection, tabKey} = this.state;
        //const {current, operateDate, userInfo, startLocation, endLocation} = this.state;
        const {id} = this.props.location.query;
        const {orderLoading, currentUser} = this.props;
        const {current, operateDate, userInfo, startLocation, endLocation, order} = this.props;


        return (
            <div>
                {
                    (userInfo !== undefined && userInfo !== null) ?
                        <div>
                            <PageHeader
                                title={"单号：" + id}
                                logo={
                                    <img alt=""
                                         src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"/>
                                }
                                action={order.orderTypeId===2?<h2>订单已取消</h2>:action({"dispatch":this.props.dispatch,"id": id, "stateId": order.currentStateId})}
                                content={description({
                                    belongUser: currentUser.name,
                                    description: order.typeName,
                                    createdDate: order.createdDate,
                                    startDate: order.startDate,
                                    endDate: order.endDate,
                                    marker: "请于两个工作日内确认"
                                })}
                                extraContent={extra({
                                    isPaid: order.paid,
                                    payStatus: order.paid ? "已支付" : "等待支付",
                                    orderType:order.orderTypeName,
                                    orderTypeId:order.orderTypeId,
                                    totalPrice: "￥" + order.totalPrice
                                })}
                                tabList={tabList}
                                onTabChange={this.onTabChange}
                            >
                            </PageHeader>
                            <Tabs activeKey={tabKey} renderTabBar={() => {
                                return (<div/>)
                            }}>
                                <TabPane tab="Tab 1" key="overview">
                                    {orderLoading || orderLoading === undefined
                                        ? <Skeleton active paragraph={{rows: 5}}/>
                                        : <div className={styles.main}>
                                            <Card title="流程进度" style={{marginBottom: 24}} bordered={false}>
                                                <Steps direction={stepDirection} progressDot={customDot}
                                                       current={current}>
                                                    <Step title="创建订单" description={current === 0 ? desc({
                                                        name: "订单创建完毕",
                                                        date: operateDate
                                                    }) : null}/>
                                                    <Step title="订单提交" description={current === 1 ? desc({
                                                        name: "订单提交完毕",
                                                        date: operateDate
                                                    }) : null}/>
                                                    <Step title="订单支付" description={current === 2 ? desc({
                                                        name: "订单支付完毕",
                                                        date: operateDate
                                                    }) : null}/>
                                                    <Step title="预订完成" description={current === 3 ? desc({
                                                        name: "订单预订完成",
                                                        date: operateDate
                                                    }) : null}/>
                                                </Steps>
                                            </Card>
                                            <Card title="用户信息" style={{marginBottom: 24}} bordered={false}>
                                                {
                                                    userInfo.map(item => {
                                                        return (
                                                            <DescriptionList style={{marginBottom: 24}}
                                                                             title={<Tag color="#f50">驾驶人信息</Tag>}>
                                                                <div style={{float: 'left', marginLeft: '2em'}}>
                                                                    <Description term="用户姓名">{item.name}</Description>
                                                                    <Description term="身份证">{item.cardId}</Description>
                                                                    <Description
                                                                        term="联系方式">{item.phoneNum}</Description>
                                                                    <Description term="联系邮箱">{item.email}</Description>
                                                                </div>
                                                            </DescriptionList>
                                                        )
                                                    })
                                                }
                                                <Card type="inner" title="出发及到达地">

                                                    <DescriptionList size="" style={{marginBottom: 16}}
                                                                     title={<Tag color="blue">出发地点</Tag>}>
                                                        <Description term="门店">{startLocation.name}</Description>
                                                        <Description term="编号">{startLocation.id}</Description>
                                                        <Description term="地址">{startLocation.location}</Description>
                                                        <Description term="时间">{startLocation.date}</Description>
                                                        <Description term="描述">{startLocation.description}</Description>
                                                    </DescriptionList>
                                                    <Divider style={{margin: '16px 0'}}/>
                                                    <DescriptionList size="" style={{marginBottom: 16}}
                                                                     title={<Tag color="green">达到地点</Tag>}>
                                                        <Description term="门店">{endLocation.name}</Description>
                                                        <Description term="编号">{endLocation.id}</Description>
                                                        <Description term="地址">{endLocation.location}</Description>
                                                        <Description term="时间">{endLocation.date}</Description>
                                                        <Description term="描述">{endLocation.description}</Description>
                                                    </DescriptionList>
                                                </Card>
                                            </Card>
                                        </div>}
                                </TabPane>
                                <TabPane tab="Tab 2" key="detail">
                                    <div className={styles.main}>
                                        <Card title="优惠使用情况" style={{marginBottom: 24}} bordered={false}>
                                            <div className={styles.noData}>
                                                <Icon type="frown-o"/>
                                                暂无数据
                                            </div>
                                        </Card>
                                        <Card title="备注" style={{marginBottom: 24}} bordered={false}>
                                            <div className={styles.noData}>
                                                <Icon type="frown-o"/>
                                                暂无数据
                                            </div>
                                        </Card>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                        :
                        <Empty
                            image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                            imageStyle={{
                                height: 300,
                            }}
                            description={<span>查询的订单ID无效，无法查询到订单信息</span>}
                        >
                            <Button type="primary" onClick={() => {
                                router.goBack()
                            }}>返回</Button>
                        </Empty>
                }
            </div>

        )
    }
}

export default OrderDetail;