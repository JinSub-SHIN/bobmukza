import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default tseslint.config(
	{ ignores: ['dist'] },
	{
		extends: [
			js.configs.recommended,
			...tseslint.configs.recommended,
			configPrettier,
		],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			prettier,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'@typescript-eslint/no-explicit-any': 'error',
			eqeqeq: ['error', 'always'],
			'prefer-destructuring': [
				'error',
				{
					VariableDeclarator: {
						array: false,
						object: true,
					},
					AssignmentExpression: {
						array: false,
						object: false,
					},
				},
			],
			'no-array-constructor': 'error',
			'no-useless-concat': 'error',
			'no-useless-escape': 'error',
			'no-eval': 'error',
			'no-multiple-empty-lines': ['error', { max: 1 }],
			'no-shadow': 'off',
			'@typescript-eslint/no-shadow': 'error',
			'prefer-const': 'error',
			'no-useless-rename': 'error',
			'no-unneeded-ternary': 'error',
			'no-no-unused-vars': 'warn',
		},
	},
)
