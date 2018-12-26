import React, { PureComponent } from 'react';
import intl from 'react-intl-universal';
import { Layout, message } from 'antd';
import Animate from 'rc-animate';
import GlobalHeader from '../GlobalHeader';
import TopNavHeader from '../TopNavHeader';
import { stringify } from 'qs';
import styles from './index.less';
import { string, url } from 'util_react_web';

const { getIntl } = string;
const { getPageQuery } = url;

const { Header } = Layout;

class LayoutHeader extends PureComponent {
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
    const { getSystemPath } = this.props;
    if (getSystemPath) {
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
        const updateState = {
          initDone: true,
          loginPageUrl,
        };
        this.setState(updateState);
      });
    } else {
      const updateState = {
        initDone: true,
        loginPageUrl: '/user/login',
      };
      this.setState(updateState);
    }
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, fixedHeader } = this.props;
    if (isMobile || !fixedHeader ) {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleNoticeClear = noticeKey => {
    message.success(`${getIntl(intl, 'base.cleared', 'Cleared')} ${getIntl(intl, 'base.noticeKey')}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: noticeKey,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
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
        } else if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        } else if (scrollTop < 300 && !visible) {
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
    const { isMobile, handleMenuCollapse, fixedHeader, system: {title} } = this.props;
    const { visible, initDone, loginPageUrl } = this.state;
    const width = this.getHeadWidth();

    const HeaderDom = visible ? (
      <div className={styles.header}>
        <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
          {isMobile ? (
            <GlobalHeader
              loginPageUrl={loginPageUrl}
              onCollapse={handleMenuCollapse}
              onNoticeClear={this.handleNoticeClear}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              title={title}
              {...this.props}
            />
          ) : (
            <TopNavHeader
              title={title}
              loginPageUrl={loginPageUrl}
              mode="horizontal"
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

export default LayoutHeader;
