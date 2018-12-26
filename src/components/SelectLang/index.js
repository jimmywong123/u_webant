import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import intl from 'react-intl-universal';
import styles from './index.less';
import { url, string } from 'util_react_web';

const { getIntl } = string;

export default class SelectLang extends PureComponent {

  onClick = (lan) => {
    const { addQuery } = url;
    const href = addQuery(window.location.href, 'lan', lan)
    window.location.href = href
  }

  render() {
    const { className, LS } = this.props;
    const storage = LS || localStorage
    const { getPageQuery, fixLan } = url;
    const { lan } = getPageQuery();
    let selectedLang = lan || storage.getItem('lang_type') || 'en-US';
    selectedLang = fixLan( { lan: selectedLang });
    
    const clz = classNames(className, styles.menu)
    return (
      <Fragment>
        <a
          onClick={ () => this.onClick('en-US') }
          className={clz}
          title={getIntl(intl, 'base.languages', 'Languages' )}
          style={{marginRight: '0', color: selectedLang === 'en-US'? '#52c41a': 'rgba(0, 0, 0, 0.65)'}}
        >
          {getIntl(intl, 'base.en-US', 'EN' ) }
        </a>/
        <a
          onClick={ () => this.onClick('zh-CN') }
          className={clz}
          title={getIntl(intl, 'base.languages', 'Languages' )}
          style={{color: selectedLang === 'zh-CN'? '#52c41a': 'rgba(0, 0, 0, 0.65)'}}
        >
          {getIntl(intl, 'base.zh-CN', '中文' ) }
        </a>
      </Fragment>
      
    );
  }
}
