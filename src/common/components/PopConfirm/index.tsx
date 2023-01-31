import { AtModal } from 'taro-ui';
import { PopConfirmProps } from './indexProps';

const PopConfirm: React.FC<PopConfirmProps> = selfProps => {
  const { isPop, okIsPop, operation, msg, todo } = selfProps;
  return (
    <AtModal
      isOpened={isPop}
      title={`确定要${operation}吗?`}
      cancelText='取消'
      confirmText='确认'
      onClose={okIsPop}
      onCancel={okIsPop}
      onConfirm={todo}
      content={msg}
    />
  );
};

export default PopConfirm;
