import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button } from 'antd';
import Link from 'umi/link';
import Result from '@/components/Result';
import styles from './RegisterResult.less';

const actions = (//TODO::重定向到目标邮箱
    <div className={styles.actions}>
            <Button size="large" type="primary">
                <FormattedMessage id="app.register-result.view-mailbox" />
            </Button>
        <Link to="/user/login">
            <Button size="large">
                <FormattedMessage id="app.register-result.back-login" />
            </Button>
        </Link>
    </div>
);

const RegisterResult = ({ location }) => (
    <Result
        className={styles.registerResult}
        type="success"
        title={
            <div className={styles.title}>
                <FormattedMessage
                    id="app.register-result.msg"
                    values={{ email: location.state ? location.state.account : 'AntDesign@example.com' }}
                />
            </div>
        }
        description={formatMessage({ id: 'app.register-result.activation-email' })}
        actions={actions}
        style={{ marginTop: 56,marginBottom:56 }}
    />
);

export default RegisterResult;