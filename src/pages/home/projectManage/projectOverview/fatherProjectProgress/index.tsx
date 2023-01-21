import React, { useEffect, useState } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { Button, View, Picker } from "@tarojs/components";
import {
    AtTag,
    AtIcon,
    AtToast,
    AtModal,
    AtModalHeader,
    AtModalContent,
    AtList,
    AtListItem,
    AtForm
} from 'taro-ui';
import styles from './index.module.less';
import ProgressItem from "../../components/progressItem";
import { IProgressItem } from "../../components/progressItem"
import { IonClickName } from '../../components/progressItem'
import httpUtil from "@/utils/httpUtil";

const fatherProjectProgress = () => {
    // 获取父项目id，name，permission
    const { projectId = 75, projectName = 'mzy Test', permission = 'manager' } = useRouter().params;
    // 存储目前进行到的步骤，默认是1
    const [progressNow, setProgressNow] = useState<number>(1);
    // 轻提示的显示与隐藏
    const [isOpenToast, setOpenToast] = useState(false);
    // 相关操作的显示与隐藏
    const [isOpenOperateModal, setIsOpenOperateModal] = useState(false);
    // 保存现在所有的小进程
    const [timestamp, setTimestamp] = useState<IProgressItem[]>([]);
    // 控制选择时间窗口的打开与关闭
    const [isOpenDateSele, setIsOpenDataSele] = useState(false);
    // 存储选择实际完成时间和计划完成时间窗口的 title
    const [selectDateTitle, setSelectDateTitle] = useState<"选择实际完成时间" | "选择计划完成时间" | "选择开始时间">("选择计划完成时间");
    // 选择时间窗口是否锁定
    const [isDisabled, setIsDisabled] = useState(false);
    // 时间选择的开始日期
    const [selectStart, setSelectStart] = useState<string>();
    // 时间选择的截至日期
    const [deadline, setDeadline] = useState<string>();
    // 保存现在正在进行的进程信息
    interface INowProgressInfo {
        startTime: string | null,
        endTime: string | null,
        planTime: string | null,
        progressId: number,
    }
    const [curProgressInfo, setCurProgressInfo] = useState<INowProgressInfo>();
    // 储存选择开始时间的日期
    const [startTime, setStartTime] = useState<string>()
    // 初始化可选择的日期
    const initSelectTime = () => {
        setSelectStart("1970-01-01");
        setDeadline("2999-01-01");
    }

    // 点击项目名称事件
    const onClickProName = (params: IonClickName) => {
        const { type, startTime, endTime } = params;
        if (type > progressNow) {
            setOpenToast(true);
            setTimeout(() => { setOpenToast(false) }, 2000);
        } else {
            if (permission === 'manager') {
                if (type === 0 && !endTime) {
                    setSelectDateTitle("选择实际完成时间");
                    setIsOpenDataSele(true);
                    // 下面的timestamp[1] 指的是初步设计启动会的时间没有确定的情况下
                    if (!timestamp[1].startTime) {
                        setIsDisabled(true);
                    } else {
                        initSelectTime();
                        setIsDisabled(false);
                        setDeadline(timestamp[1].startTime);
                    }
                }
                else if (type !== 0 && !startTime) {
                    initSelectTime();
                    setSelectDateTitle("选择开始时间");
                    setIsOpenDataSele(true);
                    type !== 1 && setSelectStart(timestamp[type - 1].startTime!);
                };
            }
        }
    }

    // 获取该项目的过程数据
    const getData = () => {
        // 获取时间戳数据
        return httpUtil
            .getFatherProjectNodeDetail({ projectId: Number(projectId) })
            .then((res) => {
                const { progresses } = res.data;

                progresses.forEach((item: IProgressItem) => {
                    if (item.status === "进行中") {
                        setProgressNow(item.type);
                        setCurProgressInfo({
                            startTime: item.startTime,
                            endTime: item.endTime,
                            planTime: item.planTime,
                            progressId: item.progressId,
                        });
                    }
                });

                setTimestamp(progresses);
            });
    };
    useEffect(() => {
        getData();
    }, [])
    return (
        <>
            <View>
                <View
                    className={styles.top}
                    onClick={() => { console.log('后退'); }}>
                    <AtIcon value="chevron-left" />
                    <View>返回</View>
                </View>
                <View className={styles['name-div']}>
                    <AtTag className={styles.tag} circle>项目详情</AtTag>
                    <View className={styles.name}>{projectName}</View>
                    <View
                        className={styles.operate}
                        onClick={() => {
                            setIsOpenOperateModal(true);
                        }}
                    >相关操作</View>
                </View>
                <View className={styles['progress-div']}>
                    {
                        timestamp && (
                            <>
                                {timestamp.map((item, index) => {
                                    return (<ProgressItem
                                        key={`ProjectProgress-${index}`}
                                        name={item.name}
                                        startTime={item.startTime}
                                        endTime={item.endTime}
                                        planTime={item.planTime}
                                        progressId={item.progressId}
                                        projectId={item.projectId}
                                        status={item.status}
                                        finish={item.finish}
                                        type={item.type}
                                        onClickName={(params) => onClickProName(params)}
                                        hasNext={(index !== timestamp.length - 1) && true}
                                    />)
                                })}
                            </>
                        )
                    }
                </View>
            </View>
            <AtToast isOpened={isOpenToast} text={"流程未开始"} icon="close-circle"></AtToast>
            <AtModal isOpened={isOpenOperateModal} onClose={() => {
                setIsOpenOperateModal(false)
            }}>
                <AtModalHeader>相关操作</AtModalHeader>
                <AtModalContent>
                    {
                        curProgressInfo?.planTime ? (
                            <Button className={styles.opeBtn}>申请调整计划完成时间</Button>
                        ) : (
                            <Button className={styles.opeBtn}>填写计划完成时间</Button>
                        )
                    }
                    <Button className={styles.opeBtn}>填写实际完成时间</Button>
                    <Button className={styles.opeBtn}>下一节点</Button>
                </AtModalContent>
            </AtModal>
            {/* 确定相应时间 */}
            <AtModal isOpened={isOpenDateSele} onClose={() => { setIsOpenDataSele(false) }}>
                <AtModalHeader>{selectDateTitle}</AtModalHeader>
                <AtModalContent>
                    <AtForm
                        onSubmit={(e) => {
                            console.log(e);
                        }}
                    >
                        <Picker
                            mode="date"
                            value="YYYY-MM-DD"
                            onChange={(e) => {
                                setStartTime(e.detail.value)
                            }}
                            disabled={isDisabled}
                            start={selectStart}
                            end={deadline}
                        >
                            <AtList>
                                <AtListItem title="时间" extraText={startTime ? startTime : "选择开始时间"} />
                            </AtList>
                        </Picker>
                        <Button className={styles.opeBtn} formType="submit">确定</Button>
                    </AtForm>
                </AtModalContent>
            </AtModal>
        </>
    )
}

export default fatherProjectProgress;