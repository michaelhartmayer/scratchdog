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
import noDirectE2EState from './no-direct-e2e-state/rule.js';
import noCommonjsInEslintRules from './no-commonjs-in-eslint-rules/rule.js';
import mustTestGamestate from './must-test-gamestate/rule.js';

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
    'no-direct-e2e-state': noDirectE2EState,
    'no-commonjs-in-eslint-rules': noCommonjsInEslintRules,
    'must-test-gamestate': mustTestGamestate,
  },
};

export default plugin;
