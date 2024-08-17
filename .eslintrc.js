module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // This is necessary for Electron apps since you'll be running in a Node environment
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser', // Use TypeScript parser
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enable parsing of JSX
    },
    ecmaVersion: 'latest', // Use the latest ECMAScript standard
    sourceType: 'module', // Allow using ES modules
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import',
    'jsx-a11y',
    'prettier',
    'react-refresh', // Plugin for React Fast Refresh
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // Not necessary in React 17+
    'react/prop-types': 'off', // We are using TypeScript for type checking
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable requirement for explicit return types on functions
    '@typescript-eslint/no-explicit-any': 'warn', // Warn when 'any' type is used
    'prettier/prettier': 'warn', // Prettier-related warnings
    'react-refresh/only-export-components': 'warn', // React Fast Refresh plugin rule
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect React version
    },
  },
}
