/**
 * name: 'setting'
 * Routes:
 *  - ./src/routes/Authorized.js
 * authority: [ 'logined' ]
 */

import React, { PureComponent } from 'react';
import { Divider, Layout, Anchor } from 'antd';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import PhoneBind from './PhoneBind';
import EmailBind from './EmailBind';
import WechatBind from './WechatBind';
import Base from './Base';
import DocumentMete from 'react-document-meta';
import { string } from 'util_react_web';

const { getIntl } = string;

const { Content, Sider } = Layout;
const { Link } = Anchor;
@connect(({ global }) => ({ system: global.system }))
class SettingPage extends PureComponent {

  render() {
    const { system: { titleKey } } = this.props;
    
    const sysTitle = getIntl(intl, titleKey, 'HiredChina.com')
    const thisTitle = getIntl(intl, 'loginsys.account.center', 'Account center')
    const title = `${thisTitle} - ${sysTitle}`;

    const meta = {
      title,
      description: thisTitle,
      meta: {
        name: {
          keywords: thisTitle
        }
      }
    }
    
    return (
      <DocumentMete { ...meta }>
        <Layout>
          <Layout>
            <div id="upload-avatar" className={classNames('mb2', 'pr0-sm', 'pr5')}>
              <Base />
            </div>
            <Content>
              <section id="bind-phone">
                <PhoneBind />
              </section>
              <section id="bind-email">
                <EmailBind />
              </section>
              <div id="bind-wechat" className={classNames('py2', 'pr0-sm', 'pr5')}>
                <Divider orientation="right">{getIntl(intl, 'loginsys.bind.wechat', 'Bind wechat')}</Divider>
              </div>
              <section className="mb5" style={{ maxWidth: '500px' }}>
                <WechatBind />
              </section>
            </Content>
          </Layout>
          <Sider className="hide-sm" style={{ background: '#fff' }}>
            <Anchor className="pt5">
              <Link href="#upload-avatar" title={getIntl(intl, 'loginsys.update.avatar', 'Update avatar')} />
              <Link href="#bind-phone" title={getIntl(intl, 'loginsys.bind.phone', 'Bind phone')} />
              <Link href="#bind-email" title={getIntl(intl, 'loginsys.bind.email', 'Bind email')} />
              <Link href="#bind-wechat" title={getIntl(intl, 'loginsys.bind.wechat', 'Bind wechat')} />
            </Anchor>
          </Sider>
        </Layout>
      </DocumentMete>
    )
  }
}

export default SettingPage;
