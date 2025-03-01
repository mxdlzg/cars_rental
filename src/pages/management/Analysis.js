import React, {Component, Suspense} from 'react';
import {connect} from 'dva';
import {Row, Col, Icon, Menu, Dropdown} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import {getTimeDistance} from '@/utils/utils';
import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));
const TopSearch = React.lazy(() => import('./TopSearch'));
const ProportionSales = React.lazy(() => import('./ProportionSales'));
const OfflineData = React.lazy(() => import('./OfflineData'));

@connect(({chart, loading}) => ({
    chart,
    loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
    state = {
        loading: true,
        salesType: 'all',
        currentTabKey: '',
        rangePickerValue: getTimeDistance('week'),
    };

    componentDidMount() {
        const {dispatch} = this.props;
        this.reqRef = requestAnimationFrame(() => {
            dispatch({
                type: 'chart/fetch',
            });
        });
        setTimeout(() => {
            this.setState({
                loading: false,
            });
        }, 500);
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'chart/clear',
        });
        cancelAnimationFrame(this.reqRef);
    }

    handleChangeSalesType = e => {
        this.setState({
            salesType: e.target.value,
        });
    };

    handleTabChange = key => {
        this.setState({
            currentTabKey: key,
        });
    };

    handleRangePickerChange = rangePickerValue => {
        const {dispatch} = this.props;
        this.setState({
            rangePickerValue,
        });

        dispatch({
            type: 'chart/fetchSalesData',
            payload:rangePickerValue
        });
    };

    selectDate = (type) => {
        //e.preventDefault();
        const {dispatch} = this.props;
        let dis = getTimeDistance(type);
        this.setState({
            rangePickerValue: dis,
        });

        dispatch({
            type: 'chart/fetchSalesData',
            payload: dis,
        });
        return false;
    };

    isActive = type => {
        const {rangePickerValue} = this.state;
        const value = getTimeDistance(type);
        if (!rangePickerValue[0] || !rangePickerValue[1]) {
            return '';
        }
        if (
            rangePickerValue[0].isSame(value[0], 'day') &&
            rangePickerValue[1].isSame(value[1], 'day')
        ) {
            return styles.currentDate;
        }
        return '';
    };

    render() {
        const {rangePickerValue, salesType, currentTabKey, loading: stateLoading} = this.state;
        const {chart, loading: propsLoading} = this.props;
        const loading = stateLoading || propsLoading;
        const {
            visitData,
            salesData,
            rankingListData,
            visitData2,
            searchData,
            offlineData,
            offlineChartData,
            salesTypeData,
            salesTypeDataOnline,
            salesTypeDataOffline,
        } = chart;
        let salesPieData;
        if (salesType === 'all') {
            salesPieData = salesTypeData;
        } else {
            salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
        }
        const menu = (
            <Menu>
                <Menu.Item>操作一</Menu.Item>
                <Menu.Item>操作二</Menu.Item>
            </Menu>
        );

        const dropdownGroup = (
            <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis"/>
        </Dropdown>
      </span>
        );

        const activeKey = currentTabKey || (offlineData[0] && offlineData[0].label);

        return (
            <div className={styles.content}>
                {
                    rankingListData?
                        <GridContent>
                            <Suspense fallback={<PageLoading/>}>
                                <IntroduceRow loading={loading} visitData={visitData}/>
                            </Suspense>
                            <Suspense fallback={null}>
                                <SalesCard
                                    id="salesCard"
                                    rangePickerValue={rangePickerValue}
                                    salesData={salesData}
                                    rankingListData={rankingListData}
                                    isActive={this.isActive}
                                    handleRangePickerChange={this.handleRangePickerChange}
                                    loading={loading}
                                    selectDate={this.selectDate}
                                />
                            </Suspense>
                            <div className={styles.twoColLayout}>
                                <Row gutter={24}>
                                    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                                        <Suspense fallback={null}>
                                            <TopSearch
                                                loading={loading}
                                                visitData2={visitData2}
                                                selectDate={this.selectDate}
                                                searchData={searchData}
                                                dropdownGroup={dropdownGroup}
                                            />
                                        </Suspense>
                                    </Col>
                                    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                                        <Suspense fallback={null}>
                                            <ProportionSales
                                                dropdownGroup={dropdownGroup}
                                                salesType={salesType}
                                                loading={loading}
                                                salesPieData={salesPieData}
                                                handleChangeSalesType={this.handleChangeSalesType}
                                            />
                                        </Suspense>
                                    </Col>
                                </Row>
                            </div>
                            <Suspense fallback={null}>
                                <OfflineData
                                    activeKey={activeKey}
                                    loading={loading}
                                    offlineData={offlineData}
                                    offlineChartData={offlineChartData}
                                    handleTabChange={this.handleTabChange}
                                />
                            </Suspense>
                        </GridContent>
                    :<br/>
                }
            </div>
        );
    }
}

export default Analysis;
