import path from 'node:path';

/** @type {import('ts-jest').JestConfigWithTsJest} * */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    '^@libs(.*)$': path.resolve(__dirname, 'app/src/libs$1'),
    '^@routes(.*)$': path.resolve(__dirname, 'app/src/routes$1'),
    '^@middlewares(.*)$': path.resolve(__dirname, 'app/src/middlewares$1'),
    '^@enums(.*)$': path.resolve(__dirname, 'app/src/enums$1'),
    '^@assets(.*)$': path.resolve(__dirname, 'app/src/assets$1'),
    '^@repositories(.*)$': path.resolve(__dirname, 'app/src/repositories$1'),
    '^@services(.*)$': path.resolve(__dirname, 'app/src/services$1'),
    '^@types(.*)$': path.resolve(__dirname, 'app/src/types$1'),
    '^@src(.*)$': path.resolve(__dirname, 'app/src/$1'),
    '^@app(.*)$': path.resolve(__dirname, 'app/$1'),
  },
};
// TODO : faire le moduleNameMappper correct pour ce projet
