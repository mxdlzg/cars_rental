import React from "react";
import styles from "./SelfDriving.css"
import debounce from 'lodash/debounce';
import moment from 'moment';
import CheckTag from '@/components/CRental/CheckTag';
import {Map} from 'react-amap';
import cars1 from "@/assets/cars1.jpg"
import {connect} from 'dva';
import {
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
    Checkbox,
    Switch, //Avatar, Menu,
    //Dropdown,
    List, Skeleton
} from "antd";

const TabPane = Tabs.TabPane;
const Option = AutoComplete.Option;
const CheckboxGroup = Checkbox.Group;
const {RangePicker} = DatePicker;
const CNIcon = Icon.createFromIconfontCN({scriptUrl: '//at.alicdn.com/t/font_1117012_xghpdfopd5.js'});

const options = [{
    value: '上海',
    label: '上海',
    children: [{
        value: '奉贤区',
        label: '奉贤区',
        children: [{
            value: '奉贤',
            label: '奉贤',
        }],
    }],
}, {
    value: '山东',
    label: '山东',
    children: [{
        value: '济南',
        label: '济南',
        children: [{
            value: '历下区',
            label: '历下区',
        }],
    }],
}];
const optionsSeatDisabled = [
    {label: '5座以下', value: '5座以下'},
    {label: '5座以上', value: '5座以上'},
];
const optionsPriceDisabled = [
    {label: '0-150', value: '0-150'},
    {label: '150-300', value: '150-300'},
    {label: '300-500', value: '300-500'},
    {label: '500+', value: '500+'},
];
const optionsBrandDisabled = [
    {label: '不限', value: '不限'},
    {label: '奥迪', value: '奥迪'},
    {label: '宝马', value: '宝马'},
    {label: '奔驰', value: '奔驰'},
    {label: '本田', value: '本田'},
    {label: '福特', value: '福特'},
    {label: '沃尔沃', value: '沃尔沃'},
    {label: '起亚', value: '起亚'},
    // {label: 'Orange', value: 'Orange', disabled: false},
];

const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 10,
    total: 50,
};


function callback(key) {
    console.log(key);
}

function onChange(value) {
    console.log(value);
}

function getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}

