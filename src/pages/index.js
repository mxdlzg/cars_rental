import styles from './index.less';
import React from 'react';
import {Avatar, Button, Card, Carousel, Divider, Empty, Icon, List, Progress, Tag} from 'antd';
import Meta from "antd/es/card/Meta";
import cars1 from "@/assets/cars1.jpg"
import cars2 from "@/assets/cars2.jpg"
import cars3 from "@/assets/cars3.jpg"
import cars4 from "@/assets/cars4.jpg"
import {connect} from "dva/index";
import ArticleListContent from "@/components/ArticleListContent/index";
import Ellipsis from "@/components/Ellipsis/index";
import moment from "moment";
import AvatarList from "@/components/AvatarList/index";
import * as numeral from "numeral";


@connect(({index, loading}) => ({
    index,
    loading: loading.effects['index/fetch'],
}))
class Index extends React.PureComponent {
    componentDidMount() {
        this.props.dispatch({
            type: "index/fetch"
        })
    }

    fetchMore = (from) => {
        const {currentPage} = this.props.index;
        this.props.dispatch({
            type:"index/appendFetch",
            payload:{"from":from,"page":currentPage[from]+1}
        })
    };

    loadMore = (loading,list, from) => {
        const {currentPage} = this.props.index;
        return (
            currentPage[from] !== -1 ? (
                <div style={{textAlign: 'center', marginTop: 16}}>
                    <Button onClick={this.fetchMore.bind(this,from)} style={{paddingLeft: 48, paddingRight: 48}}>
                        {loading ? (
                            <span>
                <Icon type="loading"/> 加载中...
                    </span>
                        ) : (
                            '加载更多'
                        )}
                    </Button>
                </div>
            ) : null
        )
    };

