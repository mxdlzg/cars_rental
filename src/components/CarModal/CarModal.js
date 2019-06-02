import {Form} from "antd/lib/index";
import {Modal, Spin, Tag} from "antd";
import React from "react";
import DescriptionList from "@/components/DescriptionList/DescriptionList";
import Description from "@/components/DescriptionList/Description";
import PageHeader from "@/components/PageHeader/index";
import {connect} from "dva/index";
import styles from "@/pages/index.less";

@connect(({index, loading}) => ({
    index,
    carDetailLoading: loading.effects['index/fetchCarDetail'],
}))
@Form.create()
class CreateForm extends React.PureComponent{

    getModalContent = () => {
        const {carDetailLoading} = this.props;
        const {currentCarDetail} = this.props.index;
        return (
            <div style={{textAlign: "center"}}>
                {carDetailLoading || !currentCarDetail ?
                    <Spin/>
                    : <PageHeader
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

    render(){
        const {modalVisible,handleCancel} = this.props;
        let done = false;
        return (
            <Modal
                title="车辆详情"
                width={840}
                bodyStyle={done ? {padding: '72px 0'} : {padding: '28px 0 0'}}
                destroyOnClose
                visible={modalVisible}
                onOk={handleCancel}
                onCancel={handleCancel}
            >
                {this.getModalContent()}
            </Modal>
        );
    }
}

export default CreateForm;