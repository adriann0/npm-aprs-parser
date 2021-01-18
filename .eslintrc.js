module.exports = {
    'env': {
        'es6': true,
        'node': true,
        'commonjs': true,
        'mocha': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'sourceType': 'module',
        'ecmaVersion': 2018
    },
    'globals':{
    },
    'rules': {
        'indent': [
            'warn',
            4,
            {'SwitchCase': 1}
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-unused-vars':0,
        'no-empty':0,
        'no-undef': ['error'],
        'no-console':0,
        'prefer-const': 'warn',
        //'object-shorthand': ['warn', 'always'],
        'quotes': ['error', 'single'],
        'prefer-arrow-callback': ['warn', { 'allowNamedFunctions': true }],
        'no-trailing-spaces':['error'],
        'callback-return': ['warn'],
    }
};
