module.exports = {
    'apps/server/**/*.ts': ['eslint --fix --config apps/server/.eslintrc.json', 'yarn test:server --bail --findRelatedTests'],
    'libs/util/logger/**/*.ts': 'eslint --fix --config libs/util/logger/.eslintrc.json',
    'libs/nestjs/redis/**/*.ts': 'eslint --fix --config libs/nestjs/redis/.eslintrc.json',
    'libs/util/nestjs/logger/**/*.ts': 'eslint --fix --config libs/util/nestjs/logger/.eslintrc.json',
    '*.{json,md}': 'prettier --write'
}
