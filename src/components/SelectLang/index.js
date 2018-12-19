import React, { PureComponent } from 'react';
import classNames from 'classnames';
import intl from 'react-intl-universal';
import styles from './index.less';
import { url } from 'util_react_web';

export default class SelectLang extends PureComponent {

  render() {
    const { className, LS } = this.props;
    const storage = LS || localStorage
    
    const selectedLang = storage.getItem('lang_type') || 'en-US';
    const canChangeLang = selectedLang === 'en-US' ? 'zh-CN' : 'en-US';
    const { addQuery } = url;
    const uri = addQuery(window.location.href, 'lan', canChangeLang)
    
    return (
      <a
        href={uri}
        className={classNames(className, styles.menu)}
        title={intl.get('languages')}
      >
        {intl.get(canChangeLang)}
      </a>
    );
  }
}
