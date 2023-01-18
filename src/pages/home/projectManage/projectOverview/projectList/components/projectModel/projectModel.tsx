import React, { useState } from 'react';
import { AtButton, AtIcon, AtModal } from 'taro-ui';
import { View } from '@tarojs/components';
import { ProjectForm } from '../projectForm/projectForm';
import styles from './projectModel.module.css';

interface IProps {
  indexKey: number;
  flushFunction: Function;
}
export const ProjectModel: React.FC<IProps> = ({
  indexKey,
  flushFunction,
}: IProps) => {
  const modelType = ['问题', '协议', '手续'];
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (flush: boolean) => {
    flushFunction(flush);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <View>
      <AtIcon value='edit' size='30' color='#F00' />
      <AtButton
        type='primary'
        size='normal'
        className={styles['ant-btn-primary']}
        onClick={showModal}>
        新建
      </AtButton>
      <AtModal
        title={`新建${modelType[indexKey - 2]}清单`}
        isOpened={isModalVisible}
        onCancel={handleCancel}>
        <ProjectForm indexKey={indexKey} handleOk={handleOk} />
      </AtModal>
    </View>
  );
};
