module.exports = {
    "rules": {
        // 强制使用一致的缩进
        "indent": [
          "error", 2
        ],
        // 强制使用一致的换行风格
        "linebreak-style": [
            "error",
            "unix"
        ],
        // 强制使用一致的反勾号、双引号或单引号
        "quotes": [
            "error",
            "single" // backtick、double、single
        ],
        // 要求或禁止使用分号代替 ASI
        "semi": [
            "error",
            "always"
        ],
        "comma-spacing": [2, {
            "before": false,
            "after": true
        }],
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
     },

    "plugins": [ "html" ],
    "settings": {
        'html/html-extensions': ['.wxml'],
        "html/indent": "0",   // code should start at the beginning of the line (no initial indentation).
        "html/indent": "+2",  // indentation is the <script> indentation plus two spaces.
        "html/indent": "tab", // indentation is one tab at the beginning of the line.
    },
     
}