import React, { useState } from "react";
import Taro, { getStorageSync } from "@tarojs/taro";
import {
    AtModal,
    AtModalHeader,
    AtModalContent,
} from 'taro-ui';
import { View, Button } from '@tarojs/components'
import { ProjectForm } from '../projectForm'
import styles from './index.module.less'

interface IProps {
    refresh: Function;
}

export const ProjectModel: React.FC<IProps> = ({ refresh }: IProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [flag, setFlag] = useState(false);
    let permission;
    try {
        permission = Taro.getStorageSync('permission')
        if (permission) { }
    } catch (e) {
        permission = null;
    }

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        setIsModalVisible(false)
    }

    const handleReq = () => {
        setIsModalVisible(false);
        setFlag(!flag)
        refresh(!flag)
    }

    return (
        <View>
            {permission ? (
                <Button
                    type="primary"
                    onClick={showModal}
                    size="default"
                    className={styles['new-btn']}
                >
                    新建
                </Button>
            ) : null}

            <AtModal isOpened={isModalVisible} onClose={handleOk}>
                <AtModalHeader>新建工程</AtModalHeader>
                <AtModalContent>
                    <ProjectForm handleReq={handleReq} />
                </AtModalContent>
            </AtModal>
        </View>
    )
}