import React, { useState } from 'react';
import { AtIcon } from 'taro-ui';
import { Modal, Button } from 'antd-mobile';
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
    <div>
      <Button
        type='primary'
        size='large'
        className={styles['ant-btn-primary']}
        onClick={showModal}
        icon={<AtIcon value='edit' size='30' color='#F00' />}>
        新建
      </Button>
      <Modal
        title={`新建${modelType[indexKey - 2]}清单`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}>
        <ProjectForm indexKey={indexKey} handleOk={handleOk} />
      </Modal>
    </div>
  );
};
