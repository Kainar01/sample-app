module.exports = {
    'apps/server/**/*.ts': ['eslint --fix --config apps/server/.eslintrc.json', 'yarn test:server --bail --findRelatedTests'],
    'libs/logger/**/*.ts': 'eslint --fix --config libs/logger/.eslintrc.json',
    'libs/nestjs/redis/**/*.ts': 'eslint --fix --config libs/nestjs/redis/.eslintrc.json',
    'libs/nestjs/logger/**/*.ts': 'eslint --fix --config libs/nestjs/logger/.eslintrc.json',
    '*.{json,md}': 'prettier --write'
}
