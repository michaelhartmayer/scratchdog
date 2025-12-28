import oneComponentPerFile from './one-component-per-file/rule.js';
import componentOrganization from './component-organization/rule.js';
import hookOrganization from './hook-organization/rule.js';
import utilOrganization from './util-organization/rule.js';
import noEslintDisable from './no-eslint-disable/rule.js';
import noHtmlButtons from './no-html-buttons/rule.js';
import noHtmlHeadings from './no-html-headings/rule.js';
import noHtmlP from './no-html-p/rule.js';
import hookNaming from './hook-naming/rule.js';
import noUseEffectInComponents from './no-use-effect-in-components/rule.js';


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
    'hook-naming': hookNaming,
    'no-use-effect-in-components': noUseEffectInComponents,

  },
};

export default plugin;
