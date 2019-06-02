import React, {PureComponent, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import Link from 'umi/link';
import {
    Row, Col, Card, List, Avatar, Button, Icon,
    Dropdown, Form, Modal, Radio, Select, Input,
    Steps, DatePicker, Badge, Divider, Menu, message
} from 'antd';
import {Radar} from '@/components/Charts';
import EditableLinkGroup from '@/components/EditableLinkGroup';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CarModel from "@/components/CarModal/CarModal";

import styles from './Workplace.less';
import StandardTable from "@/components/StandardTable/index";
import router from "umi/router";

const FormItem = Form.Item;
const {TextArea} = Input;
const {Step} = Steps;
const {Option} = Select;
const RadioGroup = Radio.Group;
const links = [
    {
        title: '操作一',
        href: '',
    },
    {
        title: '操作二',
        href: '',
    },
    {
        title: '操作三',
        href: '',
    },
    {
        title: '操作四',
        href: '',
    },
    {
        title: '操作五',
        href: '',
    },
    {
        title: '操作六',
        href: '',
    },
];
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
const CreateForm = Form.create()(props => {
    const {modalVisible, form, handleAdd, handleModalVisible} = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            handleAdd(fieldsValue);
        });
    };
    return (
        <Modal
            destroyOnClose
            title="添加车辆"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="描述">
                {form.getFieldDecorator('desc', {
                    rules: [{required: true, message: '请输入至少2个字符！', min: 2}],
                })(<Input placeholder="请输入"/>)}
            </FormItem>
        </Modal>
    );
});


@Form.create()
class UpdateForm extends PureComponent {
    static defaultProps = {
        handleUpdate: () => {
        },
        handleUpdateModalVisible: () => {
        },
        values: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            formVals: {

            },
            currentStep: 0,
        };

