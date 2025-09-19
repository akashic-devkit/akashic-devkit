import { config } from '@akashic-devkit/eslint-config/react-internal'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  ...config,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    ignores: ['dist'],
  },
]
