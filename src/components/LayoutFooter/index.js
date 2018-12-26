import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '../GlobalFooter';

const { Footer } = Layout;
const FooterView = (props) => (
  <Footer>
    <GlobalFooter
      links={props.links}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> {props.copyright}
        </Fragment>
      }
      patents={
        <a target="_blank" href='http://www.miitbeian.gov.cn/' style={{ color: 'rgba(0, 0, 0, 0.45)'}}>{props.recordCode || '粤ICP备16003809号-2'}</a>
      }
      social={props.social}
    />
  </Footer>
);
export default FooterView;
