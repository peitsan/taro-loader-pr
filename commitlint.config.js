module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能（feature）
        'fix', // 修补bug
        'docs', // 文档（documentation）
        'style', // 代码格式化
        'refactor', // 重构
        'chore', // 配置变动
        'revert', // 撤销之前的commit
        'merge', // 合并分支
      ],
    ],
  },
};
