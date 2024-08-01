import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
  // 적용할 파일 패턴
  {
    files: ['**/*.{js,mjs,cjs,jsx}']
    // 파일 확장자를 기반으로 적용할 규칙을 지정합니다.
  },
  {
    // 전역 변수 설정
    languageOptions: {
      globals: globals.browser // 브라우저 환경에서 사용되는 전역 변수를 정의합니다.
    }
  },
  // JavaScript 플러그인 기본 설정을 추가합니다.
  pluginJs.configs.recommended,
  // React 플러그인 기본 설정을 추가합니다.
  pluginReact.configs.flat.recommended,
  {
    // 추가적인 규칙과 설정을 정의합니다.
    rules: {
      // 예: 코드의 일관성을 유지하기 위해 세미콜론 사용을 강제합니다.
      semi: ['error', 'always'],
      // 예: 화살표 함수의 괄호를 항상 사용하도록 합니다.
      'arrow-parens': ['error', 'always'],
      // 예: 개행을 강제합니다.
      'newline-before-return': 'error',
      // 예: 불필요한 괄호를 사용하지 않도록 강제합니다.
      'no-extra-parens': ['error', 'all']
    },
    settings: {
      // React의 JSX와 관련된 설정을 추가합니다.
      react: {
        version: 'detect' // 설치된 React의 버전을 자동으로 감지합니다.
      }
    },
    // JavaScript 코드의 품질을 높이기 위한 환경 설정
    env: {
      browser: true, // 브라우저 환경에서의 전역 변수를 활성화합니다.
      es2021: true // ES2021의 문법과 기능을 사용합니다.
    },
    // 패러미터로 `react`, `js` 플러그인을 추가합니다.
    plugins: ['react']
  }
];
