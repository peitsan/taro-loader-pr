import Taro from '@tarojs/taro';
import { forwardRef, useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import { AtMessage, AtIcon } from 'taro-ui';
import httpUtil from '../../../../../../../utils/httpUtil';
import { technologyItem, technologyTableProps } from './technologyTableType';
import './technologyTable.css';

export const TechnologyTable: React.FC<technologyTableProps> = forwardRef(
  selfProps => {
    const { isTechModal, setIsTechModal, setCurrentTab, setSheetId } =
      selfProps;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [recordList, setRecordList] = useState<technologyItem[]>([]);
    const [opinion, setOpinion] = useState<string | null>(null);
    const [situation, setSituation] = useState<string | null>(null);
    const projectId = Taro.getStorageSync('projectId')!;
    const progressId = Taro.getStorageSync('progressId')!;
    const getTechnologyList = async () => {
      setIsLoading(true);
      try {
        const res = await httpUtil.getTechnologyList({
          projectId,
          progressId,
        });
        if (res.code === 200) {
          setRecordList(res.data.list);
          setOpinion(res.data.主要建议意见);
          setSituation(res.data.问题处置);
          setSheetId(res.data.list[0].id);
          setIsLoading(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const showModal = (e: number, id: number | null) => {
      console.log(1);
      setCurrentTab(e);
      if (id) {
        setSheetId(id);
      }
      setIsTechModal(true);
    };
    const setValue = (value: string, type: string) => {
      switch (type) {
        case 'opinion':
          setOpinion(value);
          break;
        case 'situation':
          setSituation(value);
          break;
        case 'mainAdviceOpinion':
          setOpinion(value);
          break;
        case 'questionExecute':
          setSituation(value);
          break;
      }
    };
    useEffect(() => {
      getTechnologyList();
    }, []);

    return (
      <View className='technologyTable-container'>
        <View className='technologyTable-header'>
          <View>序号</View>
          <View>审核内容</View>
          <View>依据</View>
          <View>审核意见 (可研内审后填写)</View>
          <View>闭环情况 (可研批复会签前填写)</View>
        </View>
        <View className='technologyTable-table'>
          {recordList.length === 0 ? (
            <View className='technologyTable-empty'>
              <AtIcon value='bullet-list' size='196' color='#99bead'></AtIcon>
              <View className='technologyTable-empty-tip'>
                暂 无 专 业 可 研 反 馈 记 录
              </View>
            </View>
          ) : (
            <View className='technologyTable-lists'>
              {recordList.map((item, index) => {
                return (
                  <View className='technologyTable-item' key={index}>
                    <View>{index + 1}</View>
                    <View>{item.审核内容}</View>
                    <View>{item.依据}</View>
                    <View
                      onClick={e => {
                        showModal(0, item.id);
                      }}
                      style={{
                        color: item.审核意见 === null ? '#cfcfcf' : 'black',
                      }}>
                      {item.审核意见 === null
                        ? '暂未填写(点击填写)'
                        : item.审核意见}
                    </View>
                    <View
                      onClick={e => {
                        showModal(1, item.id);
                      }}
                      style={{
                        color: item.闭环情况 === null ? '#cfcfcf' : 'black',
                      }}>
                      {item.闭环情况 === null
                        ? '暂未填写(点击填写)'
                        : item.闭环情况}
                    </View>
                  </View>
                );
              })}
              <View className='signature-container'>
                <View className='signature-title'>
                  <View>建管单位(部门)建议意见</View>
                </View>
                <View className='signature-input'>
                  <View
                    className='opinion'
                    onClick={e => {
                      showModal(2, null);
                    }}>
                    {/* <TextArea placeholder='主要建议意见：'></TextArea> */}
                    <View className='title'>主要建议意见：</View>
                    <View className='content'>
                      <View
                        className='all-content'
                        style={{
                          color: opinion === null ? '#cfcfcf' : 'black',
                        }}>
                        {opinion === null ? '暂未填写(点击填写)' : opinion}
                      </View>
                    </View>
                  </View>
                  <View
                    onClick={e => {
                      showModal(3, null);
                    }}
                    className='opinion'>
                    <View className='title'>问题处置：</View>
                    <View className='content'>
                      <View
                        className='all-content'
                        style={{
                          color: situation === null ? '#cfcfcf' : 'black',
                        }}>
                        {situation === null ? '暂未填写(点击填写)' : situation}
                      </View>
                    </View>
                    {/* <TextArea placeholder='问题处置：'></TextArea> */}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
        <AtMessage />
      </View>
    );
  },
);
