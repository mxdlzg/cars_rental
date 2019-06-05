import React from "react";
import styles from "./SelfDriving.css"
// import debounce from 'lodash/debounce';
import moment from 'moment';
import CheckTag from '@/components/CRental/CheckTag';
import {Map} from 'react-amap';
import {connect} from 'dva';
import TagSelect from 'ant-design-pro/lib/TagSelect';
import router from 'umi/router';
import {
    message,
    Affix,
    Tabs,
    Card,
    Cascader,
    AutoComplete,
    Icon,
    Button,
    Select,
    Spin,
    Empty,
    DatePicker,
    Divider,
    Switch, //Avatar, Menu,
    //Dropdown,
    List, Skeleton
} from "antd";

const TabPane = Tabs.TabPane;
const Option = AutoComplete.Option;
const {RangePicker} = DatePicker;
const CNIcon = Icon.createFromIconfontCN({scriptUrl: '//at.alicdn.com/t/font_1117012_xghpdfopd5.js'});

function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
}

function disabledRangeTime(_, type) {
    if (type === 'start') {
        return {
            disabledHours: () => range(0, 60).splice(4, 20),
            disabledMinutes: () => range(30, 60),
            disabledSeconds: () => [55, 56],
        };
    }
    return {
        disabledHours: () => range(0, 60).splice(20, 4),
        disabledMinutes: () => range(0, 31),
        disabledSeconds: () => [55, 56],
    };
}


@connect(({rental, loading}) => ({
    filterOptionsLoading: loading.effects['rental/fetchOptions'],
    searchLoading: loading.effects['rental/searchRental'],
    loadMoreLoading: loading.effects['rental/searchRentalLoadMore'],
    ...rental,
}))
class SelfDriving extends React.PureComponent {
    constructor(props) {
        super(props);
        // this.searchRental = debounce(this.searchRental, 800);
        this.enterSearchLoading = this.enterSearchLoading.bind(this);
        this.onStartCascaderChange = this.onStartCascaderChange.bind(this);
        this.onEndCascaderChange = this.onEndCascaderChange.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        //this.onLocationChange = this.onLocationChange.bind(this);
    }

    state = {
        dataSource: [],
        tmpData: [],
        car: '所有',
        seat: [],
        price: [],
        brand: [],
        ordered: false,
        sR: [],
        wR: [],
        mR: []
    };

    componentDidMount() {
        const {dispatch} = this.props;
        console.log(this.props.loading);
        dispatch({
            type: 'rental/fetchOptions',
        });
    }

    onStartCascaderChange(value) {
        const {dispatch} = this.props;
        if (value.length > 0) {
            dispatch({
                type: 'rental/fetchStores',
                payload: {data: value, type: 'start'}
            });
        }
    }

    onEndCascaderChange(value) {
        const {dispatch} = this.props;
        if (value.length > 0) {
            dispatch({
                type: 'rental/fetchStores',
                payload: {data: value, type: 'end'}
            });
        }
    }

    checkSearchParams() {
        const {originLocation, aimLocation, dates} = this.props;
        if (originLocation && aimLocation && dates) {
            return true;
        } else {
            message.error("请选择起止地点、起止日期");
        }
    }

    enterSearchLoading() {
        if (this.checkSearchParams()) {
            this.props.dispatch({
                type: 'rental/searchRental',
            }).then(()=>{
                this.dataReloading();
            })
        }
    }

    onLocationChange(id, value) {
        message.success(value);
        this.props.dispatch({
            type: 'rental/changeSearchParams',
            payload: {id, value}
        })
    };

    onDateOk = (value) => {
        this.props.dispatch({
            type: 'rental/changeSearchParams',
            payload: {value: {startDate: value[0].unix(), endDate: value[1].unix()}}
        });
        message.success(value[0].format("YYYY-MM-DD HH:mm:ss") + "--" + value[1].format("YYYY-MM-DD HH:mm:ss"));
    };
    onDateChange = (value) => {
        this.props.dispatch({
            type: 'rental/saveDate',
            payload: {value: value}
        });
    };

    tabChange = (key) => {
        this.props.dispatch({
            type: 'rental/changeTab',
            payload: parseInt(key)
        });
    };

