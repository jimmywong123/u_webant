import React, { PureComponent } from 'react';
import { connect } from 'dva';

import { Layout } from 'antd';
import DocumentMete from 'react-document-meta';
import { ContainerQuery } from 'react-container-query';

import App from '../App';
import SiderMenu from '../SiderMenu'
import LayoutFooter from '../LayoutFooter';

import memoizeOne from 'memoize-one';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import intl from 'react-intl-universal';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';

import { string } from 'util_react_web';
import styles from './index.less';
import Context from './MenuContext';

const { getIntl } = string;

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
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
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

    const title = this.getSystemTitle()
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

  getSystemTitle = () => {
    const { system: { titleKey } } = this.props;
    return getIntl(intl, titleKey, 'Hired, China, Job')
  }

  getMeta = (pathname, breadcrumbNameMap) => {
    const title = this.getPageTitle(pathname, breadcrumbNameMap);
    const { system: { keyworkKey, descriptionKey } } = this.props;
    const keywords = getIntl(intl, keyworkKey, 'Hired, China, Job')
    const description = getIntl(intl, descriptionKey, 'Hired, China, Job')

    return {
      title,
      description,
      meta: {
        name: {
          keywords,
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
      system: { logoUrl, miniLogoUrl, recordCode, copyrightKey },
      navTheme,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      allMenu,
      route: { routes },
      fixedHeader,
      footerLinks,
      social,
      Authorized,
      Exception403,
      LS,
      Header,
      getI18n,
    } = this.props;

    const routerConfig = this.getRouterAuthority(pathname, routes);
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const copyright = getIntl(intl, copyrightKey, '2015 - 2018 HiredChina');

    const layout = (
      <Layout className={styles.layout}>
        {!isMobile ? null : (
          <SiderMenu
            logo={logoUrl}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            title={this.getSystemTitle()}
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
          <LayoutFooter 
            copyright={copyright} 
            recordCode={recordCode} 
            links={footerLinks}
            social={social}
          />
        </Layout>
      </Layout>
    );
    return (
      <App getI18n={getI18n} LS={LS}>
        <DocumentMete {...this.getMeta(pathname, breadcrumbNameMap)}>
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
