import React, {PureComponent} from 'react';
import {Avatar, Button, Card, Dropdown, Icon, List, Menu, Spin, Tooltip} from 'antd';
import numeral from 'numeral';
import {connect} from 'dva';
import {formatWan} from '@/utils/utils';
import styles from './Assets.less';
import moment from "moment";

@connect(({ assets,loading }) => ({
    listLoading:loading.effects['assets/fetch'],
    ...assets,
}))
class Assets extends PureComponent {
    componentDidMount(){
        this.props.dispatch({
            type:"assets/fetch",
            payload: {isInit: true, page: 0},
        })
    }

    loadMore = () => {
        this.props.dispatch({
            type: "assets/fetch",
            payload: {isInit: false, page: this.props.page, isMore: true},
        })
    };

    render() {
        const {
            list,
            listLoading,
            last,
        } = this.props;
        const itemMenu = (
            <Menu>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
                        详情
                    </a>
                </Menu.Item>
            </Menu>
        );
        const loadMore = (
                <div style={{textAlign: 'center', marginBottom: 12, height: 32, lineHeight: '32px',}}>
                    {(!listLoading) ? (
                        last ? <div/> :
                            <Button onClick={this.loadMore}>加载更多</Button>
                    ) : <Spin/>}
                </div>
            )
        ;
        return (
            <List
                loading={listLoading}
                rowKey="id"
                className={styles.filterCardList}
                grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
                dataSource={list}
                loadMore={loadMore}
                renderItem={item => (
                    <List.Item key={item.couponId}>
                        <Card
                            bodyStyle={{ paddingBottom: 20 }}
                            actions={[
                                <Tooltip title="分享">
                                    <Icon type="share-alt" />
                                </Tooltip>,
                                <Dropdown overlay={itemMenu}>
                                    <Icon type="ellipsis" />
                                </Dropdown>,
                            ]}
                        >
                            <Card.Meta avatar={<Avatar size="small" src={"https://image01.oneplus.cn/user/201707/09/192/bc4092498dd6db5acbee464189ea8e4f.jpg"} />}
                                       title={<div>{item.name}<p style={{float:"right",fontSize:'24px'}}>{"￥"+item.price}</p></div>}
                            />

                            <div>
                                <div className={styles.cardInfo}>

                                    <div>
                                        <p>开始日期</p>
                                        <p><h6>{moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')}</h6></p>
                                    </div>
                                    <div>
                                        <p>失效日期</p>
                                        <p><h6>{moment(item.endDate).format('YYYY-MM-DD HH:mm:ss')}</h6></p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        );
    }
}

export default Assets;