    loadMore = () => {
        if (this.checkSearchParams()) {
            this.props.dispatch({
                type: 'rental/searchRentalLoadMore',
            }).then(()=>{
                this.dataReloading();
            })
        }
    };

    onRent = (item, e) => {
        e.preventDefault();
        const {dates, originLocation, aimLocation} = this.props;
        message.success(item.id);
        router.push({
            pathname: "/order/RentalOrder",
            query: {
                carId: item.id,
                ...dates,
                start: originLocation,
                end: aimLocation
            }
        })
    };

    optionsChange(from, value) {
        switch (from) {
            case 'seat':
                this.setState({
                    seat: value
                },()=>{
                    this.dataReloading();
                });
                break;
            case 'price':
                this.setState({
                    price: value
                },()=>{
                    this.dataReloading();
                });
                break;
            case 'brand':
                this.setState({
                    brand: value
                },()=>{
                    this.dataReloading();
                });
                break;
            default:
                break;
        }
        console.log(value);
    }

    cardClick = (key, value) => {
        this.props.dispatch({
            type: "rental/changeOptions",
            payload: {type: 'car', key: key},
        });
        this.setState({
            car: value
        },()=>{
            this.dataReloading();
        });
        console.log(value);
    };

    priceChange = (checked, e) => {
        this.setState({
            ordered: checked
        },()=>{
            this.dataReloading();
        });
    };

    dataReloading = () => {
        const {car, seat, price, brand, ordered, sR, wR, mR} = this.state;
        const {tabIndex, shortRent, weekRent, monthRent} = this.props;
        let config = [car !== '所有', seat.length !== 0, price.length !== 0, brand.length !== 0, ordered];
        let resbl = [true, true, true, true, true];
        let tmp = [];
        switch (tabIndex) {
            case 1:
                tmp = shortRent.concat();
                break;
            case 2:
                tmp = weekRent.concat();
                break;
            case 3:
                tmp = monthRent.concat();
                break;
        }
        tmp = tmp.filter(item => {
            if (config[0]) {
                resbl[0] = item.type === car;
            }
            if (config[1]) {
                resbl[1] = seat.includes(item.structure);
            }
            if (config[2]) {
                let pr = item.defaultRentPrice;
                let i = 0;
                let rb = [false,false,false,false];
                price.forEach(item=>{
                    rb[i] = (pr>=item[0] && pr<=item[1]);
                    i = i+1;
                });
                resbl[2] = rb[0]||rb[1]||rb[2]||rb[3];
            }
            if (config[3]) {
                resbl[3] = brand.includes(item.maker);
            }
            return resbl[0]&&resbl[1]&&resbl[2]&&resbl[3];
        });
        if (!config[4]) {
            tmp.sort((a,b)=>{
                return a.defaultRentPrice-b.defaultRentPrice;
            });
        }else {
            tmp.sort((a,b)=>{
                return b.defaultRentPrice-a.defaultRentPrice;
            });
        }
        switch (tabIndex) {
            case 1:
                this.setState({
                    sR:tmp
                });
                break;
            case 2:
                this.setState({
                    wR:tmp
                });
                break;
            case 3:
                this.setState({
                    mR:tmp
                });
                break;
        }
    };

