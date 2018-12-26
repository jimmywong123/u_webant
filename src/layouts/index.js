import React, { PureComponent } from 'react';
import { connect } from 'dva';

import Authorized from '@/utils/Authorized';
import Exception403 from '@/pages/Exception/403';

import LayoutBase from '@/components/LayoutBase';

import Header from './Header';

import Media from 'react-media';
import { LS } from '@/utils';

import { getI18n } from '@/services/base';

class BasicLayout extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { 
      dispatch,
      route: { authority },
    } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'global/fetchSystem',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: { authority },
    });
  }

  render() {
    
    return (
      <LayoutBase 
        Authorized={Authorized}
        Exception403={Exception403}
        LS={LS}
        Header={Header}
        getI18n={getI18n}
        { ...this.props }
      />
    );
  }
}

export default connect(({ 
  global: {collapsed, system, social, footerLinks}, 
  menu: {menuData, breadcrumbNameMap, allMenu} 
}) => ({
  collapsed, system, menuData, breadcrumbNameMap, allMenu, social, footerLinks
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
