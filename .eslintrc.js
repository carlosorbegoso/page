module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // ===== REGLAS DE CALIDAD DE CÓDIGO =====
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    
    // ===== REGLAS DE FORMATO =====
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    
    // ===== REGLAS DE FUNCIONES =====
    'func-style': ['error', 'expression'],
    'arrow-spacing': 'error',
    'no-confusing-arrow': 'error',
    
    // ===== REGLAS DE OBJETOS =====
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'computed-property-spacing': ['error', 'never'],
    
    // ===== REGLAS DE STRINGS =====
    'template-curly-spacing': 'error',
    'no-useless-concat': 'error',
    
    // ===== REGLAS DE VARIABLES =====
    'no-unused-expressions': 'error',
    'no-sequences': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    
    // ===== REGLAS DE CONDICIONALES =====
    'no-constant-condition': 'error',
    'no-duplicate-else-if': 'error',
    
    // ===== REGLAS DE LOOPS =====
    'no-unreachable-loop': 'error',
    'no-extra-boolean-cast': 'error',
    
    // ===== REGLAS DE MÓDULOS =====
    'import/no-unresolved': 'off',
    'import/extensions': 'off'
  },
  globals: {
    // ===== GLOBALES DE THREE.JS =====
    'THREE': 'readonly',
    
    // ===== GLOBALES DEL NAVEGADOR =====
    'window': 'readonly',
    'document': 'readonly',
    'console': 'readonly',
    'performance': 'readonly',
    'requestAnimationFrame': 'readonly',
    'cancelAnimationFrame': 'readonly',
    
    // ===== GLOBALES PERSONALIZADOS =====
    'styleManager': 'writable',
    'visualEngine': 'writable',
    'progressSystem': 'writable',
    'languageSystem': 'writable',
    'uiAnimationsEngine': 'writable',
    'notificationSystem': 'writable',
    'interactiveParticlesSystem': 'writable',
    'scrollEffectsEngine': 'writable'
  }
};
