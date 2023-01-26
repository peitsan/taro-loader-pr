import { useState, useEffect } from 'react';
import { AtLoadMore, AtTabs, AtTabsPane } from 'taro-ui';
import { View } from '@tarojs/components';
import { navigateTo } from '../../..//common/functions/index';
import { BackPrePage } from '../../../common/components/backPrePage/backPrePage';
import { tabListItem } from './indexProps';
import httpUtil from '../../../utils/httpUtil';
import TableForExperience from '../../../common/components/TableForExperience/index';

const typicalExperience: React.FC = () => {
  // const { params } = getCurrentInstance(); //获取路由传入的index参数
  const [loading, setLoading] = useState<Boolean>(true);
  const [other, setOther] = useState([]);
  const [safe, setSafe] = useState([]);
  const [experience, setExperience] = useState([]);
  const [design, setDesign] = useState([]);
  const [quality, setQuality] = useState([]);
  const [selectTab, setSelectTab] = useState<number>(0);
  useEffect(() => {
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
  // 删除确认有一个bug
  return (
    <View style={{ height: '1100rpx' }}>
      <BackPrePage />
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
            enable-flex='true'
            scroll
            current={selectTab}
            tabList={TabList}
            onClick={e => tabSwitchHandle(e)}>
            {mapData.map((mapItem, mapId) => {
              return (
                <AtTabsPane
                  style={{ height: '1000rpx' }}
                  current={selectTab}
                  index={mapId}>
                  <TableForExperience data={mapItem.data} />
                </AtTabsPane>
              );
            })}
          </AtTabs>
        </View>
      )}
    </View>
  );
};
export default typicalExperience;
