import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

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
    this.loginSystemInit();
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

  loginSystemInit() {
    const {
      location: { query, pathname },
      dispatch,
    } = this.props;

    if (query && query.utoken && query.redirect && pathname === '/Exception/403') {
      let { redirect } = query;
      const { utoken } = query;
      if (redirect.indexOf('?') > 0) {
        if (redirect.indexOf('utoken=') < 0) {
          redirect = `${redirect}&utoken=${utoken}`;
        }
      } else {
        redirect = `${redirect}?utoken=${utoken}`;
      }
      window.location.href = redirect;
    }
    if (query && query.utoken) {
      LS.setItem('U_token', query.utoken);
      dispatch(routerRedux.replace(pathname || '/'));
    }
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
