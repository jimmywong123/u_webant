import React, { PureComponent } from 'react';
import intl from 'react-intl-universal';
import { Tag, Avatar } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';
import BaseMenu from '../SiderMenu/BaseMenu';
import { getFlatMenuKeys } from '../SiderMenu/SiderMenuUtils';
import { string } from 'util_react_web';

const { getIntl } = string;

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

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

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
      menuData,
      isMobile
    } = this.props;

    const menu = (
      <BaseMenu {...this.props} menuData={menuData.inside} className={styles.menu} selectedKeys={[]} onClick={onMenuClick} mode='vertical' />
    );
    const flatMenuKeys = getFlatMenuKeys(menuData.right || []);
    const noticeData = this.getNoticeData();
    // const unreadMsg = this.getUnreadData(noticeData);
    return (
      <div className={styles.right}>
        { !isMobile && (
          <BaseMenu {...this.props} menuData={menuData.right} flatMenuKeys={flatMenuKeys} style={{display: 'inline-block', verticalAlign: 'middle'}}/>
        )}
        {haveHeaderSearch && (
          <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder={getIntl(intl, 'base.search', 'Search')}
            dataSource={['123', '12314', '2123']}
            onSearch={value => {
              console.log('input', value); // eslint-disable-line
            }}
            onPressEnter={value => {
              console.log('enter', value); // eslint-disable-line
            }}
          />
        )}
        {/*         
        <Tooltip title={getIntl(intl, 'base.help', 'Help')}>
          <a
            target="_blank"
            href="https://pro.ant.design/docs/getting-started"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip> */}
        {currentUser.nickname ? (
          <React.Fragment>
            {haveNotice && (
              <NoticeIcon
                className={styles.action}
                count={currentUser.notifyCount}
                onItemClick={(item, tabProps) => {
                  console.log(item, tabProps); // eslint-disable-line
                }}
                locale={{
                  emptyText: getIntl(intl, 'base.no.notifications', 'No notifications'),
                  clear: getIntl(intl, 'base.clear', 'Clear'),
                }}
                onClear={onNoticeClear}
                onPopupVisibleChange={onNoticeVisibleChange}
                loading={fetchingNotices}
                popupAlign={{ offset: [20, -16] }}
                clearClose
              >
                <NoticeIcon.Tab
                  list={noticeData.notification}
                  title={getIntl(intl, 'base.notification', 'Notification')}
                  name="notification"
                  emptyText={getIntl(intl, 'base.you.have.viewed.all.notifications', 'You have viewed all notifications.')}
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData.message}
                  title={getIntl(intl, 'base.message', 'Message')}
                  name="message"
                  emptyText={getIntl(intl, 'base.you.have.viewed.all.messsages', 'You have viewed all messsages.')}
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                />
              </NoticeIcon>
            )}
            <HeaderDropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar
                  size="small"
                  className={styles.avatar}
                  src={currentUser.headimgurl || 'http://image.hiredchina.com/face_ex.jpg'}
                  alt="avatar"
                />
                <span className={styles.name}>{currentUser.nickname}</span>
              </span>
            </HeaderDropdown>
          </React.Fragment>
        ) : (
          <a href={loginPageUrl || '/user/login'} className={styles.action}>
            {getIntl(intl, 'base.login', 'Login')}
          </a>
        )}
        <SelectLang className={styles.action} />
      </div>
    );
  }
}
