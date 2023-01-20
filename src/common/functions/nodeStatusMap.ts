export const nodeStatusMap = (isCheck: number) => {
  const map: string[] = ['未开始', '进行中', '已完成'];
  return map[isCheck];
};
