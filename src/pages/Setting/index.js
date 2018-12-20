/**
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
import DocumentTitle from 'react-document-title';
import DocumentMete from 'react-document-meta';

const { Content, Sider } = Layout;
const { Link } = Anchor;
@connect(({ global }) => ({ system: global.system }))
class SettingPage extends PureComponent {

  render() {
    const { system: { titleKey } } = this.props;
    const title = `${intl.get('account.center')} - ${intl.get(titleKey)}`;
    
    const meta = {
      title,
      description: intl.get('account.center'),
      meta: {
        name: {
          keywords: intl.get('account.center')
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
                <Divider orientation="right">{intl.get('bind.wechat')}</Divider>
              </div>
              <section className="mb5" style={{ maxWidth: '500px' }}>
                <WechatBind />
              </section>
            </Content>
          </Layout>
          <Sider className="hide-sm" style={{ background: '#fff' }}>
            <Anchor className="pt5">
              <Link href="#upload-avatar" title={intl.get('update.avatar')} />
              <Link href="#bind-phone" title={intl.get('bind.phone')} />
              <Link href="#bind-email" title={intl.get('bind.email')} />
              <Link href="#bind-wechat" title={intl.get('bind.wechat')} />
            </Anchor>
          </Sider>
        </Layout>
      </DocumentMete>
    )
  }
}

export default SettingPage;
