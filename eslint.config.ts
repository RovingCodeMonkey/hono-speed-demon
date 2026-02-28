// @ts-check
import prettier from 'eslint-config-prettier'
import drizzle from 'eslint-plugin-drizzle'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      drizzle,
    },
    rules: {
      ...drizzle.configs.recommended.rules,
      'drizzle/enforce-delete-with-where': 'error',
      'drizzle/enforce-update-with-where': ['error'],
    },
  },
  prettier,
  {
    ignores: ['drizzle/**', 'dist/**'],
  }
)
