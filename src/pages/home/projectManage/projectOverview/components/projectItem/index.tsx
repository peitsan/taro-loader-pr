import React, { useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { View, Picker, Button } from '@tarojs/components'
import {
    AtFloatLayout,
    AtIcon,
    AtModal,
    AtModalHeader,
    AtModalContent,
    AtForm,
    AtInput,
    AtList,
    AtListItem,
    AtToast
} from 'taro-ui'
import styles from './index.module.less'
import { IData } from '../../types/projectType'
import { IFaProMoreData, IChProMoreData } from './moreType'

const ProjectItem = (data: IData) => {
    const itemRef = useRef()
    const { fatherProject, sonProject } = data;
    const [isShow, setIsShow] = useState(false)
    const [arrType, setArrType] = useState<'left' | 'down'>('left');
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
    const [pickDate, setPickDate] = useState<string>()
    // 输入的备注
    const [remark, setRemark] = useState<string>()
    // 点击新建弹出页面
    const [isOpenModal, setIsOpenModal] = useState(false);
    // 选择的项目类型
    const [chooseScope, setChooseScope] = useState<number>();
    // 选择的父项目id
    const [fatherId, setFatherId] = useState<number>();
    // 存储Toast的text
    const [toastText, setToastText] = useState<'请先选择一级类型' | '请将表单输入完整'>();
    const [moreData, setMoreData] = useState<IFaProMoreData | IChProMoreData>({
        scope: 1,
        manager: 'mzy'
    })

    // 设置过渡动画
    const clickHandler = (e) => {
        e.stopPropagation();
        const ele = itemRef.current;
        // @ts-ignore
        const childLen = ele.childNodes.length;
        // @ts-ignore
        ele.style.transition = `max-height ${0.4 * childLen}s ease`;
        arrType === 'left' ? setArrType('down') : setArrType('left');
        if (isShow === false) {
            // @ts-ignore
            ele.style['maxHeight'] = childLen * 90 + 'px'
        } else {
            // @ts-ignore
            ele.style['maxHeight'] = '0'
        }
        setIsShow(e => !e)
    }

    // 点击大项目名称跳转
    const clickNav = (e, projectName: string, projectId: number) => {
        // 阻止冒泡
        e.stopPropagation();

        Taro.navigateTo(
            {
                url: `/pages/home/projectManage/projectOverview/fatherProjectProgress/index?name=${projectName}&id=${projectId}&permission=${'worker'}`,
            }
        );
    }


    // 点击展示更多信息
    const clickShowMore = (e, data: IFaProMoreData | IChProMoreData) => {
        // 阻止冒泡
        e.stopPropagation();
        // 联合类型的判断
        if ('manager' in data) {
            setMoreData({
                scope: data.scope,
                manager: data.manager
            })
        } else {
            setMoreData({
                startTime: data.startTime,
                scope: data.scope,
                progressNow: data.progressNow
            })
        }
        setIsOpen(e => !e)
    }

    // 点击新建子项目
    const showModal = (e, scope: number, fatherId: number) => {
        e.stopPropagation();
        setIsOpenModal(true);
        setChooseScope(scope);
        setFatherId(fatherId);
    }

    // 一级类型的选择 option
    const oneType = ['隧道', '线路', '变电站'];

    // 两种类型选择
    const twoType = [
        {
            "0": [
                {
                    name: "电缆隧道",
                    value: 1010,
                },
            ],
            "1": [
                {
                    name: "架空线路",
                    value: 2010,
                },
            ],
            "2": [
                {
                    name: "主变扩建",
                    value: 3010,
                },
            ],
        },
        {
            "0": [
                {
                    name: "电缆隧道",
                    value: 1010,
                },
            ],
            "1": [
                {
                    name: "架空线路",
                    value: 2010,
                },
            ],
            "2": [
                {
                    name: "220kv变电站",
                    value: 3011,
                },
                {
                    name: "500kv变电站",
                    value: 3012,
                },
            ],
        },
    ];

    // 通过一级类型获得二级类型
    const getTwoType = (scope: number, index: number | string) => {
        const objArr: { name: string, value: number }[] = twoType[scope][index];
        const new_Arr: string[] = []
        for (let item of objArr) {
            new_Arr.push(item.name)
        }
        setTwoTypeCanChoose(new_Arr);
    }

    // 提交表单，设置定时器防止短时间内一直点击
    let timer: NodeJS.Timer;
    const submit = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(async () => {
            const data = {
                type: Number(chooseOneType) * 1000,  // 这里*1000 是因为pc端接口调用 1000 2000 3000
                subType: subTypeValue,
                name: proName,
                startTime: pickDate,
                remark,
                scope: chooseScope,
                fatherId
            }
            // @ts-ignore
            if (data.type === NaN ||
                data.subType === undefined ||
                data.startTime === undefined ||
                data.name === '') {
                setToastText('请将表单输入完整');
                setToastOpen(true);
                setTimeout(() => setToastOpen(false), 2000);
            } else {
                // 请求数据

            }
        }, 500)
    }

    return (
        <>
            <View className={styles.proItem}>
                <View className={styles.fatherPro}
                    onClick={clickHandler}>
                    <View
                        className={styles.faProName}
                        onClick={(e) => {
                            clickNav(e, fatherProject.name, fatherProject.id);
                        }}
                    >{fatherProject.name}
                    </View>
                    <View className={styles.right}>
                        <View
                            className={styles.moreInfo}
                            onClick={(e) => {
                                const data: IFaProMoreData = {
                                    scope: fatherProject.scope,
                                    manager: fatherProject.manager
                                }
                                clickShowMore(e, data)
                            }}
                        >
                            更多信息
                        </View>
                        {/* 新建小项目 */}
                        {/* 还没有设置权限 */}
                        <View
                            className={styles.addChPro}
                            onClick={(e) => {
                                showModal(e, fatherProject.scope, fatherProject.id)
                            }}
                        >
                            新建
                        </View>
                        <AtIcon value={`chevron-${arrType}`} className={styles.arrow} />
                    </View>
                </View>
                <View ref={itemRef} className={`${styles.items}`}>
                    {
                        sonProject.map((item, index) => {
                            return (
                                <View
                                    className={styles.sonPro}
                                    key={index}
                                >
                                    <View className={styles.sonProName}>
                                        {item.name}
                                    </View>
                                    <View
                                        className={styles.moreInfo}
                                        onClick={(e) => {
                                            const data: IChProMoreData = {
                                                startTime: item.startTime,
                                                scope: item.scope,
                                                progressNow: item.progressNow.name,
                                            }
                                            clickShowMore(e, data)
                                        }}
                                    >
                                        更多信息
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>

            {/* 展示更多信息 */}
            <AtFloatLayout isOpened={isOpen} onClose={() => { setIsOpen(false) }}>
                {'manager' in moreData ? (
                    <>
                        <View className={styles.moreInfoStyle}>
                            项目经理: {moreData.manager}
                        </View>
                        <View className={styles.moreInfoStyle}>
                            项目规模：{moreData.scope ? '规模以下' : '规模以上'}
                        </View>
                    </>
                ) : (
                    <>
                        <View className={styles.moreInfoStyle}>
                            初步设计启动时间：{moreData.startTime}
                        </View>
                        <View className={styles.moreInfoStyle}>
                            项目规模：{moreData.scope}
                        </View >
                        {/* @ts-ignore */}
                        <View className={styles.moreInfoStyle}>
                            项目进度：{moreData.progressNow}
                        </View>
                        <View>

                        </View>
                    </>
                )}
            </AtFloatLayout>

            {/* 新增子项目 */}
            <AtModal isOpened={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <AtModalHeader>新建子工程</AtModalHeader>
                <AtModalContent>
                    <AtForm
                        onSubmit={() => { submit() }}>
                        {/* 选择一级类型 */}
                        <Picker mode="selector"
                            range={oneType}
                            onChange={(e) => {
                                setChooseOneType(e.detail.value)
                                getTwoType(fatherProject.scope, e.detail.value)
                                setIsDisabled(false);
                            }}>
                            <AtList>
                                <AtListItem
                                    title='一级类型'
                                    extraText={chooseOneType ? oneType[chooseOneType] : '请选择一级类型'}
                                />
                            </AtList>
                        </Picker>
                        {/* 选择二级类型 */}
                        <Picker mode="selector"
                            range={twoTypeCanChoose!}  // 这里不会出现undefined的情况
                            disabled={isDisabled}
                            onClick={() => {
                                if (isDisabled) {
                                    setToastText('请先选择一级类型');
                                    setToastOpen(true)
                                    setTimeout(() => { setToastOpen(false) }, 2000);
                                }
                            }}
                            onChange={(e) => {
                                setChooseTwoType(twoTypeCanChoose![e.detail.value])
                                // 下面的 chooseOneType 不可能为 undefined
                                const subTypeValue = twoType[fatherProject.scope][chooseOneType!][e.detail.value].value
                                setSubTypeValue(subTypeValue)
                            }}>
                            <AtList>
                                <AtListItem
                                    title='二级类型'
                                    extraText={chooseTwoType ? String(chooseTwoType) : '请选择二级类型'}
                                />
                            </AtList>
                        </Picker>
                        {/* 输入项目名称 */}
                        <AtInput
                            title="项目名称"
                            name="name"
                            placeholder="请输入项目名称"
                            onChange={(e) => { setProName(String(e)); }}
                            value={proName}
                        />
                        {/* 选择初步启动日期 */}
                        <Picker
                            mode="date"
                            onChange={(e) => {
                                setPickDate(e.detail.value)
                            }}
                            value='YYYY-MM-DD'
                        >
                            <AtList>
                                <AtListItem
                                    title='初步设计启动时间'
                                    extraText={pickDate ? pickDate : '请选择日期'}
                                />
                            </AtList>
                        </Picker>
                        {/* 备注信息 */}
                        <AtInput
                            name="remark"
                            title="备注"
                            placeholder="请输入备注"
                            onChange={(e) => { setRemark(String(e)) }}
                            value={remark}
                        />
                        <Button type="primary" formType="submit">确定</Button>
                    </AtForm>
                </AtModalContent>
                <AtToast isOpened={toastIsOpen} text={toastText}></AtToast>
            </AtModal>
        </>
    )
}

export default ProjectItem