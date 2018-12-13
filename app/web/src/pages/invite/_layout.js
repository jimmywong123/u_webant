import React from 'react';

import { Row, Col } from 'antd';

// require('./jweixin')

export default function(props) {
  const { children } = props
  return (
    <Row type="flex" justify="space-around" align="middle">
      <Col span={24}>
        <div className="loginMain">
          {children}
        </div>
      </Col>
    </Row>
  );
}