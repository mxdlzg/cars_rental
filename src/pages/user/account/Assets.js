import React, {PureComponent} from 'react';
import {Avatar, Button, Card, Dropdown, Icon, List, Menu, Spin, Tooltip} from 'antd';
import numeral from 'numeral';
import {connect} from 'dva';
import {formatWan} from '@/utils/utils';
import styles from './Assets.less';

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
        const CardInfo = ({ activeUser, newUser }) => (
            <div className={styles.cardInfo}>
                <div>
                    <p>开始日期</p>
                    <p>{activeUser}</p>
                </div>
                <div>
                    <p>失效日期</p>
                    <p>{newUser}</p>
                </div>
            </div>
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
                    <List.Item key={item.id}>
                        <Card
                            bodyStyle={{ paddingBottom: 20 }}
                            actions={[
                                <Tooltip title="编辑">
                                    <Icon type="edit" />
                                </Tooltip>,
                                <Tooltip title="分享">
                                    <Icon type="share-alt" />
                                </Tooltip>,
                                <Dropdown overlay={itemMenu}>
                                    <Icon type="ellipsis" />
                                </Dropdown>,
                            ]}
                        >
                            <Card.Meta avatar={<Avatar size="small" src={item.avatar} />} title={item.title} />
                            <div className={styles.cardItemContent}>
                                <CardInfo
                                    activeUser={formatWan(item.activeUser)}
                                    newUser={numeral(item.newUser).format('0,0')}
                                />
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        );
    }
}

export default Assets;