import React, { FC, useState } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

interface IMessage {
  title: string;
  type?: 'success' | 'error' | 'warning';
  duration?: number;
}

interface IMessageType {
  show: boolean;
  title: string;
  type?: 'success' | 'error' | 'warning';
  duration?: number;
}

export const ComponentMessage: FC<IMessageType> = (props: IMessageType) => {
  const { title, type, duration, show } = props;
  const [isShow, setIsShow] = useState(show);
  React.useEffect(() => {
    setTimeout(() => {
      setIsShow(false);
    }, duration);
  }, []);
  return <View style={{ display: isShow ? 'block' : 'none' }}>{title}</View>;
};

export class Message {
  private static show = false;
  private static messageType: IMessage = {
    title: '',
    type: 'success',
    duration: 1000,
  };

  static ComponentMessage() {
    return <ComponentMessage {...Message.messageType} show={Message.show} />;
  }
  static showMessage(params: IMessage) {
    Message.messageType = params;
    Message.show = true;
  }
}
