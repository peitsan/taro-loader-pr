import React, { useState, useRef } from 'react';
import Taro from '@tarojs/taro';
import { Picker, Button, View } from '@tarojs/components';
import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtForm,
  AtInput,
  AtList,
  AtListItem,
  AtToast,
  AtMessage,
} from 'taro-ui';
import httpUtil from '@/utils/httpUtil';
import styles from './index.module.less';
import { IData } from '../../types/projectType';
import { IFaProMoreData, IChProMoreData } from './moreType';
import { ProjectAccordion } from '../../../components/projectAccordion';
import { ShowMoreInfo } from '../../../components/showMoreInfo';

const ProjectItem = (data: IData) => {
  const { fatherProject, sonProject, getOwnProjects } = data;
  const [isOpen, setIsOpen] = useState(false);
  const [chooseOneType, setChooseOneType] = useState<number | string>();
  // 存储二级类型的一个数组
  const [twoTypeCanChoose, setTwoTypeCanChoose] = useState<string[]>();
  // 存储选择的二级类型一个汉字
  const [chooseTwoType, setChooseTwoType] = useState<number | string>();
  // 存储选择二级类型的value
  const [subTypeValue, setSubTypeValue] = useState<number>();
  // 二级类型下拉框是否禁用
  const [isDisabled, setIsDisabled] = useState(true);
  // 是否显示轻提示
  const [toastIsOpen, setToastOpen] = useState(false);
  // 存储项目名称
  const [proName, setProName] = useState('');
  // 选择的日期
  const [pickDate, setPickDate] = useState<string>();
  // 输入的备注
  const [remark, setRemark] = useState<string>();
  // 点击新建弹出页面
  const [isOpenModal, setIsOpenModal] = useState(false);
  // 选择的项目类型
  const [chooseScope, setChooseScope] = useState<number>();
  // 选择的父项目id
  const [fatherId, setFatherId] = useState<number>();
  // 存储Toast的text
  const [toastText, setToastText] = useState<
    '请先选择一级类型' | '请将表单输入完整'
  >();
  const [moreData, setMoreData] = useState<IFaProMoreData | IChProMoreData>({
    scope: 1,
    manager: 'mzy',
  });

  // 点击大项目名称跳转
  const clickNav = (e, projectName: string, projectId: number) => {
    // 阻止冒泡
    e.stopPropagation();

    Taro.navigateTo({
      url: `/pages/home/projectManage/projectOverview/fatherProjectProgress/index?name=${projectName}&projectId=${projectId}&permission=${'worker'}`,
    });
  };

  // 点击展示更多信息
  const clickShowMore = (e, data: IFaProMoreData | IChProMoreData) => {
    // 阻止冒泡
    e.stopPropagation();
    // 联合类型的判断
    if ('manager' in data) {
      setMoreData({
        scope: data.scope,
        manager: data.manager,
      });
    } else {
      setMoreData({
        startTime: data.startTime,
        scope: data.scope,
        progressNow: data.progressNow || '已完成',
      });
    }
    setIsOpen(e => !e);
  };

  // 点击新建子项目
  const showModal = (e, scope: number, fatherId: number) => {
    e.stopPropagation();
    setIsOpenModal(true);
    setChooseScope(scope);
    setFatherId(fatherId);
  };

  // 一级类型的选择 option
  const oneType = ['隧道', '线路', '变电站'];

  const twoTypeCanChooseOptions = [
    // 规模以下
    {
      '0': [
        {
          name: '220kV电缆隧道',
          value: 1011,
        },
        {
          name: '500kv电缆隧道',
          value: 1012,
        },
      ],
      '1': [
        {
          name: '220kV架空线路',
          value: 2011,
        },
      ],
      '2': [
        {
          name: '220kV主变扩建',
          value: 3013,
        },
      ],
    },
    // 规模以上
    {
      '0': [
        {
          name: '500kV电缆隧道',
          value: 1012,
        },
        {
          name: '220kV电缆隧道',
          value: 1011, // 暂定
        },
      ],
      '1': [
        {
          name: '500kV架空线路',
          value: 2012,
        },
        {
          name: '220kV架空线路',
          value: 2011, // 暂定
        },
      ],
      '2': [
        {
          name: '500kV变电站',
          value: 3012,
        },
        {
          name: '220kV变电站',
          value: 3011,
        },
        {
          name: '500kV主变扩建',
          value: 3014,
        },
      ],
    },
  ];

  // 通过一级类型获得二级类型
  const getTwoType = (scope: number, index: number | string) => {
    const objArr: { name: string; value: number }[] =
      twoTypeCanChooseOptions[scope][index];
    const new_Arr: string[] = [];
    for (const item of objArr) {
      new_Arr.push(item.name);
    }
    setTwoTypeCanChoose(new_Arr);
  };

  // 提交表单，设置定时器防止短时间内一直点击
  let timer: NodeJS.Timer;
  const submit = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      const data = {
        type: (Number(chooseOneType) + 1) * 1000, // 这里*1000 是因为pc端接口调用 1000 2000 3000
        subType: subTypeValue,
        name: proName,
        startTime: pickDate,
        remark,
        scope: chooseScope,
        fatherId,
      };
      if (
        // @ts-ignore
        data.type === NaN ||
        data.subType === undefined ||
        data.startTime === undefined ||
        data.name === ''
      ) {
        setToastText('请将表单输入完整');
        setToastOpen(true);
        setTimeout(() => setToastOpen(false), 2000);
      } else {
        // 请求数据
        const { id } = JSON.parse(Taro.getStorageSync('user'));
        const startTimeStamp = new Date(data.startTime).getTime();
        try {
          const res = await httpUtil.projectNewAdd({
            managers: [id],
            startTime: String(startTimeStamp),
            scope: data.scope!,
            type: data.type,
            subType: data.subType,
            name: data.name,
            remark: data.remark!,
            fatherId: data.fatherId!,
          });
          if (res.code === 200) {
            setIsOpenModal(false);
            setRemark('');
            setProName('');
            setPickDate('');
            getOwnProjects!().then(() => {
              // @ts-ignore
              Taro.atMessage({
                message: '新建成功',
                type: 'success',
              });
            });
          }
        } catch {
          // @ts-ignore
          Taro.atMessage({
            message: '网络异常，请稍后再试',
            type: 'error',
          });
        } finally {
        }
      }
    }, 500);
  };

  // 点击跳转子项目
  const naviToSonPro = (
    e,
    projectId: number,
    projectName: string,
    fatherId: number,
    fatherProName: string,
  ) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: `/pages/home/projectManage/projectOverview/sonProjectProgress/index?projectId=${projectId}&proName=${projectName}&fatherId=${fatherId}&fatherProName=${fatherProName}&permission=${'worker'}`,
    });
  };

  return (
    <>
      <ProjectAccordion
        fatherProject={fatherProject}
        sonProject={sonProject}
        naviToFatherPro={clickNav}
        naviToSonPro={naviToSonPro}
        clickShowFatherMore={e => {
          const data: IFaProMoreData = {
            scope: fatherProject.scope,
            manager: fatherProject.manager,
          };
          clickShowMore(e, data);
        }}
        clickShowSonMore={clickShowMore}
        createProject={showModal}
      />

      {/* 展示更多信息 */}
      <ShowMoreInfo isOpen={isOpen} setIsOpen={setIsOpen} moreData={moreData} />

      {/* 新增子项目 */}
      <AtModal isOpened={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <AtModalHeader>新建子工程</AtModalHeader>
        <AtModalContent>
          <AtForm
            onSubmit={() => {
              submit();
            }}>
            {/* 选择一级类型 */}
            <Picker
              mode='selector'
              range={oneType}
              onChange={e => {
                setChooseOneType(e.detail.value);
                getTwoType(fatherProject.scope, e.detail.value);
                setIsDisabled(false);
              }}>
              <AtList>
                <AtListItem
                  title='一级类型'
                  extraText={
                    chooseOneType ? oneType[chooseOneType] : '请选择一级类型'
                  }
                />
              </AtList>
            </Picker>
            {/* 选择二级类型 */}
            <Picker
              mode='selector'
              range={twoTypeCanChoose!} // 这里不会出现undefined的情况
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) {
                  setToastText('请先选择一级类型');
                  setToastOpen(true);
                  setTimeout(() => {
                    setToastOpen(false);
                  }, 2000);
                }
              }}
              onChange={e => {
                setChooseTwoType(twoTypeCanChoose![e.detail.value]);
                // 下面的 chooseOneType 不可能为 undefined
                const subTypeValue =
                  twoTypeCanChooseOptions[fatherProject.scope][chooseOneType!][
                    e.detail.value
                  ].value;
                setSubTypeValue(subTypeValue);
              }}>
              <AtList>
                <AtListItem
                  title='二级类型'
                  extraText={
                    chooseTwoType ? String(chooseTwoType) : '请选择二级类型'
                  }
                />
              </AtList>
            </Picker>
            {/* 输入项目名称 */}
            {isOpenModal ? (
              <AtInput
                title='项目名称'
                name='name'
                style={{ zIndex: 101 }}
                placeholder='请输入项目名称'
                onChange={e => {
                  setProName(String(e));
                }}
                value={proName}
              />
            ) : null}
            {/* 选择可研启动会日期 */}
            <Picker
              mode='date'
              onChange={e => {
                setPickDate(e.detail.value);
              }}
              value='YYYY-MM-DD'>
              <AtList>
                <AtListItem
                  title='可研启动会日期'
                  extraText={pickDate ? pickDate : '请选择日期'}
                />
              </AtList>
            </Picker>
            {/* 备注信息 */}
            <View>
              {isOpenModal ? (
                <AtInput
                  name='remark'
                  title='备注'
                  placeholder='请输入备注'
                  onChange={e => {
                    setRemark(String(e));
                  }}
                  value={remark}
                />
              ) : null}
            </View>
            <Button className={styles.btn} formType='submit'>
              确定
            </Button>
          </AtForm>
        </AtModalContent>
        <AtToast isOpened={toastIsOpen} text={toastText}></AtToast>
      </AtModal>
      <AtMessage />
    </>
  );
};

export default ProjectItem;
