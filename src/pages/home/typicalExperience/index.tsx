import { useState, useEffect, useRef } from 'react';
import {
  AtLoadMore,
  AtMessage,
  AtModal,
  AtTabs,
  AtTabsPane,
  AtTag,
} from 'taro-ui';
import { View } from '@tarojs/components';
import { message, navigateTo } from '../../..//common/functions/index';
import { tabListItem, DataType } from './indexProps';
import httpUtil from '../../../utils/httpUtil';
import TableForExperience from '../../../common/components/TableForExperience/index';
import TypicalExperienceDetail from '../../../common/components/TableForExperience/TypicalExperienceDetail';
import styles from './index.module.less';

const TypicalExperience: React.FC = () => {
  const confirmModalRef = useRef<any>();
  // const { params } = getCurrentInstance(); //获取路由传入的index参数
  const [loading, setLoading] = useState<Boolean>(true);
  const [other, setOther] = useState([]);
  const [safe, setSafe] = useState([]);
  const [experience, setExperience] = useState([]);
  const [design, setDesign] = useState([]);
  const [quality, setQuality] = useState([]);
  const [open, setOpen] = useState<boolean>(
    confirmModalRef.current?.open as boolean,
  );
  const [detail, setDetail] = useState<boolean>(true);
  const [selectTab, setSelectTab] = useState<number>(0);
  const [listSort, setListSort] = useState<number>(0);
  const [curData, serCurData] = useState<DataType>();
  const getExpeirence = () => {
    httpUtil.getAllCase().then(res => {
      const data = res.data;
      const [Other, Safe, Experience, Design, Quality] = [
        data['其它'],
        data['安全'],
        data['技经'],
        data['设计'],
        data['质量'],
      ];
      setOther(Other);
      setSafe(Safe);
      setExperience(Experience);
      setDesign(Design);
      setQuality(Quality);
      setLoading(false);
    });
  };
  useEffect(() => {
    getExpeirence();
  }, []);
  const TabList: tabListItem[] = [
    { title: '安全' },
    { title: '质量' },
    { title: '设计' },
    { title: '技经' },
    { title: '其它' },
  ];

  const OTHER = {
    zh: '其它',
    en: 'OTHER',
  };
  const SAFE = {
    zh: '安全',
    en: 'SAFE',
  };
  const EXPERIENCE = {
    zh: '技经',
    en: 'EXPERIENCE',
  };
  const DESIGN = {
    zh: '设计',
    en: 'DESIGN',
  };
  const QUALITY = {
    zh: '质量',
    en: 'QUALITY',
  };

  const mapData = [
    {
      tab: SAFE.zh,
      data: safe,
      key: SAFE.en,
    },
    {
      tab: QUALITY.zh,
      data: quality,
      key: QUALITY.en,
    },
    {
      tab: EXPERIENCE.zh,
      data: experience,
      key: EXPERIENCE.en,
    },
    {
      tab: DESIGN.zh,
      data: design,
      key: DESIGN.en,
    },
    {
      tab: OTHER.zh,
      data: other,
      key: OTHER.en,
    },
  ];

  const toAddExperience = () => {
    navigateTo(`/home/typicalExperience/experienceList/addExperience`);
  };
  const tabSwitchHandle = (val: number) => {
    setSelectTab(val);
  };
  const openDraw = (data: DataType) => {
    setDetail(true);
    serCurData(data);
  };
  const disableDraw = () => {
    setDetail(false);
  };
  const onConfirm = (index: number) => {
    setListSort(index);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const confirmDelete = () => {
    console.log(listSort);
    message('请稍后', 'warning');
    httpUtil.deleteOneCase({ caseId: listSort }).then(res => {
      if (res.code === 200 || res.status === 'success') {
        // const deletedData = Data.filter(item => item.id !== caseId);
        // setData(deletedData);
        getExpeirence();
        message('删除成功', 'success');
      } else {
        message('删除失败', 'error');
      }
    });
  };
  // 删除确认有一个bug
  return (
    <>
      <View className={styles.top}>
        <AtTag className={styles.tag} circle>
          典型经验
        </AtTag>
      </View>
      <View style={{ height: '1100rpx' }}>
        {loading ? (
          <View
            style={{
              margin: '2px 0',
              marginBottom: '20px',
              padding: '30px 50px',
              textAlign: 'center',
              borderRadius: '4px',
            }}>
            <AtLoadMore style={{ marginTop: 150 }} />
          </View>
        ) : (
          // 两个清单组件操作模态框调不出来
          <View>
            <AtTabs
              style={{ zIndex: 100 }}
              scroll
              current={selectTab}
              tabList={TabList}
              onClick={e => tabSwitchHandle(e)}>
              {mapData.map((mapItem, mapId) => {
                return (
                  <AtTabsPane
                    style={{ height: '1000rpx', zIndex: 0 }}
                    current={selectTab}
                    index={mapId}
                    key={'Tabpane-' + mapId}>
                    <TableForExperience
                      key={'Tabpane-' + mapId}
                      data={mapItem.data}
                      onConfirm={onConfirm}
                      onDetail={openDraw}
                    />
                  </AtTabsPane>
                );
              })}
            </AtTabs>
            <AtModal
              title='确认删除该典例吗'
              isOpened={open}
              onConfirm={() => {
                confirmDelete();
                onClose();
              }}
              onCancel={onClose}
              confirmText='确认'
              cancelText='取消'
            />
            <TypicalExperienceDetail
              data={curData}
              onClose={disableDraw}
              open={detail}
            />
          </View>
        )}
        <AtMessage />
      </View>
    </>
  );
};
export default TypicalExperience;
