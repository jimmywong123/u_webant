import React, { PureComponent } from 'react';
import DocumentMete from 'react-document-meta';
import { ContainerQuery } from 'react-container-query';
import { Layout } from 'antd';
import memoizeOne from 'memoize-one';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import intl from 'react-intl-universal';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Authorized from '@/utils/Authorized';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '@/pages/Exception/403';
import style from './index.less';
import { LS } from '@/utils';
import { getI18n } from '@/services/base';
import App from '@/components/App';

const { Content } = Layout;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: intl.get(locale),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}
const memoizeOneFormatter = memoizeOne(formatter, isEqual);

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

@connect(({ global }) => ({
  collapsed: global.collapsed,
  system: global.system
}))
class BasicLayout extends PureComponent {
  constructor(props) {
    super(props);

    const {
      location: { query, pathname },
      dispatch,
    } = props;
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
      dispatch(routerRedux.replace(pathname || '/user'));
    }

    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    isMobile: false,
    menuData: this.getMenuData(),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'global/fetchSystem',
    });
    // dispatch({
    //   type: 'setting/getSetting',
    // });

    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const {
      route: { routes },
    } = this.props;
    return memoizeOneFormatter(routes);
  }

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

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);
    const { system: { titleKey } } = this.props;
    let title = 'HiredChina.com';
    if(titleKey) {
      title = intl.get(titleKey)
    }
    if (!currRouterData) {
      return title;
    }
    const message = intl.get(currRouterData.locale || currRouterData.name);
    return `${message} - ${title}`;
  };

  getMeta = pathname => {
    const title = this.getPageTitle(pathname);

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

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  render() {
    const {
      children,
      location: { pathname },
      system
    } = this.props;
    const { logoUrl } = system
    const { isMobile, menuData } = this.state;
    const routerConfig = this.matchParamsPath(pathname);

    const layout = (
      <Layout className={style.layout}>
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logoUrl}
            isMobile={isMobile}
            {...this.props}
          />
          <Content style={this.getContentStyle()}>
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
        <DocumentMete { ...this.getMeta(pathname) }>
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

export default BasicLayout;
