import React from 'react';
import classNames from 'classnames';
import { renderToString } from 'react-dom/server';
import styles from './icon.less';

const iconfontCache = new Set();

const IconFont = (props) => {
  const {
    scriptUrl = '//at.alicdn.com/t/font_882599_u9y7k3r7kh8.js',
    type,
    className,
  } = props;
  if (!iconfontCache.has(scriptUrl)) {
    const script = document.createElement('script');
    script.setAttribute('src', scriptUrl);
    script.setAttribute('data-namespace', scriptUrl);
    iconfontCache.add(scriptUrl);
    document.body.appendChild(script);
  }
  const cls = classNames({
    anticon: true,
    [`anticon-${type}`]: Boolean(type),
  }, styles.icon , className);
  return (
    <svg
      className={cls}
      aria-hidden="true"
      focusable="false"
    >
      <use xlinkHref={`#${type}`} />
    </svg>
  )
}

const iconTool = type => renderToString(<IconFont type={type} />);

export {
  iconTool,
  IconFont,
};
