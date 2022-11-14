export const progressMap = (progressId: string) => {
  const map: any[][] = [
    [
      "可研技术收口",
      "technologyClose",
    ],
    [
      "初步设计部署会",
      "initDeployment",
    ],
    [
      "中间检查",
      "interinspection",
    ],
    [
      "建管单位内审",
      "constructionAudit",
    ],
    [
      "市内公司内审",
      "cityAudit",
    ],
    [
      "正式评审前检查",
      "formReview",
    ],
    [
      "国网公司正式评审",
      "officialGrid",
    ],
    [
      "初设批复",
      "earlyReply",
    ],
    [
      "专项评估批复及证件办理",
      "specialHandle",
    ],
    [
      "经研院预评审",
      "preInstitute",
    ],
    [
      "市公司正式评审",
      "companyApproval",
    ],
  ];
  return map[Number(progressId)];
};
