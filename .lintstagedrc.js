module.exports = {
    'apps/server/**/*.ts': 'eslint --fix --config apps/server/.eslintrc.json',
    'libs/util/logger/**/*.ts': 'eslint --fix --config libs/util/logger/.eslintrc.json',
    'libs/util/nestjs/logger/**/*.ts': 'eslint --fix --config libs/util/nestjs/logger/.eslintrc.json',
    '*.{json,md}': 'prettier --write'
}
