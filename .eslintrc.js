module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/typescript/recommended", "@vue/prettier", "@vue/prettier/@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": ["off", { endOfLine: "off" }],
    "@typescript-eslint/no-explicit-any": "off",
    "prefer-const": "off",
    "no-useless-escape": "off",
    "prefer-rest-params": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "vue/no-mutating-props":"off",
    "vue/no-unused-components":'off',
    "no-unreachable":'warn'
  },
};