    render() {
        const {
            cascaderStartData, cascaderEndData, filterOptions, searchLoading, loadMoreLoading,
            loadedPage,
            tabIndex,
            originLocation,
            aimLocation,
            cascaderSelectSData,
            cascaderSelectEData,
            selectedDate
        } = this.props;
        const {sR,wR,mR} = this.state;
        const loadMore = (
                <div style={{textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',}}>
                    {(!loadMoreLoading) ? (
                        loadedPage[tabIndex - 1] === -1 ? <div/> :
                            <Button onClick={this.loadMore}>加载更多</Button>
                    ) : <Spin/>}
                </div>
            );
        return (
            <div className={styles.main}>
                <div>
                    <Card id="search_bar" className={styles.card}>
                        {filterOptions
                            ? <div>
                                <div style={{width: '35em', float: 'left'}}>
                                    <div>
                                        <Icon style={{fontSize: '20px'}} type="home"/>
                                        <Cascader className={styles.inputCommon} options={filterOptions.options}
                                                  onChange={this.onStartCascaderChange}
                                                  value={cascaderSelectSData}
                                                  placeholder="出发地"/>
                                        <Select
                                            id="selectStart"
                                            className={styles.searchLocation}
                                            showSearch
                                            onSelect={this.onLocationChange.bind(this, 'selectStart')}
                                            value={originLocation}
                                            placeholder="选择出发地"
                                            notFoundContent={<Empty/>}
                                            filterOption={true}
                                        >
                                            {cascaderStartData && cascaderStartData.map(d => <Option key={d.id}>{d.name}</Option>)}
                                        </Select>
                                    </div>
                                    <div style={{paddingTop: '1em'}}>
                                        <Icon type="environment" style={{fontSize: '20px'}}/>
                                        <Cascader className={styles.inputCommon} options={filterOptions.options}
                                                  onChange={this.onEndCascaderChange}
                                                  value={cascaderSelectEData}
                                                  placeholder="目的地"/>
                                        <Select
                                            id="selectEnd"
                                            className={styles.searchLocation}
                                            showSearch
                                            value={aimLocation}
                                            onSelect={this.onLocationChange.bind(this, 'selectEnd')}
                                            placeholder="选择目的地"
                                            notFoundContent={<Empty/>}
                                            filterOption={true}
                                        >
                                            {cascaderEndData && cascaderEndData.map(d => <Option key={d.id}>{d.name}</Option>)}
                                        </Select>
                                    </div>
                                </div>
                                <RangePicker
                                    style={{float: 'left'}}
                                    disabledDate={disabledDate}
                                    disabledTime={disabledRangeTime}
                                    onChange={this.onDateChange}
                                    onOk={this.onDateOk}
                                    value={selectedDate}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                    }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                />
                                <Button className={styles.searchBtn} size="large" type="primary" icon="search"
                                        loading={searchLoading} onClick={this.enterSearchLoading}>
                                    立刻用车
                                </Button>
                            </div>
                            : <Skeleton active paragraph={{rows: 2}}/>
                        }
                    </Card>
                    <Card id="search_detail" className={styles.cardDetail} title="车型信息">
                        {filterOptions
                            ? <div>
                                {
                                    filterOptions.optionsCar.map((item, key) => {
                                        return (
                                            <Card.Grid className={styles.carType}
                                                       onClick={this.cardClick.bind(this, key, item.value)}>
                                                <CNIcon style={{fontSize: '50px'}} type={item.type}/>
                                                <CheckTag checked={item.selected}>{item.value}</CheckTag>
                                            </Card.Grid>
                                        )
                                    })
                                }
                                <Divider/>
                                <div className={styles.optionsDiv}>
                                    <div className={styles.tags}>
                                        <strong>
                                            车辆座位
                                            <Divider type="vertical"/>
                                        </strong>
                                    </div>
                                    <TagSelect className={styles.tags} onChange={this.optionsChange.bind(this, 'seat')}>
                                        {
                                            filterOptions.optionsSeat.map((item, key) => {
                                                return (
                                                    <TagSelect.Option value={item.value}>{item.label}</TagSelect.Option>
                                                )
                                            })
                                        }
                                    </TagSelect>
                                </div>
                                <Divider/>
                                <div className={styles.optionsDiv}>
                                    <div className={styles.tags}>
                                        <strong>
                                            价位
                                            <Divider type="vertical"/>
                                        </strong>
                                    </div>
                                    <TagSelect className={styles.tags}
                                               onChange={this.optionsChange.bind(this, 'price')}>
                                        {
                                            filterOptions.optionsPrice.map((item, key) => {
                                                return (
                                                    <TagSelect.Option value={item.value}>{item.label}</TagSelect.Option>
                                                )
                                            })
                                        }
                                    </TagSelect>
                                </div>
                                <Divider/>
                                <div className={styles.optionsDiv}>
                                    <div className={styles.tags}>
                                        <strong>
                                            品牌
                                            <Divider type="vertical"/>
                                        </strong>
                                    </div>
                                    <TagSelect className={styles.tags}
                                               onChange={this.optionsChange.bind(this, 'brand')}>
                                        {
                                            filterOptions.optionsBrand.map((item, key) => {
                                                return (
                                                    <TagSelect.Option value={item.value}>{item.label}</TagSelect.Option>
                                                )
                                            })
                                        }
                                    </TagSelect>
                                </div>
                            </div>
                            : <Skeleton active paragraph={{rows: 5}}/>
                        }
                    </Card>
                </div>
                <div>
                    <Affix>
                        <div id="left_map" className={styles.contentLeft}>
                            <Card className={styles.card}>
                                <h2>门店地图</h2>
                                <div className={styles.map}>
                                    <Map plugins={['ToolBar']} amapkey={"74636f75530d04b9a7a6a63c74416a28"}/>
                                </div>
                                <br/>
                                <br/>
                                地址：浦东新区启航路1200号华美达酒店南面200米（P3停车场内）
                            </Card>
                        </div>
                    </Affix>

                    <div id="right_cars" className={styles.contentRight}>
                        <Card className={styles.card}>
                            <Tabs className={styles.tabs}
                                  tabBarExtraContent={<Switch onChange={this.priceChange} checkedChildren="高"
                                                              unCheckedChildren="低"
                                                              size="default"/>}
                                  defaultActiveKey="1" onChange={this.tabChange}>
                                <TabPane tab="短租自驾" key="1">
                                    <List
                                        size="large"
                                        rowKey="id"
                                        loading={false}
                                        dataSource={sR}
                                        loadMore={loadMore}
                                        renderItem={item => (
                                            <List.Item
                                                actions={[
                                                    <Button type="primary" size={'large'}
                                                            onClick={this.onRent.bind(this, item)}>租车</Button>
                                                ]}
                                            >
                                                <img alt="车型" src={item.imageSrc} style={{width: '15em', height: '10em'}}/>
                                                <div className={styles.listDescription}/>
                                                <List.Item.Meta
                                                    title={<h2>{item.typeName}</h2>}
                                                    description={<h4>{item.description}</h4>}
                                                />
                                                <h1 className={styles.priceLabel}>¥ {item.defaultRentPrice}/天</h1>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane tab="周租套餐" key="2">
                                    <List
                                        size="large"
                                        rowKey="id"
                                        loading={false}
                                        loadMore={loadMore} dataSource={wR}
                                        renderItem={item => (
                                            <List.Item
                                                actions={[
                                                    <a href={"/order/RentalOrder"}>
                                                        <Button type="primary" size={'large'}>租车</Button>
                                                    </a>
                                                ]}
                                            >
                                                <img alt="车型" src={item.imageSrc} style={{width: '15em', height: '10em'}}/>
                                                <div className={styles.listDescription}/>
                                                <List.Item.Meta
                                                    title={<h2>大众朗逸</h2>}
                                                    description={<h4>三厢|1.6自动|乘坐5人<br/>空间：空间较大，建议乘坐5人+3行李箱 </h4>}
                                                />
                                                <h1 className={styles.priceLabel}>¥ 300/天</h1>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane tab="月租长租" key="3">
                                    <List
                                        size="large"
                                        rowKey="id"
                                        loading={false}
                                        loadMore={loadMore} dataSource={mR}
                                        renderItem={item => (
                                            <List.Item
                                                actions={[
                                                    <a href={"/order/RentalOrder"}>
                                                        <Button type="primary" size={'large'}>租车</Button>
                                                    </a>
                                                ]}
                                            >
                                                <img alt="车型" src={item.imageSrc} style={{width: '15em', height: '10em'}}/>
                                                <div className={styles.listDescription}/>
                                                <List.Item.Meta
                                                    title={<h2>大众朗逸</h2>}
                                                    description={<h4>三厢|1.6自动|乘坐5人<br/>空间：空间较大，建议乘坐5人+3行李箱 </h4>}
                                                />
                                                <h1 className={styles.priceLabel}>¥ 300/天</h1>
                                            </List.Item>
                                        )}
                                    />
                                </TabPane>
                            </Tabs>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

}

export default SelfDriving;