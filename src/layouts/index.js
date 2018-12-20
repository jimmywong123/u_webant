import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Layout } from 'antd';
import DocumentMete from 'react-document-meta';
import { ContainerQuery } from 'react-container-query';

import Authorized from '@/utils/Authorized';
import Exception403 from '@/pages/Exception/403';
import App from '@/components/App';
import SiderMenu from '@/components/SiderMenu';

import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';

import memoizeOne from 'memoize-one';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import intl from 'react-intl-universal';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { LS } from '@/utils';

import { getI18n } from '@/services/base';

import styles from './index.less';

const { Content } = Layout;

const screenQuery = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends PureComponent {
  constructor(props) {
    super(props);

    this.loginSystemInit();

    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    isMobile: false,
  };

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

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
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

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  getRouterAuthority = (pathname, routeData) => {
    let routeAuthority = ['noAuthority'];
    const getAuthority = (key, routes) => {
      routes.map(route => {
        if (route.path && pathToRegexp(route.path).test(key)) {
          routeAuthority = route.authority;
        } else if (route.routes) {
          routeAuthority = getAuthority(key, route.routes);
        }
        return route;
      });
      return routeAuthority;
    };
    return getAuthority(pathname, routeData);
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
      position: 'relative',
    };
  };

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    const { system: { titleKey } } = this.props;
    let title = 'HiredChina.com';
    if(titleKey) {
      title = intl.get(titleKey)
    }
    if (!currRouterData) {
      return title;
    }
    const {locale, name} = currRouterData;
    let message = locale || name || title
    if (locale || name) {
      message = intl.get(locale) || intl.get(name);
      return `${message} - ${title}`;
    }
    return title;
  };

  getMeta = (pathname, breadcrumbNameMap) => {
    const title = this.getPageTitle(pathname, breadcrumbNameMap);

    const { system: { keyworkKey, descriptionKey } } = this.props;
    return {
      title,
      description: descriptionKey && intl.get(descriptionKey),
      meta: {
        name: {
          keywords: keyworkKey && intl.get(keyworkKey)
        }
      }
    };
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const {
      system: { logoUrl, miniLogoUrl, titleKey },
      navTheme,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      allMenu,
      route: { routes },
      fixedHeader,
    } = this.props;

    const routerConfig = this.getRouterAuthority(pathname, routes);
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout className={styles.layout}>
        {!isMobile ? null : (
          <SiderMenu
            logo={logoUrl}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            titleKey={titleKey}
            allMenu={allMenu}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={isMobile ? miniLogoUrl : logoUrl}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={styles.content} style={contentStyle}>
            <Authorized
              authority={routerConfig && routerConfig.authority}
              noMatch={<Exception403 />}
            >
              {children}
            </Authorized>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <App getI18n={getI18n} LS={LS}>
        <DocumentMete { ...this.getMeta(pathname, breadcrumbNameMap) }>
          <ContainerQuery query={screenQuery}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentMete>
      </App>
    );
  }
}

export default connect(({ global,  menu }) => ({
  collapsed: global.collapsed,
  system: global.system,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  allMenu: menu.allMenu
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
