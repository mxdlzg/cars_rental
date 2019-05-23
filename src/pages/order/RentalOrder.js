import React from 'react'
import styles from './RentalOrder.css'
import {
    Steps, Button, Card, Divider, Icon, Input, message,
    Form, Select, Table, Checkbox, Skeleton, Spin
} from 'antd';
import {connect} from "dva/index";

const Step = Steps.Step;
const Option = Select.Option;
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
// const formItemLayout = {
//     labelCol: {
//         xs: {span: 4},
//         sm: {span: 4},
//     },
//     wrapperCol: {
//         xs: {span: 20},
//         sm: {span: 20},
//     },
// };
const formItemLayout1 = {
    labelCol: {span: 3},
    wrapperCol: {span: 6},
};

const checkId = (rule, value, callback) => {
    console.log(callback);
    if (value) {
        let idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if (!idcardReg.test(value)) {
            callback([new Error('请输入正确的身份证号码!')]);
        }
    }
    callback();

};

@connect(({order, rental, loading}) => ({
    orderDetailLoading: loading.effects['order/initPageInfo'],
    dates: rental.dates,
    ...order,
}))
class RentalOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            priceLoading: false,
            checkedInvoiceNone: false,
            checkedInvoice: true,
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.dispatch({
            type: 'order/initPageInfo',
            payload: {...this.props.location.query}
        })
    }

    next() {
        const current = this.state.current + 1;
        this.setState({current});
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({current});
    }

    onSubmit = e => {
        e.preventDefault();
        const {form, dispatch} = this.props;
        const {checkedInvoiceNone} = this.state;

        form.validateFields({force: false}, (err, values) => {
            if (!err) {
                const {prefix} = this.state;
                dispatch({
                    type: 'order/submit',
                    payload: {
                        ...values,
                        invoiceType: checkedInvoiceNone ? 1 : 2,
                        prefix,
                        ...this.props.location.query,
                    },
                });
            } else {
                message.error("请输入正确的驾驶人信息！")
            }
        });
    };

    onInvoiceChange(value) {
        if (value === 1) {
            this.setState({
                checkedInvoiceNone: true,
                checkedInvoice: false,   //无发票
            })
        } else {
            this.setState({
                checkedInvoiceNone: false,
                checkedInvoice: true,   //无发票
            })
        }
    }


    render() {
        const {current, priceLoading, checkedInvoiceNone, checkedInvoice} = this.state;
        const {getFieldDecorator} = this.props.form;
        const {orderDetailLoading} = this.props;
        const {carInfoRes, orderPriceDetailRes} = this.props;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{width: 70}}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
        let goodsData = orderPriceDetailRes ? orderPriceDetailRes.data.detail : [];
        const goodsColumns = [
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                align: 'right',
            },
            {
                title: '数量（件）',
                dataIndex: 'num',
                key: 'num',
                align: 'right',
                render: (text, row, index) => {
                    if (index < 4) {
                        return text;
                    }
                    return <span style={{fontWeight: 600}}>{text}</span>;
                },
            },
            {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                align: 'right',
                render: (text, row, index) => {
                    if (index < 4) {
                        return text;
                    }
                    return <span style={{fontWeight: 600}}>{text}</span>;
                },
            },
        ];
        return (
            <Form className={styles.main} {...formItemLayout1} onSubmit={this.onSubmit}>
                <Steps className={styles.steps} current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title}/>)}
                </Steps>
                <div className="steps-content">
                    <Card title={"车辆基本信息"} className={styles.card}>
                        {
                            orderDetailLoading || orderDetailLoading === undefined || carInfoRes === undefined
                                ? <Skeleton active paragraph={{rows: 5}}/>
                                : <div>
                                    <div className={styles.carDetailLeft}>
                                        <img alt={"车辆"} src={carInfoRes.imageSrc} style={{width: '18em', height: '10em'}}/>
                                        <h2>{carInfoRes.typeName}</h2>
                                        <h4>{carInfoRes.label}</h4><br/>
                                        <h4>{carInfoRes.description}</h4>
                                    </div>
                                    <Divider style={{float: 'left', height: '230px', marginRight: '10px'}}
                                             type="vertical"/>
                                    <div className={styles.carDetailLeft}>
                                        <div>
                                            <Icon type="login" className={styles.carDetailIcon}/>
                                            <h3>取车时间</h3>
                                        </div>
                                        <div>
                                            <Icon type="clock-circle" className={styles.carDetailIconSml}/>
                                            <h4>{orderPriceDetailRes.data.fetchCarDate}</h4>
                                        </div>
                                        <div>
                                            <Icon type="environment" className={styles.carDetailIconSml}/>
                                            <h4>{orderPriceDetailRes.data.fetchLocation}</h4>
                                        </div>
                                    </div>
                                    <Divider style={{float: 'left', height: '230px', marginRight: '10px'}}
                                             type="vertical"/>
                                    <div className={styles.carDetailLeft}>
                                        <div>
                                            <Icon type="login" className={styles.carDetailIcon}/>
                                            <h3>还车时间</h3>
                                        </div>
                                        <div>
                                            <Icon type="clock-circle" className={styles.carDetailIconSml}/>
                                            <h4>{orderPriceDetailRes.data.returnCarDate}</h4>
                                        </div>
                                        <div>
                                            <Icon type="environment" className={styles.carDetailIconSml}/>
                                            <h4>{orderPriceDetailRes.data.returnLocation}</h4>
                                        </div>
                                    </div>
                                </div>
                        }
                    </Card>
                    <Card title={"驾驶员信息"} className={styles.card}>
                        <Form.Item key="name" label="姓名">
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: '请输入姓名',
                                }],
                            })(
                                <Input placeholder="Please input your name"/>
                            )}
                        </Form.Item>
                        <Form.Item
                            label="证件类型"
                            hasFeedback
                        >
                            <Select defaultValue="1">
                                <Option value="1">身份证</Option>
                                <Option value="2">驾驶证</Option>
                                <Option value="3">港澳台通行证</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="证件号码"
                            key='cardId'
                        >
                            {getFieldDecorator('cardId', {
                                rules: [
                                    {required: true, message: '请输入证件号码'},
                                    {validator: checkId, trigger: 'blur'}
                                ],
                                // initialValue:'000'
                            })(
                                <Input placeHolder={"Please input id card number"}/>
                            )}
                        </Form.Item>
                        <Form.Item
                            label="E-mail"
                        >
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email', message: 'The input is not valid E-mail!',
                                }, {
                                    required: true, message: 'Please input your E-mail!',
                                }],
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <Form.Item
                            label="手机号码"
                        >
                            {getFieldDecorator('phone', {
                                rules: [{required: true, message: 'Please input your phone number!'}],
                            })(
                                <Input addonBefore={prefixSelector} style={{width: '100%'}}/>
                            )}
                        </Form.Item>
                    </Card>
                    <Card title="账单明细-发票" className={styles.card}>
                        <Table
                            style={{marginBottom: 24}}
                            pagination={false}
                            loading={priceLoading}
                            dataSource={goodsData}
                            columns={goodsColumns}
                            rowKey="id"
                        />
                        <Divider orientation="left">发票</Divider>
                        <Checkbox checked={checkedInvoiceNone} className={styles.invoice}
                                  onChange={this.onInvoiceChange.bind(this, 1)}>无需发票</Checkbox>
                        <Checkbox checked={checkedInvoice} className={styles.invoice}
                                  onChange={this.onInvoiceChange.bind(this, 2)}>普通增值税发票</Checkbox>
                        <div className={styles.payRegion}>
                            <Button style={{
                                fontSize: '17px',
                                borderColor: 'red',
                                background: 'red',
                                width: '15%',
                                height: '100%',
                                float: 'right'
                            }}
                                    icon="money-collect"
                                    htmlType="submit"
                                ///onClick={this.onSubmitBtnClick}
                                    type="primary"><br/>提交订单</Button>
                            <div style={{
                                textAlign: 'center',
                                background: '#fbfbfb',
                                width: '15%',
                                height: '100%',
                                float: 'right'
                            }}>
                                <div style={{paddingTop: '2px', paddingBottom: '2px'}}>
                                    总计费用
                                    <p style={{fontSize: '30px', color: '#ff746f'}}>
                                        {
                                            orderDetailLoading || orderDetailLoading === undefined
                                                ? <Spin/>
                                                : orderPriceDetailRes.data.amount
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </Form>
        );
    }
}

export default Form.create({name: 'rental_order'})(RentalOrder);