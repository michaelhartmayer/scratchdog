import oneComponentPerFile from './one-component-per-file/rule.js';
import componentOrganization from './component-organization/rule.js';
import hookOrganization from './hook-organization/rule.js';
import utilOrganization from './util-organization/rule.js';
import noEslintDisable from './no-eslint-disable/rule.js';
import noHtmlButtons from './no-html-buttons/rule.js';
import noHtmlHeadings from './no-html-headings/rule.js';
import noHtmlP from './no-html-p/rule.js';

const plugin = {
  rules: {
    'one-component-per-file': oneComponentPerFile,
    'component-organization': componentOrganization,
    'hook-organization': hookOrganization,
    'util-organization': utilOrganization,
    'no-eslint-disable': noEslintDisable,
    'no-html-buttons': noHtmlButtons,
    'no-html-headings': noHtmlHeadings,
    'no-html-p': noHtmlP,
  },
};

export default plugin;
