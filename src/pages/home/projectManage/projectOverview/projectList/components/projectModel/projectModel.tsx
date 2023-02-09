import React, { useState } from 'react';
import {
  AtIcon,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
} from 'taro-ui';
import { Button, View } from '@tarojs/components';
import { ProjectForm } from '../projectForm/projectForm';
import styles from './projectModel.module.css';

interface IProps {
  selectList: string;
  flushFunction: Function;
}
export const ProjectModel: React.FC<IProps> = ({
  selectList,
  flushFunction,
}: IProps) => {
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
    <>
      <View className={styles['btn-container']}>
        <View className={styles['pass-btn']} onClick={showModal}>
          <AtIcon value='edit' size='18' color='#fff' />
          新建
        </View>
      </View>
      <AtModal
        isOpened={isModalVisible}
        onCancel={handleCancel}
        onClose={handleCancel}>
        <AtModalHeader>{`新建${selectList}`}</AtModalHeader>
        <AtModalContent>
          <ProjectForm
            selectList={selectList}
            handleOk={handleOk}
            showOpen={isModalVisible}
          />
        </AtModalContent>
      </AtModal>
    </>
  );
};
