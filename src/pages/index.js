import styles from './index.less';
import React from 'react';
import {Avatar, Button, Card, Carousel, Divider, Empty, Form, Icon, List, Modal, Progress, Tag, Spin} from 'antd';
import Meta from "antd/es/card/Meta";
import cars1 from "@/assets/cars1.jpg"
import cars2 from "@/assets/cars2.jpg"
import cars3 from "@/assets/cars3.jpg"
import cars4 from "@/assets/cars4.jpg"
import bc1 from "@/assets/bc1.jpg"
import {connect} from "dva/index";
import ArticleListContent from "@/components/ArticleListContent/index";
import Ellipsis from "@/components/Ellipsis/index";
import moment from "moment";
import AvatarList from "@/components/AvatarList/index";
import * as numeral from "numeral";
import Result from "@/components/Result/index";
import DescriptionList from "@/components/DescriptionList/DescriptionList";
import Description from "@/components/DescriptionList/Description";
import PageHeader from "@/components/PageHeader/index";

const FormItem = Form.Item;

@connect(({index, loading}) => ({
    index,
    loading: loading.effects['index/fetch'],
    carDetailLoading: loading.effects['index/fetchCarDetail'],
}))
class Index extends React.PureComponent {
    state = {visible: false, done: false};

    componentDidMount() {
        this.props.dispatch({
            type: "index/fetch"
        })
    }

    fetchMore = (from) => {
        const {currentPage} = this.props.index;
        this.props.dispatch({
            type: "index/appendFetch",
            payload: {"from": from, "page": currentPage[from] + 1}
        })
    };

    showCarModal = (item) => {
        if (item) {
            this.props.dispatch({
                type: "index/fetchCarDetail",
                payload: item.href
            });
            this.setState({
                visible: true,
                current: item,
                done: false
            });
        }
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    getModalContent = () => {
        const {carDetailLoading} = this.props;
        const {currentCarDetail} = this.props.index;
        return (
            <div style={{textAlign: "center"}}>
                {carDetailLoading || !currentCarDetail ?
                    <Spin/>
                    :<PageHeader
                        className={styles.left}
                        title={"车辆编号：" + currentCarDetail.id}
                        logo={
                            <img alt=""
                                 src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png"/>
                        }
                        content={
                            <DescriptionList className={styles.headerList} size="small" col="2">
                                <Description term="车辆类型">{currentCarDetail.typeName}</Description>
                                <Description term="标签">{<Tag color="blue">{currentCarDetail.label}</Tag>}</Description>
                                <Description term="车辆品牌">{currentCarDetail.maker}</Description>
                                <Description term="登记日期">{currentCarDetail.buyDate}</Description>
                                <Description term="颜色">{currentCarDetail.color}</Description>
                                <Description term="结构">{currentCarDetail.structure}</Description>
                                <Description term="类型">{currentCarDetail.type}</Description>
                                <Description term="描述">{currentCarDetail.description}</Description>
                            </DescriptionList>
                        }
                        extraContent={
                            <img alt="" className={styles.imgSc}
                                 src={currentCarDetail.imageSrc}/>
                        }
                    >
                    </PageHeader>
                }
            </div>
        );
    };

    loadMore = (loading, list, from) => {
        const {currentPage} = this.props.index;
        return (
            currentPage[from] !== -1 ? (
                <div style={{textAlign: 'center', marginTop: 16}}>
                    <Button onClick={this.fetchMore.bind(this, from)} style={{paddingLeft: 48, paddingRight: 48}}>
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
        const {visible, done, current = {}} = this.state;
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
                    <img alt={""} className={styles.slimg}
                         src={"http://localhost:8080/bc2.jpg"}/>
                    <img alt={""} className={styles.slimg}
                         src={"http://localhost:8080/bc3.jpg"}/>
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
                        loadMore={this.loadMore(loading, recommendation, 0)}
                        loading={loading}
                        grid={{gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1}}
                        dataSource={recommendation}
                        renderItem={item => (
                            <List.Item style={{textAlign: "right"}} actions={[
                                <a
                                    onClick={e => {
                                        e.preventDefault();
                                        this.showCarModal(item);
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
                            loadMore={this.loadMore(loading, strategy, 1)}
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
                <Modal
                    title="车辆详情"
                    width={840}
                    bodyStyle={done ? {padding: '72px 0'} : {padding: '28px 0 0'}}
                    destroyOnClose
                    visible={visible}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                >
                    {this.getModalContent()}
                </Modal>
            </div>
        );
    }

}

export default Index;