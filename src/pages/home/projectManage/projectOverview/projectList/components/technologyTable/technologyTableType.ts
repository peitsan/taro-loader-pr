export interface technologyItem {
    '审核内容':string;
    '依据':string;
    '审核意见':string | null;
    '闭环情况':string | null;
    'id':number;
}

export interface technologyList {
    'itemList':technologyItem[]
    '问题处置':string | null;
    '主要建议意见':string | null;
}