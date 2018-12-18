import React, { PureComponent } from 'react';
import classNames from 'classnames';
import intl from 'react-intl-universal';
import styles from './index.less';
import { parse, stringify } from 'qs';

export default class SelectLang extends PureComponent {

  render() {
    const { className, LS } = this.props;
    const storage = LS || localStorage
    
    const selectedLang = storage.getItem('lang_type') || 'en-US';
    const canChangeLang = selectedLang === 'en-US' ? 'zh-CN' : 'en-US';

    let url = window.location.href
    console.log('url', url)
    const urlArr = url.split('?')
    if (urlArr.length === 1) {
      url = `${url}?lan=${canChangeLang}`
    } else {
      const parms = parse(urlArr[1])
      parms.lan = canChangeLang
      url = `${urlArr[0]}?${stringify(parms)}`
    }
    
    return (
      <a
        href={url}
        className={classNames(className, styles.menu)}
        title={intl.get('languages')}
      >
        {intl.get(canChangeLang)}
      </a>
    );
  }
}
