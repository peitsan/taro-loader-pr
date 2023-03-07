import React from 'react';
import { navigateTo } from '@/common/functions/index';
import banner_1 from '@assets/banner/1.jpg';
import banner_2 from '@assets/banner/2.jpg';
import banner_3 from '@assets/banner/3.jpg';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtIndexes, AtTag } from 'taro-ui';
import styles from './index.module.less';
// import ProjectOverview from './projectOverview/index';

const Index: React.FC = () => {
  const Banner = () => {
    const bans = [banner_1, banner_2, banner_3];
    return (
      <Swiper
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        indicatorDots
        autoplay>
        {bans.map((ban, index) => {
          return (
            <SwiperItem key={'banner_' + index}>
              <Image src={ban} className={styles.bannerImg} />
            </SwiperItem>
          );
        })}
      </Swiper>
    );
  };
  const routerToApplication = e => {
    Taro.setStorageSync('ModalName', e.key);
    navigateTo('/home/projectManage/' + e.key);
  };
  const list = [
    {
      title: '普通板块',
      key: '',
      items: [
        {
          key: 'projectOverview',
          name: '工程总览',
        },
      ],
    },
    {
      title: '经理板块',
      key: '',
      items: [
        {
          key: 'projectAudit',
          name: '工程审核',
        },
        {
          key: 'projectHandOver',
          name: '工程移交',
        },
        {
          key: 'threeListAudit',
          name: '清单审核',
        },
        {
          key: 'applyAudit',
          name: '上报审批',
        },
      ],
    },
  ];
  React.useEffect(() => {}, []);
  return (
    <>
      <View className={styles['top']}>
        <AtTag className={styles['tag']} circle>
          工程管理
        </AtTag>
      </View>
      <View className={styles.banner}>
        <Banner />
      </View>
      <View className={styles.list}>
        <AtIndexes
          topKey=''
          isVibrate={false}
          list={list}
          onClick={e => routerToApplication(e)}></AtIndexes>
      </View>
    </>
  );
};
export default Index;
