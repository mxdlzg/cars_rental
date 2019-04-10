import { Tag } from 'antd';
import React from "react";

const { CheckableTag } = Tag;

class CheckTag extends React.Component {
    state = { checked: false };

    handleChange = (checked) => {
        this.setState({ checked });
    };

    render() {
        const {checked} = this.props;
        return (
            <CheckableTag {...this.props} checked={checked} />
        );
    }
}

export default CheckTag;