        this.formLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 13},
        };
    }

    handleNext = currentStep => {
        const {form, handleUpdate,handleUpdateModalVisible} = this.props;
        const {formVals: oldValue} = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const formVals = {...oldValue, ...fieldsValue};
            this.setState(
                {
                    formVals,
                },
                () => {
                    if (currentStep < 2) {
                        this.forward();
                    } else {
                        handleUpdate(formVals);
                        handleUpdateModalVisible(false,formVals);
                    }
                }
            );
        });
    };

    backward = () => {
        const {currentStep} = this.state;
        this.setState({
            currentStep: currentStep - 1,
        });
    };

    forward = () => {
        const {currentStep} = this.state;
        this.setState({
            currentStep: currentStep + 1,
        });
    };

    renderContent = (currentStep, formVals) => {
        const {form} = this.props;
        const config = {
            rules: [{type: 'object', required: true, message: 'Please select time!'}],
        };
        if (currentStep === 1) {
            return [
                <FormItem key="bookAble" {...this.formLayout} label="是否可用">
                    {form.getFieldDecorator('bookAble', {
                        rules: [{required: true, message: '请选择！'}],
                    })(
                        <RadioGroup>
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </RadioGroup>
                    )}
                </FormItem>,
                <FormItem key="manufactureDate" {...this.formLayout} label="制造时间">
                    {form.getFieldDecorator('manufactureDate', config)(<DatePicker format="YYYY-MM-DD HH:mm:ss"/>)}
                </FormItem>,
                <FormItem key="defaultRentPrice" {...this.formLayout} label="默认租车价格">
                    {form.getFieldDecorator('defaultRentPrice', {
                        rules: [{
                            required: true,
                            message: '请输入价格！',
                        }],
                    })(<Input placeholder="请输入"/>)}
                </FormItem>,
                <FormItem key="typeId" {...this.formLayout} label="类型编号">
                    {form.getFieldDecorator('typeId', {
                        rules: [{required: true, message: '请输入类型编号！'}],
                    })(<Input placeholder="请输入"/>)}
                </FormItem>,
                <FormItem key="brandName" {...this.formLayout} label="车辆品牌">
                    {form.getFieldDecorator('brandName', {
                        rules: [{required: true, message: '请输入车辆品牌！'}],
                    })(<Input placeholder="请输入"/>)}
                </FormItem>,
                <FormItem key="serviceTypeId" {...this.formLayout} label="服务类型编号">
                    {form.getFieldDecorator('serviceTypeId', {})(
                        <Select style={{width: '100%'}}>
                            <Option value="1">短租</Option>
                            <Option value="2">长租</Option>
                        </Select>
                    )}
                </FormItem>
            ];
        }
        if (currentStep === 2) {
            return [
                <FormItem key="buyDate" {...this.formLayout} label="入库时间">
                    {form.getFieldDecorator('buyDate', {
                        rules: [{required: true, message: '请选择时间！'}],
                    })(
                        <DatePicker
                            style={{width: '100%'}}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="选择时间"
                        />
                    )}
                </FormItem>
            ];
        }
        return [
            <FormItem key="storeId" {...this.formLayout} label="归属门店">
                {form.getFieldDecorator('storeId', {})(
                    <Select style={{width: '100%'}}>
                        {
                            formVals.map(item => {
                                return (
                                    <Option value={item.value}>{item.label}</Option>
                                )
                            })
                        }
                    </Select>
                )}
            </FormItem>,
            <FormItem key="typeName" {...this.formLayout} label="类型名称">
                {form.getFieldDecorator('typeName', {
                    rules: [{required: true, message: '请输入类型名称！'}],
                })(<Input placeholder="请输入"/>)}
            </FormItem>,
            <FormItem key="description" {...this.formLayout} label="车辆描述">
                {form.getFieldDecorator('description', {
                    rules: [{required: false, message: '请输入至少十个字符的规则描述！', min: 10}],
                })(<TextArea rows={4} placeholder="请输入至少十个字符"/>)}
            </FormItem>,
        ];
    };

    renderFooter = currentStep => {
        const {handleUpdateModalVisible, values} = this.props;
        if (currentStep === 1) {
            return [
                <Button key="back" style={{float: 'left'}} onClick={this.backward}>
                    上一步
                </Button>,
                <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
                    取消
                </Button>,
                <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
                    下一步
                </Button>,
            ];
        }
        if (currentStep === 2) {
            return [
                <Button key="back" style={{float: 'left'}} onClick={this.backward}>
                    上一步
                </Button>,
                <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
                    完成
                </Button>,
            ];
        }
        return [
            <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
                取消
            </Button>,
            <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
                下一步
            </Button>,
        ];
    };

    render() {
        const {updateModalVisible, handleUpdateModalVisible, values} = this.props;
        const {currentStep, formVals} = this.state;

        return (
            <Modal
                width={640}
                bodyStyle={{padding: '32px 40px 48px'}}
                destroyOnClose
                title="车辆添加"
                visible={updateModalVisible}
                footer={this.renderFooter(currentStep)}
                onCancel={() => handleUpdateModalVisible(false, values)}
                afterClose={() => handleUpdateModalVisible()}
            >
                <Steps style={{marginBottom: 28}} size="small" current={currentStep}>
                    <Step title="基本信息"/>
                    <Step title="车辆信息"/>
                    <Step title="车辆额外信息"/>
                </Steps>
                {this.renderContent(currentStep, values)}
            </Modal>
        );
    }
}


