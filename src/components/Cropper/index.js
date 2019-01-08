import React, { PureComponent } from 'react';
import { Icon, Upload, Modal, message, Button } from 'antd';
import Cropper from 'react-cropper';
import lrz from 'lrz';
import intl from 'react-intl-universal';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';
import request from '../_util/request';
import { string } from 'util_react_web';
import styles from './index.less';
import Media from 'react-media';

const { getIntl } = string

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class CropperWidget extends PureComponent {
  reqs = {};

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fileList: [],
      srcCropper: '',
      editImageModalVisible: false,
    };
  }

  hideModal = () => {
    this.setState({
      editImageModalVisible: false,
      loading: false,
    });
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }
  };

  // 点击保存的函数，需要在这里进行压缩
  saveImg = () => {
    const { fileList } = this.state;
    const { onSuccess, action, name, data } = this.props;
    lrz(this.cropper.getCroppedCanvas().toDataURL(), { quality: 0.6 }).then(results => {
      const lrzImg = new File([results.file], fileList[0].name, { type: fileList[0].type });

      const { uid } = fileList[0];

      this.reqs[uid] = request({
        action: action || 'http://upload-z2.qiniup.com',
        filename: name || 'file',
        file: lrzImg,
        data,
        onProgress: e => {
          this.upload.onProgress(e, lrzImg);
        },
        onSuccess: ret => {
          delete this.reqs[uid];

          if (onSuccess) {
            onSuccess({
              uuid: uid,
              title: fileList[0].name,
              ret,
            });
          }
          this.setState({
            editImageModalVisible: false,
            srcCropper: '',
            loading: false,
          });
        },
        onError: err => {
          delete this.reqs[uid];
          message.error(err);
        },
      });
      this.upload.onStart(lrzImg);
    });
  };

  beforeUpload = file => {
    const { maxSize, imgType = 'jpeg|png|jpg' } = this.props;
    const isJPG = imgType.toLowerCase().indexOf(file.type.toLowerCase().replace('image/', '')) >= 0;
    if (!isJPG) {
      message.error(getIntl(intl, 'base.you.can.only.upload.img.file', `You can only upload ${imgType} file!`, { type: imgType }));
    }
    const isLtM = file.size / 1024 / 1024 < (maxSize || 10);
    if (!isLtM) {
      message.error(getIntl(intl, 'base.image.must.smaller.than.num.mb', `Image must smaller than ${maxSize}MB!`, { num: maxSize }));
    }
    getBase64(file, imgUrl =>
      this.setState({
        srcCropper: imgUrl, // cropper的图片路径
        editImageModalVisible: true, // 打开控制裁剪弹窗的变量，为true即弹窗
        fileList: [file],
      })
    );
    this.setState({ loading: true });
    return false;
  };

  handleRotate = () => {
    this.cropper.rotate(90);
  };

  render() {
    const { editImageModalVisible, srcCropper, loading } = this.state;
    const {
      viewMode,
      dragMode,
      aspectRatio,
      height,
      width,
      baseSize,
      imageUrl,
      avatarClassName,
      autoCropArea,
      isMobile
    } = this.props;

    let { 
      minCanvasHeight,
      minCanvasWidth,
      minContainerWidth,
      minContainerHeight,
    } =this.props;

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{getIntl(intl, 'base.upload', 'Upload')}</div>
      </div>
    );
    let thisBaseSize = baseSize || 450;
    if (isMobile) {
      minCanvasHeight = minContainerHeight = document.body.offsetHeight - 53;
      minCanvasWidth = minContainerWidth = document.body.offsetWidth;
      thisBaseSize = '100%'
    }
    const footer = (
      <div style={{ textAlign: 'center' }}>
        <Button style={{ float: 'left' }} onClick={this.hideModal}>
          {getIntl(intl, 'base.cancel', 'Cancel')}
        </Button>
        <Button type="dashed" onClick={this.handleRotate}>
          <Icon type="retweet" />
        </Button>
        <Button style={{ float: 'right' }} onClick={this.saveImg}>
          {getIntl(intl, 'base.save', 'Save')}
        </Button>
      </div>
    );
    return (
      <div className={styles.main}>
        <Upload
          ref={node => {
            this.upload = node;
          }}
          listType="picture-card"
          className={avatarClassName}
          showUploadList={false}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
        </Upload>
        <Modal visible={editImageModalVisible} footer={footer} closable={false}>
          <Cropper
            ref={node => {
              this.cropper = node;
            }}
            src={srcCropper}
            viewMode={viewMode || 2} // 定义cropper的视图模式 可选 0, 1, 2, 3 （0 不限制，1 图片原始大小显示，2 按照图片的最长一边填充，3 按照图片最短一边填充）
            dragMode={dragMode || 'crop'} // 裁剪时图片是否可以移动 可选 'crop', 'move'
            aspectRatio={aspectRatio || 1 / 1} // 裁剪的比例，16:9, 4:3, 1:1, 2:3
            style={{
              height: height || thisBaseSize,
              width: width || thisBaseSize,
              margin: '0 auto',
            }}
            minCanvasWidth={minCanvasWidth || thisBaseSize}
            minCanvasHeight={minCanvasHeight || thisBaseSize}
            minContainerWidth={minContainerWidth || thisBaseSize}
            minContainerHeight={minContainerHeight || thisBaseSize}
            autoCropArea={autoCropArea || 1}
            // preview='.cropper-preview'
          />
          {/* <div className="cropper-preview" style={{ width: '300px', height: '300px', overflow: 'hidden'}} /> */}
        </Modal>
      </div>
    );
  }
}

export default (props) => (
  <Media query="(max-width: 599px)">
    {isMobile => <CropperWidget {...props} isMobile={isMobile} />}
  </Media>
)
  
