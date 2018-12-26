import React, { PureComponent } from 'react';
import LayoutHeader from '@/components/LayoutHeader';
import { connect } from 'dva';
import { getSystemPath } from '@/services/base';

@connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  system: global.system
}))
class HeaderView extends PureComponent {
  render() {
    return (
      <LayoutHeader 
        getSystemPath={getSystemPath}
        {...this.props}
      />
    );
  }
}

export default HeaderView;
