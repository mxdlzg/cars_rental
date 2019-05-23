import React, {PureComponent} from 'react';
import {Button, List, Spin, Tag} from 'antd';
import {connect} from 'dva';
import styles from './Orders.less';
import {stringify} from "qs";
import router from "umi/router";

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
            payload: {isInit: false, page: this.props.page, isMore: true},
        })
    };

    onOrder(item) {
        router.push({
            pathname: "/order/OrderDetail", search: stringify({id: item.orderId})
        })
    }

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
                                <Button type="primary" onClick={this.onOrder.bind(this, item)}>查看订单</Button>
                            ]}
                        >
                            <img alt="车型" src={item.imageSrc} style={{width: '10em', height: '7em', marginRight: "1em"}}/>
                            <List.Item.Meta
                                title={<h3>{item.typeName}&nbsp;<Tag color="cyan">自驾</Tag><br/>{item.brandName}</h3>}
                                description={<h5>{item.description}</h5>}
                            />
                            <h1 className={styles.priceLabel}>总计:¥{item.totalPrice}</h1>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}

export default Account;