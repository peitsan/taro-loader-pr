import { UnitsType } from '@/redux/units/slice';

export interface ReplyQuestionProps {
  isReplyModal: boolean;
  okReplyModal: any;
  selectRecord: any;
  selectIndex: number;
}
export interface FileProps {
  file: {
    url: String;
    size: number;
  };
  url: Blob;
}
