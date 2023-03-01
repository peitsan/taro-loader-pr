import React, { FC, useState } from 'react';
import { View } from '@tarojs/components';
import styles from './index.module.less';
import {
  IColumns,
  IExpandable,
  ISourceDadaItem,
  ISourceData,
} from '../../types';

interface IEachColumnContent {
  sourceData: ISourceData;
  sourceDataItem: ISourceDadaItem;
  sourceDataItemIndex: number;
  columns: IColumns;
  expandable?: IExpandable;
  contentBackgroundColor?: string;
  bordered?: boolean;
}

export const EachColumnContent: FC<IEachColumnContent> = (
  props: IEachColumnContent,
) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const {
    sourceData,
    columns,
    expandable,
    contentBackgroundColor,
    bordered,
    sourceDataItem,
    sourceDataItemIndex,
  } = props;
  return (
    <>
      <View
        key={`dataSourceItem-${sourceDataItemIndex}`}
        className={styles.columns}>
        <View
          style={{ width: '10%' }}
          className={styles.showExpand}
          onClick={() => {
            setIsShowMore(e => !e);
          }}>
          {isShowMore ? '-' : '+'}
        </View>
        {columns.map((item, index2) => {
          if (item.render) {
            return (
              <View
                key={`renderItem-${index2}`}
                style={{
                  width: item.width,
                  textAlign: 'center',
                  backgroundColor: contentBackgroundColor || 'white',
                }}>
                <View className={styles.renderItem}>
                  {item.render(
                    sourceDataItem[item.key],
                    sourceDataItem,
                    sourceData,
                  )}
                </View>
              </View>
            );
          } else {
            return (
              <View
                key={`dataIndexItem-${index2}`}
                style={{
                  width: item.width,
                  textAlign: item.align || 'center',
                  borderRight: bordered ? '1px solid #f0f0f0' : 'none',
                }}>
                <View
                  className={styles.dataIndexItem}
                  style={{
                    backgroundColor: contentBackgroundColor || 'white',
                  }}>
                  {sourceDataItem[item.dataIndex]}
                </View>
              </View>
            );
          }
        })}
      </View>
      {expandable?.expandedRowRender && (
        <View
          className={styles.expandableItem}
          style={{ height: isShowMore ? 'auto' : '0' }}>
          {expandable?.expandedRowRender(sourceDataItem)}
        </View>
      )}
    </>
  );
};
