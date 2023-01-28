import {
  IFaProMoreData,
  IChProMoreData,
} from '../../projectOverview/components/projectItem/moreType';

export default interface IShowMore {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  moreData: IFaProMoreData | IChProMoreData;
}
