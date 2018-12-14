import React, { PureComponent } from 'react';
import classNames from 'classnames';
import intl from 'react-intl-universal';
import styles from './index.less';

const getLocale = () => localStorage.getItem('lang_type') || 'en-US';

export default class SelectLang extends PureComponent {
  render() {
    const { className } = this.props;
    const selectedLang = getLocale();
    const canChangeLang = selectedLang === 'en-US' ? 'zh-CN' : 'en-US';
    return (
      <a
        href={`?lan=${canChangeLang}`}
        className={classNames(className, styles.menu)}
        title={intl.get('languages')}
      >
        {intl.get(canChangeLang)}
      </a>
    );
  }
}
