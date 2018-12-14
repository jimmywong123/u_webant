import React, { PureComponent } from 'react';
import intl from 'react-intl-universal';
import { Layout, message } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import { stringify } from 'qs';
import styles from './Header.less';
import Authorized from '@/utils/Authorized';
import { getSystemPath } from '@/services/base';
import { getPageQuery } from '@/utils';

const { Header } = Layout;

@connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))
class HeaderView extends PureComponent {
  state = {
    visible: true,
    initDone: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    this.getLoginPageUrl();
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getLoginPageUrl() {
    getSystemPath('loginweb').then(res => {
      const { data } = res;
      const { href } = window.location;
      const redirectUrlParams = new URL(href);
      const params = getPageQuery();
      let { redirect } = params;
      if (!redirect) {
        redirect = window.location.href;
      }
      const loginPageUrl =
        redirectUrlParams.origin === data
          ? `${data}/user/login`
          : `${data}/user/login?${stringify({ redirect })}`;
      const settingUrl =
        redirectUrlParams.origin === data
          ? `${data}/setting`
          : `${data}/setting?${stringify({ redirect })}`;
      const updateState = {
        initDone: true,
        loginPageUrl,
        settingUrl,
      };
      this.setState(updateState);
    });
  }

  handleNoticeClear = noticeKey => {
    message.success(`${intl.get('cleared')} ${noticeKey ? intl.get(noticeKey) : ''}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: noticeKey,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    // TODO
    // if (key === 'userCenter') {
    //   router.push('/account/center');
    //   return;
    // }
    // TODO
    // if (key === 'userinfo') {
    //   router.push('/account/settings/base');
    //   return;
    // }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        }
        if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        }
        if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  render() {
    const { isMobile, handleMenuCollapse } = this.props;
    const { visible, initDone, loginPageUrl, settingUrl } = this.state;
    const HeaderDom = visible ? (
      <div className={styles.header}>
        <Header style={{ padding: 0, width: '100%' }}>
          {isMobile ? (
            <GlobalHeader
              loginPageUrl={loginPageUrl}
              settingUrl={settingUrl}
              onCollapse={handleMenuCollapse}
              onNoticeClear={this.handleNoticeClear}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              {...this.props}
            />
          ) : (
            <TopNavHeader
              loginPageUrl={loginPageUrl}
              settingUrl={settingUrl}
              mode="horizontal"
              Authorized={Authorized}
              onCollapse={handleMenuCollapse}
              onNoticeClear={this.handleNoticeClear}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              {...this.props}
            />
          )}
        </Header>
      </div>
    ) : null;
    return (
      initDone && (
        <Animate component="" transitionName="fade">
          {HeaderDom}
        </Animate>
      )
    );
  }
}

export default HeaderView;
