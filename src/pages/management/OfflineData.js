import React, { memo } from 'react';
import { Card, Tabs, Row, Col } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import styles from './Analysis.less';
import { TimelineChart, Pie } from '@/components/Charts';
import NumberInfo from '@/components/NumberInfo';
import * as numeral from "numeral";

const CustomTab = ({ data, currentTabKey: currentKey }) => (
  <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
    <Col span={12}>
      <NumberInfo
        title={data.label}
        subTitle={
          <FormattedMessage id="app.analysis.conversion-rate" defaultMessage="Conversion Rate" />
        }
        gap={2}
        total={`${numeral(data.value * 100).format(0,0.00)}%`}
        theme={currentKey !== data.label && 'light'}
      />
    </Col>
    <Col span={12} style={{ paddingTop: 36 }}>
      <Pie
        animate={false}
        color={currentKey !== data.label && '#BDE4FF'}
        inner={0.55}
        tooltip={false}
        margin={[0, 0, 0, 0]}
        percent={data.value * 100}
        height={64}
      />
    </Col>
  </Row>
);

const { TabPane } = Tabs;

const OfflineData = memo(
  ({ activeKey, loading, offlineData, offlineChartData, handleTabChange }) => (
    <Card
      loading={loading}
      className={styles.offlineCard}
      bordered={false}
      style={{ marginTop: 32 }}
    >
      <Tabs activeKey={activeKey} onChange={handleTabChange}>
        {offlineData.map(shop => (
          <TabPane tab={<CustomTab data={shop} currentTabKey={activeKey} />} key={shop.label}>
            <div style={{ padding: '0 24px' }}>
              <TimelineChart
                height={400}
                data={offlineChartData}
                titleMap={{
                  y1: formatMessage({ id: 'app.analysis.traffic' }),
                  y2: formatMessage({ id: 'app.analysis.payments' }),
                }}
              />
            </div>
          </TabPane>
        ))}
      </Tabs>
    </Card>
  )
);

export default OfflineData;
