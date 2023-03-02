import { View } from '@tarojs/components';
import React, { FC, useState } from 'react';
import styles from './index.module.less';
import { IColumns, IExpandable } from './types';
import type { ISourceData } from './types';
import { EachColumnContent } from './components';

interface IType {
  columns: IColumns;
  sourceData: ISourceData;
  bordered?: boolean;
  header?: () => string;
  footer?: () => string;
  titleBackgroundColor?: string;
  contentBackgroundColor?: string;
  expandable?: IExpandable;
}

export const MTable: FC<IType> = (props: IType) => {
  const {
    columns,
    sourceData,
    bordered = false,
    header,
    footer,
    expandable,
    titleBackgroundColor,
    contentBackgroundColor,
  } = props;

  return (
    <View
      className={styles.table}
      style={{
        border: bordered ? '2px solid #f0f0f0' : 'none',
        borderRadius: '8px',
      }}>
      {header && <View className={styles.header}>{header()}</View>}
      <View className={styles.title}>
        <View style={{ width: '10%', borderRight: '1px solid #f0f0f0' }}></View>
        {columns.map((item, index) => {
          return (
            <View
              key={`title-${index}`}
              style={{
                width: item.width,
                textAlign: item.align || 'center',
                borderRight: bordered ? '1px solid #f0f0f0' : 'none',
                fontWeight: 'bolder',
              }}>
              <View
                className={styles.titleItem}
                style={{ backgroundColor: titleBackgroundColor || '#fafafa' }}>
                {item.title}
              </View>
            </View>
          );
        })}
      </View>
      {sourceData.map((item, index) => {
        return (
          <EachColumnContent
            key={`eachColumnContent-${index}`}
            sourceData={sourceData}
            sourceDataItem={item}
            sourceDataItemIndex={index}
            columns={columns}
            bordered={bordered}
            contentBackgroundColor={contentBackgroundColor}
            expandable={expandable}
          />
        );
      })}
      {footer && <View className={styles.footer}>{footer()}</View>}
    </View>
  );
};
