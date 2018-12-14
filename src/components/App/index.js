import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { LocaleProvider } from 'antd';

// 设置国际化
import enUS from 'antd/lib/locale-provider/en_US';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const fixLan = lan => {
  const arr = lan.split('-');
  return `${arr[0]}-${arr[1].toUpperCase()}`;
};

class App extends Component {
  state = { initDone: false };

  componentDidMount() {
    this.loadLocales();
  }

  uploadLocaleType = changeTo => {
    const { LS } = this.props;
    if (LS) {
      LS.setItem('lang_type', changeTo);
    }
  };

  getCurrentLocale = () => {
    let currentLocale = intl.determineLocale({
      urlLocaleKey: 'lan',
      cookieLocaleKey: 'lan',
    });
    const { LS } = this.props;
    if (LS) {
      currentLocale = currentLocale || LS.getItem('lang_type');
    }
    currentLocale = currentLocale || 'en-US';

    currentLocale = fixLan(currentLocale);
    this.uploadLocaleType(currentLocale);
    return currentLocale;
  };

  getLocale = () => (this.getCurrentLocale() === 'en-US' ? enUS : zhCN);

  loadLocales() {
    const currentLocale = this.getCurrentLocale();
    const { getI18n } = this.props;
    if (getI18n) {
      getI18n(currentLocale)
        .then(res => {
          if (res) {
            intl.init({
              currentLocale,
              locales: {
                [currentLocale]: res.data,
              },
            });
          }
        })
        .then(() => {
          this.setState({ initDone: true });
        });
    } else {
      this.setState({ initDone: true });
    }
  }

  render() {
    const { initDone } = this.state;
    const { children } = this.props;
    return initDone && <LocaleProvider locale={this.getLocale()}>{children}</LocaleProvider>;
  }
}

export default App;
