import React, {PureComponent} from 'react'
import {connect} from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import {Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Account.less'

@connect(({loading, user, project}) => ({
    listLoading: loading.effects['list/fetch'],
    currentUser: user.currentUser,
    currentToken: user.currentToken,
    currentUserLoading: loading.effects['user/fetchCurrent'],
    project,
    projectLoading: loading.effects['project/fetchNotice'],
}))

class Account extends PureComponent {
    state = {
        newTags: [],
        inputVisible: false,
        inputValue: '',
        // listLoading: false,
        // currentUserLoading: false,
        // currentUser: 'mxdlzg',

    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'user/fetchCurrent',
        });
        dispatch({
            type: 'list/fetch',
            payload: {
                count: 8,
            },
        });
        dispatch({
            type: 'project/fetchNotice',
        });
    }

    onTabChange = key => {
        const {match} = this.props;
        switch (key) {
            case 'orders':
                router.push(`${match.url}/Orders`);
                break;
            case 'assets':
                router.push(`${match.url}/Assets`);
                break;
            case 'invoices':
                router.push(`${match.url}/Invoices`);
                break;
            default:
                break;
        }
    };

    showInput = () => {
        this.setState({inputVisible: true}, () => this.input.focus());
    };

    saveInputRef = input => {
        this.input = input;
    };

    handleInputChange = e => {
        this.setState({inputValue: e.target.value});
    };

    handleInputConfirm = () => {
        const {state} = this;
        const {inputValue} = state;
        let {newTags} = state;
        if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
            newTags = [...newTags, {key: `new-${newTags.length}`, label: inputValue}];
        }
        this.setState({
            newTags,
            inputVisible: false,
            inputValue: '',
            noTitleKey: 'orders',
        });
    };

    render() {
        const {newTags, inputVisible, inputValue} = this.state;
        const {
            listLoading,
            currentUser,
            currentUserLoading,
            project: {notice},
            projectLoading,
            children,
        } = this.props;
        const operationTabList = [
            {
                key: 'orders',
                tab: (
                    <span>
            我的订单 <span style={{fontSize: 14}}>(8)</span>
          </span>
                ),
            },
            {
                key: 'assets',
                tab: (
                    <span>
            我的资产 <span style={{fontSize: 14}}>(8)</span>
          </span>
                ),
            },
            {
                key: 'invoices',
                tab: (
                    <span>
            发票管理 <span style={{fontSize: 14}}>(8)</span>
          </span>
                ),
            },
        ];
        return (
            <GridContent>
                <Row style={{marginLeft: '10em', marginRight: '10em', marginTop: '24px'}} gutter={24}>
                    <Col lg={7}>
                        <Card bordered={false} style={{marginBottom: 24}} loading={currentUserLoading}>
                            {currentUser && Object.keys(currentUser).length ? (
                                <div>
                                    <div className={styles.avatarHolder}>
                                        <img alt={"头像"} src={currentUser.avatar}/>
                                        <div className={styles.name}>{currentUser.name}</div>
                                        <div>{currentUser.signature}</div>
                                    </div>
                                    <div className={styles.detail}>
                                        <p>
                                            <i className={styles.title}/>
                                            {currentUser.title}
                                        </p>
                                        <p>
                                            <i className={styles.group}/>
                                            {currentUser.group}
                                        </p>
                                        <p>
                                            <i className={styles.address}/>
                                            {currentUser.geographic.province.label}
                                            {currentUser.geographic.city.label}
                                        </p>
                                    </div>
                                    <Divider dashed/>
                                    <div className={styles.tags}>
                                        <div className={styles.tagsTitle}>我的订单</div>
                                        {currentUser.tags.concat(newTags).map(item => (
                                            <Tag key={item.key}>{item.label}</Tag>
                                        ))}
                                        {inputVisible && (
                                            <Input
                                                ref={this.saveInputRef}
                                                type="text"
                                                size="small"
                                                style={{width: 78}}
                                                value={inputValue}
                                                onChange={this.handleInputChange}
                                                onBlur={this.handleInputConfirm}
                                                onPressEnter={this.handleInputConfirm}
                                            />
                                        )}
                                        {!inputVisible && (
                                            <Tag
                                                onClick={this.showInput}
                                                style={{background: '#fff', borderStyle: 'dashed'}}
                                            >
                                                <Icon type="plus"/>
                                            </Tag>
                                        )}
                                    </div>
                                    <Divider style={{marginTop: 16}} dashed/>
                                    <div className={styles.team}>
                                        <div className={styles.teamTitle}>我的资产</div>
                                        <Spin spinning={projectLoading}>
                                            <Row gutter={36}>
                                                {notice.map(item => (
                                                    <Col key={item.id} lg={24} xl={12}>
                                                        <Link to={item.href}>
                                                            <Avatar size="small" src={item.logo}/>
                                                            {item.member}
                                                        </Link>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Spin>
                                    </div>
                                    <Divider style={{marginTop: 16}} dashed/>
                                    <div className={styles.team}>
                                        <div className={styles.teamTitle}>发票管理</div>
                                        <Spin spinning={projectLoading}>
                                            <Row gutter={36}>
                                                {notice.map(item => (
                                                    <Col key={item.id} lg={24} xl={12}>
                                                        <Link to={item.href}>
                                                            <Avatar size="small" src={item.logo}/>
                                                            {item.member}
                                                        </Link>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Spin>
                                    </div>
                                </div>
                            ) : (
                                'loading...'
                            )}
                        </Card>
                    </Col>
                    <Col lg={17}>
                        <Card
                            className={styles.tabsCard}
                            bordered={false}
                            tabList={operationTabList}
                            activeTabKey={this.state.noTitleKey}
                            onTabChange={this.onTabChange}
                            loading={listLoading}
                        >
                            {children}
                        </Card>
                    </Col>
                </Row>
            </GridContent>
        )
    }
}

export default Account;
