import React, { PureComponent } from 'react';
import Editor from '@/components/Editor'
import { uploadToken } from '@/services/api';
import { message } from 'antd';
import intl from 'react-intl-universal';
import { string } from 'util_react_web';

const { getIntl } = string;

class EditorPage extends PureComponent {
  state = { initDone: false };

  componentDidMount() {
    uploadToken().then(res => {
      const {
        data: { token, errSms, origin },
      } = res;
      if (errSms) {
        message.error(getIntl(intl, errSms));
      } else {
        this.setState({
          initDone: true,
          token,
          origin,
        });
      }
    });
  }

  render() {
    const { initDone, token, origin } = this.state;
    return (
      initDone &&
      <Editor 
        data={{ token }}
        origin={origin}
      />
    )
  }
  
}


export default EditorPage;