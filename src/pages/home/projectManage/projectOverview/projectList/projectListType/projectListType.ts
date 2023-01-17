//公共
export interface responsible {
  id: number;
  nickname: string;
  phone: string;
}

export interface attachment {
  id: string;
  type: string;
  url: string;
}

export interface progress {
  name: string;
  type: number;
}

//issue
export interface questions {
  id: number;
  name: string;
  responsibles: responsible[];
  status: string;
  attachment: number[];
  planTime: string;
  code: number;
}

export interface issuesItem {
  id: number;
  name: string;
  questions: questions[];
  progress: progress;
}

//problem
export interface reasons {
  id: number;
  name: string;
  responsibles: responsible[];
  status: string;
  attachment: number[];
  planTime: string;
  code: number;
}

export interface problemsItem {
  id: number;
  name: string;
  reasons: reasons[];
  progress: progress;
}

//protocols
export interface opinions {
  id: number;
  name: string;
  responsibles: responsible[];
  status: string;
  attachment: number[];
  planTime: string;
  code: number;
}

export interface protocolsItem {
  id: number;
  name: string;
  reasons: opinions[];
  progress: progress;
}

//procedures
export interface conditions {
  id: number;
  name: string;
  responsibles: responsible[];
  status: string;
  attachment: number[];
  planTime: string;
  code: number;
}

export interface proceduresItem {
  id: number;
  name: string;
  reasons: conditions[];
  progress: progress;
}

export interface tabListItem {
  title: string;
}
