import React, { PureComponent } from 'react';
import intl from 'react-intl-universal';
import { Tag, Menu, Icon, Dropdown, Avatar } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';
import faceEx from '../../assets/face_ex.jpg';

export default class GlobalHeaderRight extends PureComponent {
  
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      haveHeaderSearch,
      haveNotice,
      loginPageUrl,
      settingUrl,
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <a href={settingUrl || '/setting'}>
            <Icon type="user" />
            {intl.get('account.center')}
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          {intl.get('logout')}
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();

    return (
      <div className={styles.right}>
        {
          haveHeaderSearch && (
            <HeaderSearch
              className={`${styles.action} ${styles.search}`}
              placeholder={intl.get('search')}
              dataSource={[
                '123',
                '12314',
                '2123',
              ]}
              onSearch={value => {
                console.log('input', value); // eslint-disable-line
              }}
              onPressEnter={value => {
                console.log('enter', value); // eslint-disable-line
              }}
            />
          )
        }
        {/*         
        <Tooltip title={intl.get('help')}>
          <a
            target="_blank"
            href="https://pro.ant.design/docs/getting-started"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip> */}
        {
          currentUser.nickname ? (
            <div>
              {
                haveNotice && (
                  <NoticeIcon
                    className={styles.action}
                    count={currentUser.notifyCount}
                    onItemClick={(item, tabProps) => {
                    console.log(item, tabProps); // eslint-disable-line
                  }}
                    locale={{
                    emptyText: intl.get('no.notifications'),
                    clear: intl.get('Clear'),
                  }}
                    onClear={onNoticeClear}
                    onPopupVisibleChange={onNoticeVisibleChange}
                    loading={fetchingNotices}
                    popupAlign={{ offset: [20, -16] }}
                    clearClose
                  >
                    <NoticeIcon.Tab
                      list={noticeData.notification}
                      title={intl.get('notification')}
                      name="notification"
                      emptyText={intl.get('you.have.viewed.all.')}
                      emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                    />
                    <NoticeIcon.Tab
                      list={noticeData.message}
                      title={intl.get('message')}
                      name="message"
                      emptyText={intl.get('you.have.viewed.all.1542349435507')}
                      emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                    />
                  </NoticeIcon>
                )
              }
              
              <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Avatar
                    size="small"
                    className={styles.avatar}
                    src={currentUser.headimgurl || faceEx}
                    alt="avatar"
                  />
                  <span className={styles.name}>{currentUser.nickname}</span>
                </span>
              </Dropdown>
            </div>
          ) : (
            <a
              href={loginPageUrl || '/user/login'}
              className={styles.action}
            >
              {intl.get('login')}
            </a>
          )
        }
        <SelectLang className={styles.action} />
      </div>
    );
  }
}
