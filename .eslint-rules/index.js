import oneComponentPerFile from './one-component-per-file/rule.js';
import componentOrganization from './component-organization/rule.js';
import hookOrganization from './hook-organization/rule.js';
import utilOrganization from './util-organization/rule.js';
import noEslintDisable from './no-eslint-disable/rule.js';

const plugin = {
  rules: {
    'one-component-per-file': oneComponentPerFile,
    'component-organization': componentOrganization,
    'hook-organization': hookOrganization,
    'util-organization': utilOrganization,
    'no-eslint-disable': noEslintDisable,
  },
};

export default plugin;
