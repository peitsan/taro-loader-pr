import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import styles from './index.module.less'
import { GetNumberTime } from '../../../../../common/functions/getNumberTime'

// 响使用改组件的组件传递相应的信息
export interface IonClickName {
    type: number,
    startTime: string | null,
    endTime: string | null,
}

export interface IProgressItem {
    status: "已结束" | "进行中" | "未开始", // 标记现在的任务状态
    name: string, // 该过程的名字
    startTime: string | null, // 开始时间
    endTime: string | null, // 实际完成时间
    planTime: string | null, // 计划完成时间
    progressId: number, // 该进程的id
    finish: boolean, // 标识改进程有没有完成
    projectId: number, // 该进程所属项目的id
    type: number, // 流程状态码
    hasNext?: boolean // 表示有无下一个进程
    doingColor?: string, // 正在进行的 color
    doneColor?: string,  // 已经完成的 color
    willColor?: string,   // 没有开始的 color
    onClickName?: (params: IonClickName) => void
}

const initProps = {
    type: 0,
    hasNext: true,
    finish: false,
    doingColor: "rgb(241, 179, 60)",
    doneColor: "rgb(0,107,84)",
    willColor: "rgb(167,166,166)",
    status: "进行中"
}

interface ITimeComponentProps {
    title: string,
    time: string | null,
    timeClassName?: string
}

const Time = (props: ITimeComponentProps) => {
    const { time, title, timeClassName = "" } = props;

    return (
        <View>
            {title}:
            {time ? (
                <Text className={styles[timeClassName]}> {time}</Text>
            ) : (
                <Text className={styles['item-noTime']}>未选择</Text>
            )}
        </View>
    )
}

const ProgressItem = (props: IProgressItem) => {
    const {
        status = initProps.status,
        name,
        startTime,
        endTime,
        planTime,
        progressId,
        finish = initProps.finish,
        projectId,
        type = initProps.type,
        hasNext = initProps.hasNext,
        doingColor = initProps.doingColor,
        doneColor = initProps.doneColor,
        willColor = initProps.willColor
    } = props;
    const colorSelect = {
        "未开始": initProps.willColor,
        "进行中": initProps.doingColor,
        "已结束": initProps.doneColor
    }
    const [isShow, setIsShow] = useState(false);

    const showHidden = () => {
        setIsShow(e => !e)
    }

    return (
        <View className={styles.item}>
            <View className={styles.leftSign}>
                <View
                    className={styles.circle}
                    style={{ backgroundColor: colorSelect[status] }}
                ></View>
                {hasNext && <View
                    className={`${styles.nextLine} ${isShow && (type === 0 ? styles.longT : styles.long)}`}
                    style={{ backgroundColor: colorSelect[status] }}
                ></View>}
            </View>
            <View className={styles.rightContent}>
                <View
                    className={styles.itemContent}
                    onClick={showHidden}
                >
                    <View
                        className={styles.itemName}
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onClickName
                                && props.onClickName({ type: props.type, startTime: props.startTime, endTime: endTime });
                        }}
                    >{name}</View>
                    <View className={styles.planTime}>{planTime ? planTime : '未指定'}</View>
                </View>
                <View className={`${styles.timeSpace} ${isShow && (type === 0 ? styles.showT : styles.show)}`}>
                    {type === 0 ? <>
                        <Time title="实际完成" time={endTime} ></Time>
                    </> : (<>
                        <Time title='开始时间' time={startTime}></Time>
                        <Time
                            title='计划完成'
                            time={planTime}
                            timeClassName={
                                GetNumberTime(endTime!) > GetNumberTime(planTime!)
                                    ? "item-time-warning"
                                    : ""
                            }
                        ></Time>
                        <Time
                            title='实际完成'
                            time={endTime}
                            timeClassName={
                                GetNumberTime(endTime!) > GetNumberTime(planTime!)
                                    ? "item-time-error"
                                    : "item-time-success"
                            }
                        ></Time>
                    </>)}
                </View>
            </View>
        </View>
    )
}

export default ProgressItem