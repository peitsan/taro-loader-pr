import { ITouchEvent } from '@tarojs/components';
import {
  IFatherProject,
  IChildrenProject,
} from '../../projectOverview/types/projectType';
import {
  IFaProMoreData,
  IChProMoreData,
} from '../../projectOverview/components/projectItem/moreType';

export interface INaviToFatherPro {
  (e: ITouchEvent, projectName: string, projectId: number): void;
}

export interface INaviToSonPro {
  (
    e: ITouchEvent,
    projectId: number,
    ProjectName: string,
    fatherId: number,
    fatherProName: string,
  ): void;
}

export interface IShowMore {
  (e: ITouchEvent, data: IFaProMoreData | IChProMoreData): void;
}

export interface ICreatePro {
  (e: ITouchEvent, scope: number, id: number): void;
}

export default interface IProjectAccordion {
  fatherProject: IFatherProject;
  sonProject: IChildrenProject[];
  naviToFatherPro?: INaviToFatherPro;
  naviToSonPro?: INaviToSonPro;
  clickShowFatherMore?: IShowMore;
  clickShowSonMore?: IShowMore;
  createProject?: ICreatePro;
  showQuestion?: boolean;
  fatherScope?: number;
  sonScope?: string;
}
