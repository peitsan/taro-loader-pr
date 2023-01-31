import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import React, { PureComponent } from 'react';
import { AtImagePicker, AtButton } from 'taro-ui';

import docx from './docx.png';

class UploadBtn extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileNum: 0,
      files: [],
      showUploadBtn: false,
      upLoadImg: [],
    };
  }
  componentWillMount() {
    this.setState({
      fileNum: this.props.chooseImg.fileNum,
      files: this.props.chooseImg.files,
      showUploadBtn: this.props.chooseImgshowUploadBtn,
      upLoadImg: this.props.chooseImg.upLoadImg,
    });
  }

  onChange(v, doType, index) {
    this.props.onFilesValue(v);
    console.log(2, v); // doType代表操作类型，移除图片和添加图片,index为移除图片时返回的图片下标
    if (doType === 'remove') {
      this.setState(
        prevState => {
          let oldSendImg = prevState.upLoadImg;
          oldSendImg.splice(oldSendImg[index], 1); // 删除已上传的图片地址
          return {
            files: v,
            upLoadImg: oldSendImg,
          };
        },
        () => {
          const { files } = this.state;
          if (files.length === this.state.fileNum) {
            // 最多三张图片 隐藏添加图片按钮
            this.setState({
              showUploadBtn: false,
            });
          } else if (files.length === 0) {
            this.setState({
              upLoadImg: [],
            });
          } else {
            this.setState({
              showUploadBtn: true,
            });
          }
        },
      );
    } else {
      console.log(1, v);
      v.map((item, index) => {
        if (item.url.indexOf('.docx') > -1 || item.url.indexOf('.DOCX') > -1) {
          v[index].url = docx;
        }
      });
      this.setState(
        () => {
          return {
            files: v,
          };
        },
        () => {
          const { files } = this.state;
          if (files.length === 3) {
            // 最多三张图片 隐藏添加图片按钮
            this.setState({
              showUploadBtn: false,
            });
          } else {
            this.setState({
              showUploadBtn: true,
            });
          }
        },
      );
    }
  }
  // 选择失败回调
  onFail(mes) {
    console.log(mes);
  }
  // 点击图片回调
  onImageClick(index, file) {
    let imgs = [];
    this.state.files.map((item, index) => {
      imgs.push(item.file.path);
    });
    if (imgs[index].indexOf('.pdf') > -1 || imgs[index].indexOf('.PDF') > -1) {
      Taro.downloadFile({
        url: imgs[index],
        success: function (res) {
          let filePath = res.tempFilePath;
          Taro.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功');
            },
          });
        },
      });
    } else {
      Taro.previewImage({
        //当前显示图片
        current: imgs[index],
        //所有图片
        urls: imgs,
      });
    }
  }

  render() {
    return (
      <View>
        <AtImagePicker
          multiple={false}
          length={3} //单行的图片数量
          files={this.state.files}
          onChange={this.onChange.bind(this)}
          onFail={this.onFail.bind(this)}
          onImageClick={this.onImageClick.bind(this)}
          showAddBtn={this.state.showUploadBtn} //是否显示添加图片按钮
        />
      </View>
    );
  }
}

export default UploadBtn;
