import Taro from '@tarojs/taro';
import React, { FC, useState, useRef } from 'react';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import styles from './index.module.less';
import IProjectAccordion from './type';

export const ProjectAccordion: FC<IProjectAccordion> = (
  props: IProjectAccordion,
) => {
  const itemRef = useRef();
  const [isShow, setIsShow] = useState(false);
  const [arrType, setArrType] = useState<'left' | 'down'>('left');
  let fullQuestion = 0;
  // 设置过渡动画
  const clickHandler = e => {
    e.stopPropagation();
    const ele = itemRef.current;
    // @ts-ignore
    const childLen = ele.childNodes.length;
    // @ts-ignore
    ele.style.transition = `max-height ${0.4 * childLen}s ease`;
    arrType === 'left' ? setArrType('down') : setArrType('left');
    if (isShow === false) {
      // @ts-ignore
      ele.style['maxHeight'] = childLen * 90 + 'px';
    } else {
      // @ts-ignore
      ele.style['maxHeight'] = '0';
    }
    setIsShow(e => !e);
  };

  const {
    fatherProject,
    sonProject,
    naviToFatherPro,
    naviToSonPro,
    clickShowFatherMore,
    clickShowSonMore,
    createProject,
    fatherScope,
    sonScope,
    showQuestion,
  } = props;

  sonProject.forEach(item => {
    fullQuestion += item.uncheckedQuestionCount;
  });
  return (
    <>
      <View className={styles.proItem}>
        <View className={styles.fatherPro} onClick={e => clickHandler(e)}>
          <View
            className={styles.faProName}
            onClick={e =>
              naviToFatherPro &&
              naviToFatherPro(e, fatherProject.name, fatherProject.id)
            }>
            {fatherProject.name}
          </View>
          <View className={styles.right}>
            {clickShowFatherMore && (
              <View
                className={styles.moreInfo}
                onClick={e => {
                  clickShowFatherMore(e, fatherProject);
                }}>
                更多信息
              </View>
            )}

            {/* 新建小项目 */}
            {/* 还没有设置权限 */}
            {createProject && (
              <View
                className={styles.addChPro}
                onClick={e => {
                  createProject(e, fatherProject.scope, fatherProject.id);
                }}>
                新建
              </View>
            )}
            {showQuestion && <View>{`未审批问题数量: ${fullQuestion}`}</View>}
            {fatherScope !== undefined && (
              <View className={styles.addChPro}>
                {fatherScope === 1 ? '规模以上' : '规模以下'}
              </View>
            )}
            <AtIcon value={`chevron-${arrType}`} className={styles.arrow} />
          </View>
        </View>
        <View ref={itemRef} className={`${styles.items}`}>
          {sonProject.map((item, index) => {
            return (
              <View className={styles.sonPro} key={index}>
                <View
                  className={styles.sonProName}
                  onClick={e => {
                    naviToSonPro &&
                      naviToSonPro(
                        e,
                        item.id,
                        item.name,
                        fatherProject.id,
                        fatherProject.name,
                      );
                  }}>
                  {item.name}
                </View>
                {showQuestion && (
                  <View>
                    {`未审批问题数量: ` + item.uncheckedQuestionCount}
                  </View>
                )}
                {clickShowSonMore && (
                  <View
                    className={styles.moreInfo}
                    onClick={e => {
                      clickShowSonMore(e, {
                        startTime: item.startTime,
                        scope: item.scope,
                        progressNow: item.progressNow?.name,
                      });
                    }}>
                    更多信息
                  </View>
                )}
                {sonScope && (
                  <View className={styles.addChPro}>{sonScope}</View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
};
