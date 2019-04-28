import React, {PureComponent} from 'react';
import {Button, List, Spin, Tag} from 'antd';
import {connect} from 'dva';
import styles from './Orders.less';

@connect(({loading, order}) => ({
    orderListLoading: loading.effects["order/queryOrderList"],
    ...order,
}))
class Account extends PureComponent {
    componentDidMount() {
        this.props.dispatch({
            type: "order/queryOrderList",
            payload: {isInit: true, page: 0},
        })
    }

    loadMore = () => {
        this.props.dispatch({
            type: "order/queryOrderList",
            payload: {isInit: false, page: this.props.page,isMore:true},
        })
    };

    render() {
        const {
            list,
            orderListLoading,
            last,
        } = this.props;
        // const IconText = ({type, text}) => (
        //     <span>
        //         <Icon type={type} style={{marginRight: 8}}/>
        //         {text}
        //     </span>
        // );
        const loadMore = (
                <div style={{textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',}}>
                    {(!orderListLoading) ? (
                        last ? <div/> :
                            <Button onClick={this.loadMore}>加载更多</Button>
                    ) : <Spin/>}
                </div>
            )
        ;
        return (
            <div>
                <List
                    size="large"
                    rowKey="id"
                    loading={false}
                    dataSource={list}
                    loadMore={loadMore}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button type="primary">查看订单</Button>
                            ]}
                        >
                            <img alt="车型" src={item.avatar} style={{width: '10em', height: '7em', marginRight: "1em"}}/>
                            <List.Item.Meta
                                title={<h3>大众朗逸&nbsp;<Tag color="cyan">自驾</Tag></h3>}
                                description={<h5>三厢|1.6自动|乘坐5人<br/>空间：空间较大，建议乘坐5人+3行李箱 </h5>}
                            />
                            <h1 className={styles.priceLabel}>总计:¥300</h1>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

export default Account;