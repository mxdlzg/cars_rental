import React,{PureComponent,Component, Fragment} from 'react'
import styles from './OrderDetail.less'
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import PageHeader from '@/components/PageHeader';
import {
    Button,
    Menu,
    Dropdown,
    Icon,
    Row,
    Col,
    Steps,
    Card,
    Popover,
    Badge,
    Divider,
} from 'antd';


const {Step} = Steps;
const {Description} = DescriptionList;
const ButtonGroup = Button.Group;

const action = (
    <Fragment>
        <ButtonGroup>
            <Button>操作</Button>
            <Button>操作</Button>
            <Button>操作</Button>
        </ButtonGroup>
        <Button type="primary">主操作</Button>
    </Fragment>
);

function extra(param) {
    return(
        <Row>
            <Col xs={24} sm={12}>
                <div className={styles.textSecondary}>状态</div>
                <div className={param.isPaid?styles.headingSuccess:styles.heading}>{param.payStatus}</div>
            </Col>
            <Col xs={24} sm={12}>
                <div className={styles.textSecondary}>订单金额</div>
                <div className={styles.heading}>{param.totalPrice}</div>
            </Col>
        </Row>
    )
}

function description(params) {
    return(
        <DescriptionList className={styles.headerList} size="small" col="2">
            <Description term="创建人">{params.belongUser}</Description>
            <Description term="预订产品">{params.description}</Description>
            <Description term="创建时间">{params.createdDate}</Description>
            <Description term="关联单据">
                <a href={"/"}></a>
            </Description>
            <Description term="租车日期">{params.startDate+" ~ "+params.endDate}</Description>
            <Description term="备注">{params.marker}</Description>
        </DescriptionList>
    )
}

function desc(params) {
    return(
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
        key: 'detail',
        tab: '概览',
    },
    {
        key: 'rule',
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


class OrderDetail extends PureComponent {
    state = {
        operationkey: 'tab1',
        stepDirection: 'horizontal',
        //test data
        current:2,
        operateDate:"2016-12-12 12:32:00"
    };



    render() {
        const {stepDirection} = this.state;
        const {current,operateDate} = this.state;
        const {id} = this.props.location.query;

        return (
            <div>
                <PageHeader
                    title={"单号："+id}
                    logo={
                        <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"/>
                    }
                    action={action}
                    content={description({belongUser:"mxdlzg@163.com",description:"大众朗逸",createdDate:"2017-07-07 00:00:00",startDate:"2017-07-07 00:00:00",endDate:"2017-08-08 00:00:00",marker:"请于两个工作日内确认"})}
                    extraContent={extra({isPaid:true,payStatus:"已支付",totalPrice:"￥ 500.10"})}
                    tabList={tabList}
                >
                </PageHeader>
                <div className={styles.main}>
                    <Card title="流程进度" style={{marginBottom: 24}} bordered={false}>
                        <Steps direction={stepDirection} progressDot={customDot} current={current}>
                            <Step title="创建订单" description={current===0?desc({name: "订单创建完毕", date: operateDate}):null}/>
                            <Step title="订单提交" description={current===1?desc({name: "订单提交完毕", date: operateDate}):null}/>
                            <Step title="订单支付" description={current===2?desc({name: "订单支付完毕", date: operateDate}):null}/>
                            <Step title="预订完成" description={current===3?desc({name: "订单预订完成", date: operateDate}):null}/>
                        </Steps>
                    </Card>
                    <Card title="用户信息" style={{marginBottom: 24}} bordered={false}>
                        <DescriptionList style={{marginBottom: 24}}>
                            <Description term="用户姓名">付小小</Description>
                            <Description term="会员卡号">32943898021309809423</Description>
                            <Description term="身份证">332194428****034921</Description>
                            <Description term="联系方式">18112***678</Description>
                            <Description term="联系地址">
                                曲丽丽 18100000000 浙江省杭州市西湖区黄姑山路工专路交叉路口
                            </Description>
                        </DescriptionList>
                        <Card type="inner" title="出发及到达地">
                            <DescriptionList size="small" style={{marginBottom: 16}} title="地点">
                                <Description term="门店">林东东</Description>
                                <Description term="编号">1234567</Description>
                                <Description term="地址">XX公司 - YY部</Description>
                                <Description term="时间">2017-08-08</Description>
                                <Description term="描述">
                                    这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
                                </Description>
                            </DescriptionList>
                            <Divider style={{margin: '16px 0'}}/>
                            <DescriptionList size="small" style={{marginBottom: 16}} title="地点">
                                <Description term="门店">林东东</Description>
                                <Description term="编号">1234567</Description>
                                <Description term="地址">XX公司 - YY部</Description>
                                <Description term="时间">2017-08-08</Description>
                                <Description term="描述">
                                    这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
                                </Description>
                            </DescriptionList>
                        </Card>
                    </Card>
                    <Card title="备注" style={{marginBottom: 24}} bordered={false}>
                        <div className={styles.noData}>
                            <Icon type="frown-o"/>
                            暂无数据
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}

export default OrderDetail;