/**
 * Routes: 
 *  - ./src/routes/Authorized.js
 * authority: [ 'logined' ]
 */

import React, { PureComponent } from 'react';
import { Divider, message } from 'antd';
import intl from 'react-intl-universal';
import { connect } from 'dva';
import Cropper from '@/components/Cropper';
import EditableInput from '@/components/Editable/EditableInput';
import styles from './index.less';
import { uploadAttachment, uploadToken } from '@/services/api';

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class Base extends PureComponent {
  state = { initDone: false }

  componentDidMount() {
    uploadToken().then(res => {
      const { data: { token, errSms, origin } } = res;
      if (errSms) {
        message.error(intl.get(errSms));
      } else {
        this.setState({
          initDone: true,
          token,
          origin,
        });
      }
    })
  }

  nicknameSaveHandler = (value) => {
    const { dispatch, currentUser } = this.props;
    if (currentUser.nickname !== value) {
      dispatch({
        type: 'user/updateNickname',
        payload: value,
      })
    }
  }

  onSuccessHandler = (data) => {
    const { origin } = this.state
    const { uuid, title, ret} = data
    const url = `${origin}/${ret.key}`
    const { dispatch } = this.props;
    uploadAttachment({
      uuid, title, url
    }).then(res => {
      const { data: { errSms } } = res;
      if (errSms) {
        message.error(intl.get(errSms));
      }
    })
    dispatch({
      type: 'user/updateHeadimg',
      payload: url,
    })
  }

  render() {
    const { initDone, token } = this.state;
    const { currentUser } = this.props;
    return ( 
      initDone &&
      <Divider orientation="left" className="pt3">
        <Cropper 
          uploadToken={uploadToken}
          onSuccess={this.onSuccessHandler}
          imageUrl={currentUser.headimgurl} 
          avatarClassName={styles.avatarUploader}
          data={{token}}
        />
        <h3>
          <EditableInput 
            value={currentUser.nickname}
            handleSave={this.nicknameSaveHandler}
            size='default'
            width={200}
          />
        </h3>
      </Divider>
    ) 
  } 
}

export default Base;