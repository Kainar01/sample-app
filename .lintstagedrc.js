module.exports = {
    'apps/server/**/*.ts': 'eslint --fix --config apps/server/.eslintrc.json',
    'libs/util/logger/**/*.ts': 'eslint --fix --config libs/util/logger/.eslintrc.json',
    'libs/util/nestjs/**/*.ts': 'eslint --fix --config libs/util/nestjs/.eslintrc.json',
    '*.{json,md}': 'prettier --write'
}
