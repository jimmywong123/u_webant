import React, { Fragment } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Icon, Row, Col, Divider } from 'antd';
import intl from 'react-intl-universal';
import { string } from 'util_react_web';

const { getIntl } = string;

const getLink = link => {
  const { key, title, href, blankTarget, icon, img, rel, rev} = link;
  const i18nStr = getIntl(intl, title, title)
  let retrunValue = i18nStr;
  if (icon) {
    retrunValue = (
      <Fragment>
        <Icon type={icon} /> {retrunValue}
      </Fragment>
    )
  }
  if (img) {
    retrunValue = (
      <Fragment>
        <h4>{retrunValue}</h4>
        <div className={styles.img}>
          <img src={img} title={i18nStr} />
        </div>
      </Fragment>
    )
  }
  if (href) {
    retrunValue = (<a
      key={key}
      title={i18nStr}
      target={blankTarget ? '_blank' : '_self'}
      href={href}
      rel={rel} 
      rev={rev}
    >
      {retrunValue}
    </a>)
  }

  return retrunValue;
}

const GlobalFooter = ({ className, links, copyright, social, patents }) => {
  const clsString = classNames(styles.globalFooter, className);
  const socialTitle1 = getIntl(intl, 'base.find.us.on', 'Find us on');
  const socialTitle2 = getIntl(intl, 'base.social.media', 'social media:');

  let colSpan = 4
  if (links) {
    colSpan = parseInt(24 / links.length) 
  }

  return (
    <footer className={clsString}>
      {links && (
        <div className={styles.links}>
          <div className="hide-sm">
            <Row type="flex" justify="space-around" style={{ maxWidth: '1024px', margin: '0 auto'}}>
            {links.map(link => (
              <Col span={colSpan}>
                <ul>
                  <li key={`${link.title}${link.href}`}>
                    <h3>
                      {getLink(link)}
                    </h3>
                  </li>
                  {link.children && (
                    link.children.map( childrenLink => (
                      <li key={`${childrenLink.title}${childrenLink.href}`}>
                        {getLink(childrenLink)}
                      </li>
                    ))
                  )}
                </ul>
              </Col>
            ))}
            </Row>
          </div>
          
          <div className='block-sm u-hide'>
            {links.map( (link ,i ) => (
              <Fragment>
                { i > 0 && (
                <Divider type="vertical" />
                )}
                <a
                  key={link.key}
                  title={getIntl(intl, link.title, link.title)}
                  target={link.blankTarget ? '_blank' : '_self'}
                  href={link.href}
                >
                  {getIntl(intl, link.title, link.title)}
                </a>
              </Fragment>
              
            ))}
          </div>
        </div>
      )}
      {social && (
        <div>
          <h3 className={styles.socialTitle1}>{socialTitle1} <span className={styles.socialTitle2}>{socialTitle2}</span></h3>
          { social.map( link => (
            <a
              key={link.icon}
              title={link.icon}
              target='_blank'
              href={link.href}
              className={styles.socialIcon}
            >
              <Icon type={link.icon} />
              <span className={styles.srOnly}>{link.icon}</span>
            </a>
          ))}
        </div>
      )}
      {copyright && <p className={styles.copyright}>{copyright}</p>}
      {patents && <p className={styles.patents}>{patents}</p>}
    </footer>
  );
};

export default GlobalFooter;