function searchResult(query) {
    return (new Array(getRandomInt(5))).join('.').split('.')
        .map((item, idx) => ({
            query,
            category: `${query}${idx}`,
            count: getRandomInt(200, 100),
        }));
}

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
    ...rental,
}))
class SelfDriving extends React.Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.searchRental = debounce(this.searchRental, 800);
        this.enterSearchLoading = this.enterSearchLoading.bind(this);
    }

    state = {
        dataSource: [],
        data: [],
        value: [],
        fetching: false,
        iconLoading: false,
        carTypeChecked: [false, false, false, false],
        carTypeCheckedLastIndex: 0,
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'rental/fetchOptions',
        });
    }

    componentWillMount() {

    }

    handleSearch = (value) => {
        this.setState({
            dataSource: value ? searchResult(value) : [],
        });
    };

    searchRental = (value) => {
        //TODO::
        // console.log('fetching user', value);
        // this.lastFetchId += 1;
        // const fetchId = this.lastFetchId;
        // this.setState({data: [], fetching: true});
        // fetch('https://randomuser.me/api/?results=5')
        //     .then(response => response.json())
        //     .then((body) => {
        //         if (fetchId !== this.lastFetchId) { // for fetch callback order
        //             return;
        //         }
        //         const data = body.results.map(user => ({
        //             text: `${user.name.first} ${user.name.last}`,
        //             value: user.login.username,
        //         }));
        //         this.setState({data, fetching: false});
        //     });
    };

    handleChange = (value) => {
        this.setState({
            value,
            data: [],
            fetching: false,
        });
    };

    enterSearchLoading() {
        this.setState({iconLoading: true});
    }

    cardClick(i) {
        let ds = this.state.carTypeChecked;
        if (ds[this.state.carTypeCheckedLastIndex]) {
            ds[this.state.carTypeCheckedLastIndex] = false;
        }
        ds[i] = !ds[i];
        this.setState({
            carTypeChecked: ds,
            carTypeCheckedLastIndex: i
        });
    }


    render() {
        const {carTypeChecked} = this.state;
        const {fetching, data, value} = this.state;
        const {filterOptions} = this.props;

        return (
            <div className={styles.main}>
                <div>
                    <Card id="search_bar" className={styles.card}>
                        {filterOptions
                            ? <div>
                                <div style={{width: '35em', float: 'left'}}>
                                    <div>
                                        <Icon style={{fontSize: '20px'}} type="home"/>
                                        <Cascader className={styles.inputCommon} options={filterOptions.options} onChange={onChange}
                                                  placeholder="出发地"/>
                                        <Select
                                            className={styles.searchLocation}
                                            showSearch
                                            value={value}
                                            placeholder="选择出发地"
                                            notFoundContent={fetching ? <Spin size="small"/> : <Empty/>}
                                            filterOption={false}
                                            onSearch={this.searchRental}
                                            onChange={this.handleChange}
                                        >
                                            {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                                        </Select>
                                    </div>
                                    <div style={{paddingTop: '1em'}}>
                                        <Icon type="environment" style={{fontSize: '20px'}}/>
                                        <Cascader className={styles.inputCommon} options={filterOptions.options} onChange={onChange}
                                                  placeholder="目的地"/>
                                        <Select
                                            className={styles.searchLocation}
                                            showSearch
                                            value={value}
                                            placeholder="选择目的地"
                                            notFoundContent={fetching ? <Spin size="small"/> : <Empty/>}
                                            filterOption={false}
                                            onSearch={this.searchRental}
                                            onChange={this.handleChange}
                                        >
                                            {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                                        </Select>
                                    </div>
                                </div>
                                <RangePicker
                                    style={{float: 'left'}}
                                    disabledDate={disabledDate}
                                    disabledTime={disabledRangeTime}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                    }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                />
                                <Button className={styles.searchBtn} size="large" type="primary" icon="search"
                                        loading={this.state.iconLoading} onClick={this.enterSearchLoading}>
                                    立刻用车
                                </Button>
                            </div>
                            : <Skeleton active paragraph={{ rows: 2 }}/>
                        }
                    </Card>
                    <Card id="search_detail" className={styles.cardDetail} title="车型信息">
                        {filterOptions
                            ? <div>
                                <Card.Grid className={styles.carType} onClick={() => this.cardClick(0)}>
                                    <CNIcon style={{fontSize: '50px'}} type="icon-car"/>
                                    <CheckTag checked={carTypeChecked[0]}>所有</CheckTag>
                                </Card.Grid>
                                <Card.Grid className={styles.carType} onClick={() => this.cardClick(1)}>
                                    <CNIcon style={{fontSize: '50px'}} type="icon-suv"/>
                                    <CheckTag checked={carTypeChecked[1]}>SUV</CheckTag>
                                </Card.Grid>
                                <Card.Grid className={styles.carType} onClick={() => this.cardClick(2)}>
                                    <CNIcon style={{fontSize: '50px'}} type="icon-jiaocheqiche"/>
                                    <CheckTag checked={carTypeChecked[2]}>轿车</CheckTag>
                                </Card.Grid>
                                <Card.Grid className={styles.carType} onClick={() => this.cardClick(3)}>
                                    <CNIcon style={{fontSize: '50px'}} type="icon-icon3"/>
                                    <CheckTag checked={carTypeChecked[3]}>卡车</CheckTag>
                                </Card.Grid>
                                <Divider/>
                                <div style={{paddingLeft: '2em'}}>
                                    车辆座位<Divider type="vertical"/>
                                    <CheckboxGroup className={styles.checkGroup} options={optionsSeatDisabled}
                                                   defaultValue={['Apple']} onChange={onChange}/>
                                </div>
                                <Divider/>
                                <div style={{paddingLeft: '2em'}}>
                                    价格<Divider type="vertical"/>
                                    <CheckboxGroup className={styles.checkGroup} options={optionsPriceDisabled}
                                                   defaultValue={['Apple']} onChange={onChange}/>
                                </div>
                                <Divider/>
                                <div style={{paddingLeft: '2em'}}>
                                    品牌<Divider type="vertical"/>
                                    <CheckboxGroup className={styles.checkGroup} options={optionsBrandDisabled}
                                                   defaultValue={['Apple']} onChange={onChange}/>
                                </div>
                            </div>
                            : <Skeleton active paragraph={{ rows: 5 }}/>
                        }
                    </Card>
                </div>

                <div>
                    <div id="left_map" className={styles.contentLeft}>
                        <Card className={styles.card}>
                            <h2>门店地图</h2>
                            <div className={styles.map}>
                                <Map amapkey={"74636f75530d04b9a7a6a63c74416a28"}/>
                            </div>
                            <br/>
                            <br/>
                            地址：浦东新区启航路1200号华美达酒店南面200米（P3停车场内）
                        </Card>
                    </div>
                    <div id="right_cars" className={styles.contentRight}>
                        <Card className={styles.card}>
                            <Tabs className={styles.tabs}
                                  tabBarExtraContent={<Switch checkedChildren="高" unCheckedChildren="低" size="normal"/>}
                                  defaultActiveKey="1" onChange={callback}>
                                <TabPane tab="短租自驾" key="1">
                                    <List
                                        size="large"
                                        rowKey="id"
                                        loading={false}
                                        pagination={paginationProps}
                                        dataSource={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                        renderItem={item => (
                                            <List.Item
                                                actions={[
                                                    <a href={"/order/RentalOrder"}>
                                                        <Button type="primary" size={'large'}>租车</Button>
                                                    </a>
                                                ]}
                                            >
                                                <img alt="车型" src={cars1} style={{width: '15em', height: '10em'}}/>
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
                                <TabPane tab="周租套餐" key="2">
                                    Content of Tab Pane 2
                                </TabPane>
                                <TabPane tab="月租长租" key="3">
                                    Content of Tab Pane 3
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