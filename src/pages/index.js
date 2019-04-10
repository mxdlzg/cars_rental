import styles from './index.css';
import {Carousel, Divider, Empty, Card, Avatar, Icon} from 'antd';
import Meta from "antd/es/card/Meta";
import cars1 from "@/assets/cars1.jpg"
import cars2 from "@/assets/cars2.jpg"
import cars3 from "@/assets/cars3.jpg"
import cars4 from "@/assets/cars4.jpg"

export default function () {
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
                        avatar={<Avatar size="large" icon="clock-circle" theme="twoTone" twoToneColor="#eb2f96"/>}
                        title="顺风车站"
                        description="价格便宜就是任性"
                    />
                </Card>
            </div>
            <div className={styles.mainContent}>
                <Divider orientation="left"><h2>精选热门车型</h2></Divider>
                <p align="center">为您精选热门车型，点击一键下单.</p>
                <Empty/>
                <Divider orientation="left"><h2>热门国家租车攻略</h2></Divider>
                <p align="center">为您精选热门旅游目的地攻略，我们提供详细的租车攻略.</p>
                <Empty/>
                <Divider orientation="left"><h2>用户评价</h2></Divider>
                <p align="center">多种租车模式想怎么租，就怎么租，时间与里程统统都忘掉.</p>
                <Empty/>
            </div>
        </div>
    );
}