    render() {
        const {index, loading} = this.props;
        const {recommendation, strategy, comments} = index;

        const IconText = ({type, text}) => (
            <span>
                <Icon type={type} style={{marginRight: 8}}/>
                {text}
            </span>
        );
        return (
            <div className={styles.normal}>
                <Carousel className={styles.antcarousel} autoplay>
                    <img alt={""} className={styles.slimg}
                         src={"http://www.ccdol.com/d/file/sheji/biaozhi/2015-09-25/c9b935e9132c3c48253ee0af51d3b5b2.gif"}/>
                    <div><h3>2</h3></div>
                    <div><h3>3</h3></div>
                    <div><h3>4</h3></div>
                </Carousel>
                <div className={styles.topQuick}>
                    <Card
                        cover={<a href={"/rental/selfdriving"}>
                            <img className={styles.imgSc} alt="example"
                                 src={cars1}/>
                        </a>}
                        actions={[<Icon type="edit"/>]}
                    >
                        <Meta
                            avatar={<Avatar size="large" icon="user"/>}
                            title="短租自驾"
                            description="24小时轻松取 / 还车"
                        />
                    </Card>
                    <Card
                        cover={<a href={"/user/login"}>
                            <img className={styles.imgSc} alt="example"
                                 src={cars2}/>
                        </a>}
                        actions={[<Icon type="edit"/>]}
                    >
                        <Meta
                            avatar={<Avatar size="large" icon="car"/>}
                            title="长租服务"
                            description="长租一次告别常租"
                        />
                    </Card>
                    <Card
                        cover={<a href={"/user/login"}>
                            <img className={styles.imgSc} alt="example"
                                 src={cars3}/>
                        </a>}
                        actions={[<Icon type="edit"/>]}
                    >

                        <Meta

                            avatar={<Avatar size="large" icon="environment"/>}
                            title="企业租车"
                            description="企业出行一步搞定"
                        />
                    </Card>
                    <Card
                        cover={<a href={"/user/login"}>
                            <img className={styles.imgSc} alt="example"
                                 src={cars4}/>
                        </a>}
                        actions={[<Icon type="edit"/>]}
                    >
                        <Meta
                            avatar={<Avatar size="large" icon="clock-circle" theme="twoTone" twotonecolor="#eb2f96"/>}
                            title="顺风车站"
                            description="价格便宜就是任性"
                        />
                    </Card>
                </div>
                <div className={styles.mainContent}>
                    <Divider orientation="left"><h2>精选热门车型</h2></Divider>
                    <p>为您精选热门车型，点击一键下单.</p>
                    <List
                        rowKey="id"
                        loadMore={this.loadMore(loading,recommendation, 0)}
                        loading={loading}
                        grid={{gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1}}
                        dataSource={recommendation}
                        renderItem={item => (
                            <List.Item style={{textAlign: "right"}} actions={[
                                <a
                                    onClick={e => {
                                        e.preventDefault();
                                        this.showEditModal(item);
                                    }}
                                >
                                    查看
                                </a>,
                            ]}>
                                <List.Item.Meta
                                    avatar={<img src={item.logo} style={{width: '150px', height: '100px'}}/>}
                                    title={<a href={"car/" + item.href}>{item.title}</a>}
                                    description={item.description}
                                />
                                <div className={styles.listContent}>
                                    <div className={styles.listContentItem}>
                                        <p>
                                            <span>生成时间:&nbsp;&nbsp;&nbsp;&nbsp;</span>{moment(item.createdAt).format('YYYY-MM-DD HH:mm')}
                                        </p>
                                    </div>
                                    <div className={styles.listContentItem}>
                                        <Progress strokeColor={{
                                            '0%': '#108ee9',
                                            '100%': '#87d068',
                                        }} percent={item.percent * 100} strokeWidth={6}
                                                  format={(percent, successPercent) => {
                                                      return "推荐度：" + numeral(percent).format('0,0.00') + "%";
                                                  }}
                                                  style={{width: 180}}/>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />

                    <Divider orientation="left"><h2>热门国家租车攻略</h2></Divider>
                    <p>为您精选热门旅游目的地攻略，我们提供详细的租车攻略.</p>
                    <Card
                        style={{marginTop: 24}}
                        bordered={false}
                        bodyStyle={{padding: '8px 32px 32px 32px'}}
                    >
                        <List
                            rowKey="id"
                            loadMore={this.loadMore(loading,strategy, 1)}
                            loading={loading}
                            grid={{gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1}}
                            dataSource={strategy}
                            renderItem={item => (
                                <List.Item>
                                    <Card
                                        className={styles.card}
                                        hoverable
                                        cover={<img alt={item.title} src={item.cover}/>}
                                    >
                                        <Card.Meta
                                            title={<a>{item.title}</a>}
                                            description={<Ellipsis lines={2}>{item.subDescription}</Ellipsis>}
                                        />
                                        <div className={styles.cardItemContent}>
                                            <span>{moment(item.updatedAt).fromNow()}</span>
                                            <div className={styles.avatarList}>
                                                <AvatarList size="mini">
                                                    <AvatarList.Item
                                                        key={`${item.userId}-avatar`}
                                                        src={item.avatar}
                                                        tips={item.name}
                                                    />
                                                </AvatarList>
                                            </div>
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </Card>
                    <Divider orientation="left"><h2>用户评价</h2></Divider>
                    <p>多种租车模式想怎么租，就怎么租，时间与里程统统都忘掉.</p>
                    <Card
                        style={{marginTop: 24}}
                        bordered={true}
                        bodyStyle={{padding: '8px 32px 32px 32px'}}
                    >
                        <List
                            size="large"
                            loading={comments.length === 0 ? loading : false}
                            rowKey="id"
                            itemLayout="vertical"
                            loadMore={this.loadMore(loading, comments, 2)}
                            dataSource={comments}
                            renderItem={item => (
                                <List.Item
                                    key={item.id}
                                    actions={[
                                        <IconText type="star-o" text={item.star}/>,
                                        <IconText type="like-o" text={item.like}/>,
                                        <IconText type="message" text={item.message}/>,
                                    ]}
                                    extra={<div className={styles.listItemExtra}>
                                        <img alt="车型" src={item.avatar}
                                             style={{width: '15em', height: '10em', float: 'right'}}/>
                                    </div>}
                                >
                                    <List.Item.Meta
                                        title={
                                            <a className={styles.listItemMetaTitle} href={item.href}>
                                                {item.title}
                                            </a>
                                        }
                                        description={
                                            <span>
                                                <Tag>{item.label}</Tag>
                                            </span>
                                        }
                                    />
                                    <ArticleListContent data={item}/>
                                </List.Item>
                            )}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Index;