@connect(({user, project, activities, chart, assets, loading}) => ({
    currentUser: user.currentUser,
    currentUserMI: user.currentUserMI,
    project,
    activities,
    chart,
    assets,
    currentUserLoading: loading.effects['user/fetchCurrent'],
    projectLoading: loading.effects['project/fetchNotice'],
    activitiesLoading: loading.effects['activities/fetchList'],
    loading: loading.models.user,
}))
@Form.create()
class Workplace extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        stepFormValues: {},
        visible:false
    };
    static defaultProps = {
        handleUpdate: () => {
        },
        handleUpdateModalVisible: () => {
        },
        values: {},
    };
    columns = [
        {
            title: '车辆名称',
            dataIndex: 'typeName',
        },
        {
            title: '描述',
            dataIndex: 'description',
        },
        {
            title: '编号',
            dataIndex: 'id',
            sorter: true,
            // mark to display a total number
            needTotal: true,
        },
        {
            title: '状态',
            dataIndex: 'rentAble',
            filters: [
                {
                    text: status[0],
                    value: 0,
                },
                {
                    text: status[1],
                    value: 1,
                },
                {
                    text: status[2],
                    value: 2,
                },
                {
                    text: status[3],
                    value: 3,
                },
            ],
            render(val) {
                return <Badge status={statusMap[val ? 1 : 0]} text={status[val ? 1 : 0]}/>;
            },
        },
        {
            title: '归档时间',
            dataIndex: 'buyDate',
            sorter: true,
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => this.handleUpdateModalVisible(true, record)}>详情</a>
                </Fragment>
            ),
        },

    ];

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'activities/fetchList',
        });
        dispatch({
            type: 'user/fetchUserManagementInfo'
        })
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'chart/clear',
        });
    }

    renderActivities() {
        const {
            activities: {list},
        } = this.props;
        return list.map(item => {
            const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
                if (item[key]) {
                    return (
                        <a href={item[key].link} key={item[key].name}>
                            {item[key].name}
                        </a>
                    );
                }
                return key;
            });
            return (
                <List.Item key={item.id}>
                    <List.Item.Meta
                        avatar={<Avatar src={item.user.avatar}/>}
                        title={
                            <span>
                <a href={"/"} className={styles.username}>{item.user.name}</a>
                                &nbsp;
                                <span className={styles.event}>{events}</span>
              </span>
                        }
                        description={
                            <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
                        }
                    />
                </List.Item>
            );
        });
    }

    renderSimpleForm() {
        const {form: {getFieldDecorator}, currentUserMI} = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row type="flex" gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="关键词">
                            {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status')(
                                <Select placeholder="请选择" style={{width: '100%'}}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                          <Button type="primary" htmlType="submit">
                            查询
                          </Button>
                          <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                            重置
                          </Button>
                        </span>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="门店">
                            {getFieldDecorator('store')(
                                <Select placeholder="请选择" defaultValue={0} style={{width: '100%'}}>
                                    {
                                        currentUserMI.map(item => {
                                            return (
                                                <Option value={item.value}>{item.label}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }

    //OP method

    handleSearch = e => {
        e.preventDefault();

        const {dispatch, form} = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
                ...fieldsValue,
                updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'assets/fetchStoreCarList',
                payload: values,
            });
        });
    };

    handleFormReset = () => {
        const {form, dispatch} = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'rule/fetch',
            payload: {},
        });
    };
    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const {dispatch} = this.props;
        const {formValues} = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = {...obj};
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'rule/fetch',
            payload: params,
        });
    };

    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };

    handleUpdateModalVisible = (flag, item) => {
        if (item) {
            this.props.dispatch({
                type: "index/fetchCarDetail",
                payload: item.id
            });
            this.setState({
                modalVisible: true,
                current: item,
                done: false
            });
        }
        // this.setState({
        //     modalVisible: !!flag,
        //     stepFormValues: record || {},
        // });
    };

    handleCancel = () => {
        this.setState({
            modalVisible: false,
        });
    };

    handleModalVisible = flag => {
        this.setState({
            updateModalVisible: !!flag,
        });
    };
    handleCreate = (vals) => {
        this.props.dispatch({
            type:"assets/createCar",
            payload:vals
        });
    };

    //remove
    handleMenuClick=({key})=>{
        if (key === 'remove' || key === "online") {
            const {selectedRows} = this.state;
            if (selectedRows.length > 0) {
                let pay = [];
                selectedRows.map((item)=>{
                    pay.push(item.id);
                });
                this.props.dispatch({
                    type:"assets/removeCars",
                    payload:{"ids":pay.toString(),"op":key}
                })
            }
            return;
        }
    };

    render() {
        const {
            currentUser,
            currentUserLoading,
            project: {notice},
            projectLoading,
            activitiesLoading,
            chart: {radarData},
            currentUserMI
        } = this.props;
        const {selectedRows, modalVisible, updateModalVisible, stepFormValues} = this.state;

        const {loading, assets} = this.props;
        const {list, pagination} = assets;
        let data = {list: list, pagination: pagination};

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleUpdateModalVisible,
            handleCancel:this.handleCancel
        };
        const updateMethods = {
            handleUpdateModalVisible: this.handleModalVisible,
            handleUpdate: this.handleCreate,
        };

        const pageHeaderContent =
            currentUser && Object.keys(currentUser).length ? (
                <div className={styles.pageHeaderContent}>
                    <div className={styles.avatar}>
                        <Avatar size="large" src={currentUser.avatar}/>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.contentTitle}>
                            早安，
                            {currentUser.name}
                            ，祝你开心每一天！
                        </div>
                    </div>
                </div>
            ) : null;

        const extraContent = (
            <div className={styles.extraContent}>
                <div className={styles.statItem}>
                    <p>总订单数</p>
                    <p>56</p>
                </div>
                <div className={styles.statItem}>
                    <p>站内排名</p>
                    <p>
                        8<span> / 24</span>
                    </p>
                </div>
                <div className={styles.statItem}>
                    <p>系统访问次数</p>
                    <p>2,223</p>
                </div>
            </div>
        );
        const menu = (
            <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                <Menu.Item key="remove">离线</Menu.Item>
                <Menu.Item key="online">运行</Menu.Item>
            </Menu>
        );
        return (
            <div className={styles.main}>
                <PageHeaderWrapper
                    loading={currentUserLoading}
                    content={pageHeaderContent}
                    extraContent={extraContent}
                >
                    <Row gutter={24}>
                        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                            <div title="查询表格">
                                <Card bordered={false}>
                                    <div className={styles.tableList}>
                                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                                        <div className={styles.tableListOperator}>
                                            <Button icon="plus" type="primary"
                                                    onClick={() => this.handleModalVisible(true)}>
                                                新建
                                            </Button>
                                            {selectedRows.length > 0 && (
                                                <span>
                                                    <Dropdown overlay={menu}>
                                                    <Button>
                                                      更多操作 <Icon type="down"/>
                                                    </Button>
                                                    </Dropdown>
                                                </span>
                                            )}
                                        </div>
                                        <StandardTable
                                            selectedRows={selectedRows}
                                            loading={loading}
                                            data={data}
                                            columns={this.columns}
                                            onSelectRow={this.handleSelectRows}
                                            onChange={this.handleStandardTableChange}
                                        />
                                    </div>
                                </Card>
                                <CarModel {...parentMethods} modalVisible={modalVisible}/>
                                <UpdateForm
                                    {...updateMethods}
                                    updateModalVisible={updateModalVisible}
                                    values={currentUserMI}
                                />
                            </div>
                            <Card
                                bodyStyle={{padding: 0}}
                                bordered={false}
                                className={styles.activeCard}
                                title="动态"
                                loading={activitiesLoading}
                            >
                                <List loading={activitiesLoading} size="large">
                                    <div className={styles.activitiesList}>{this.renderActivities()}</div>
                                </List>
                            </Card>
                        </Col>
                        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                            <Card
                                style={{marginBottom: 24}}
                                title="快速开始 / 便捷导航"
                                bordered={false}
                                bodyStyle={{padding: 0}}
                            >
                                <EditableLinkGroup onAdd={() => {
                                }} links={links} linkElement={Link}/>
                            </Card>
                            <Card
                                style={{marginBottom: 24}}
                                bordered={false}
                                title="XX 指数"
                                loading={radarData.length === 0}
                            >
                                <div className={styles.chart}>
                                    <Radar hasLegend height={343} data={radarData}/>
                                </div>
                            </Card>
                            <Card
                                bodyStyle={{paddingTop: 12, paddingBottom: 12}}
                                bordered={false}
                                title="团队"
                                loading={projectLoading}
                            >
                                <div className={styles.members}>
                                    <Row gutter={48}>
                                        {notice.map(item => (
                                            <Col span={12} key={`members-item-${item.id}`}>
                                                <Link to={item.href}>
                                                    <Avatar src={item.logo} size="small"/>
                                                    <span className={styles.member}>{item.member}</span>
                                                </Link>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </PageHeaderWrapper>
            </div>
        );
    }
}

export default Workplace;
