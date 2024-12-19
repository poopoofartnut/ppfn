import type { MinifyOptions as UglifyOptions } from "uglify-js";
import { minify as uglify } from "uglify-js";
import type { UnsafeAny } from "@balsamic/dev";
import { devLog } from "@balsamic/dev";
import { sizeDifference } from "../lib/logging";
import { browserPureFunctions, global_defs, mangleConfig } from "../lib/js-config";

// fixes for incomplete types in @swc/core minify that is still experimental
declare module "uglify-js" {
  export interface CompressOptions {
    annotations?: boolean;
    computed_props?: boolean;
  }
}

export async function jsUglify(source: string, settings: JsUglifySettings) {
  return devLog.timed(
    async function js_uglify() {
      const uglifyOptions = getUglifyOptions(settings);

      const result = uglify(source, uglifyOptions).code || source;

      this.setSuccessText(sizeDifference(source, result));
      return result;
    },
    { spinner: true, timed: settings.timed === undefined || !!settings.timed },
  );
}

export interface JsUglifySettings {
  mangle?: boolean;
  varify: boolean;
  sequences: boolean;
  final: boolean;
  reduce_vars: boolean;
  join_vars: boolean;
  computed_props: boolean;
  timed?: boolean;
  inline: boolean;
}

export function getUglifyOptions(settings: JsUglifySettings, nameCache?: Record<string, unknown>): UglifyOptions {
  const module = true;
  const toplevel = true;
  const passes = 26;
  const mangle = settings.mangle;

  const options: UglifyOptions = {
    // Use when minifying an ES6 module.
    // "use strict" is implied and names can be mangled on the top scope.
    // If compress or mangle is enabled then the toplevel option will be enabled.
    module,

    // set to true if you wish to enable top level variable and function name mangling
    // and to drop unused variables and functions.
    toplevel,

    // Sourcemap support
    sourceMap: false,

    nameCache,

    ie8: false,
    keep_fnames: !mangle,

    // Parser options
    parse: {
      bare_returns: false,
      html5_comments: false,
      shebang: true,
    },

    // Compress options
    compress: {
      // (default: true) — Pass false to disable potentially dropping functions marked as "pure".
      // A function call is marked as "pure" if a comment annotation /*@__PURE__*/ or /*#__PURE__*/
      // immediately precedes the call. For example: /*@__PURE__*/foo();
      annotations: true,

      // Global definitions for conditional compilation
      global_defs,

      // remove redundant or non-standard directives
      directives: true,

      // Inline single-use functions when possible. Depends on reduce_vars being enabled.
      // Disabling this option sometimes improves performance of the output code.
      reduce_funcs: settings.reduce_vars,

      // replace arguments[index] with function parameter name whenever possible.
      arguments: true,

      // various optimizations for boolean context, for example !!a ? b : c → a ? b : c
      booleans: true,

      // Collapse single-use non-constant variables, side effects permitting.
      collapse_vars: true,

      // apply certain optimizations to binary nodes,
      //  e.g. !(a <= b) → a > b (only when unsafe_comps), attempts to negate binary nodes,
      //  e.g. a = !b && !c && !d && !e → a=!(b||c||d||e) etc.
      comparisons: true,

      // apply optimizations for if-s and conditional expressions
      conditionals: true,

      // remove unreachable code
      dead_code: true,

      // discard calls to console.* functions.
      // If you wish to drop a specific function call such as console.info
      drop_console: true,

      // remove debugger; statements
      drop_debugger: true,

      // attempt to evaluate constant expressions
      evaluate: settings.inline && settings.computed_props,

      // Pass true to preserve completion values from terminal statements without return, e.g. in bookmarklets.
      expression: false,

      // hoist function declarations
      hoist_funs: true,

      // hoist properties from constant object and array literals into regular variables subject to a set of constraints.
      // For example: var o={p:1, q:2}; f(o.p, o.q); is converted to f(1, 2)
      hoist_props: true,

      // hoist var declarations
      // (this is false by default because it seems to increase the size of the output in general)
      hoist_vars: false,

      // optimizations for if/return and if/continue
      if_return: true,

      // Inline calls to function with simple/return statement
      inline: settings.inline === undefined || !!settings.inline,

      // join consecutive var statements
      join_vars: settings.join_vars,

      // Prevents the compressor from discarding unused function arguments.
      // You need this for code which relies on Function.length
      keep_fargs: false,

      // Pass true to prevent the compressor from discarding function names.
      // Pass a regular expression to only keep function names matching that regex
      keep_fnames: !mangle,

      // Pass true to prevent Infinity from being compressed into 1/0,
      // which may cause performance issues on Chrome.
      keep_infinity: false,

      // optimizations for do, while and for loops when we can statically determine the condition.
      loops: true,

      // Pass true when compressing an ES6 module. Strict mode is implied and the toplevel option as well.
      module,

      // negate "Immediately-Called Function Expressions" where the return value is discarded,
      // to avoid the parens that the code generator would insert.
      negate_iife: false,

      // The maximum number of times to run compress.
      // In some cases more than one pass leads to further compressed code.
      passes,

      // Rewrite property access using the dot notation, for example foo["bar"] → foo.bar
      properties: !!settings.computed_props,

      // You can pass an array of names and Terser will assume that those functions do not produce side effects. DANGER: will not check if the name is redefined in scope.
      pure_funcs: browserPureFunctions,

      // If you pass true for this, Terser will assume that object property access
      // (e.g. foo.bar or foo["bar"]) doesn't have any side effects. Specify "strict"
      // to treat foo.bar as side-effect-free only when foo is certain to not throw,
      // i.e. not null or undefined.
      pure_getters: true,

      // Improve optimization on variables assigned with and used as constant values.
      reduce_vars: settings.reduce_vars,

      // join consecutive simple statements using the comma operator.
      sequences: settings.sequences ? (100000 as any) : 0,

      // Remove expressions which have no side effects and whose results aren't used.
      side_effects: true,

      // de-duplicate and remove unreachable switch branches
      switches: true,

      // drop unreferenced functions ("funcs") and/or variables ("vars") in the top level scope.
      // Set to true to drop both unreferenced functions and variables)
      toplevel,

      // prevent specific toplevel functions and variables from unused removal. Implies toplevel.
      top_retain: null,

      // Transforms typeof foo == "undefined" into foo === void 0
      typeofs: true,

      // apply "unsafe" transformations. It enables some transformations that might break code
      // logic in certain contrived cases, but should be fine for most code.
      // It assumes that standard built-in ECMAScript functions and classes have not been
      // altered or replaced.
      unsafe: true,

      // Reverse < and <= to > and >= to allow improved compression.
      // This might be unsafe when an at least one of two operands is an object with
      // computed values due the use of methods like get, or valueOf.
      // This could cause change in execution order after operands in the comparison are switching.
      unsafe_comps: true,

      // compress and mangle Function(args, code) when both args and code are string literals.
      unsafe_Function: true,

      // optimize numerical expressions like 2 * x * 3 into 6 * x, which may give imprecise floating point results.
      unsafe_math: true,

      // optimize expressions like Array.prototype.slice.call(a) into [].slice.call(a)
      unsafe_proto: true,

      // enable substitutions of variables with RegExp values the same way as if they are constants.
      unsafe_regexp: true,

      // substitute void 0 if there is a variable named undefined in scope
      // (variable name will be mangled, typically reduced to a single character)
      unsafe_undefined: true,

      // drop unreferenced functions and variables (simple direct variable assignments
      // do not count as references unless set to "keep_assign")
      unused: true,

      // Apply optimizations to assignment expressions
      assignments: true,

      // convert declarations from var to function whenever possible
      functions: true,

      // hoist export statements to facilitate various compress and mangle optimizations.
      hoist_exports: true,

      // drop unreferenced import symbols when used with unused
      imports: true,

      // combine and reuse variables.
      merge_vars: true,

      // compact duplicate keys in object literals
      objects: true,

      // compact string concatenations
      strings: true,

      // Compact template literals by embedding expressions and/or converting to string literals, e.g. foo ${42} → "foo 42"
      templates: true,

      // convert block-scoped declaractions into var whenever safe to do so
      varify: settings.varify,

      // Support non-standard Safari/Webkit. By default UglifyJS will not try to be Safari-proof.
      webkit: false,
    },

    // Mangle options
    mangle: mangle
      ? {
          // Pass true to mangle names visible in scopes where eval or with are used.
          eval: true,

          // Pass true to not mangle function names.
          // Pass a regular expression to only keep class names matching that regex.
          // Useful for code relying on Function.prototype.name.
          // See also: the keep_fnames compress option.
          keep_fnames: false,

          // Pass an array of identifiers that should be excluded from mangling. Example: ["foo", "bar"].
          reserved: [...mangleConfig.reserved],

          // Mangle properties - optimizes a lot but is very dangerous. Enables only with properties starting with $
          /* properties: {
            // Use true to allow the mangling of builtin DOM properties. Not recommended to override this setting.
            builtins: false,

            // Mangle names with the original name still present. Pass an empty string "" to enable, or a non-empty string to set the debug suffix.
            debug: false,

            // Only mangle unquoted property names.
            //  true: Quoted property names are automatically reserved and any unquoted property names will not be mangled.
            //  'strict': Advanced, all unquoted property names are mangled unless explicitly reserved.
            keep_quoted: true,

            // Pass a RegExp literal or pattern string to only mangle property matching the regular expression.
            regex: /^[$_]/,
          }, */

          // Pass true to mangle names declared in the top level scope.
          toplevel,
        }
      : false,

    // Output options
    output: {
      // escape Unicode characters in strings and regexps
      // (affects directives with non-ascii characters becoming invalid)
      ascii_only: false,

      // whether to actually beautify the output
      beautify: !settings.final,

      // always insert braces in if, for, do, while or with statements, even if their body is a single statement.
      braces: false,

      // false to omit comments in the output
      comments: settings.final ? false : "all",

      // escape HTML comments and the slash in occurrences of </script> in strings
      inline_script: true,

      // when turned on, prevents stripping quotes from property names in object literals.
      keep_quoted_props: !settings.computed_props,

      // maximum line length (for minified code)
      max_line_len: false,

      // when passed it must be a string and it will be prepended to the output literally.
      // The source map will adjust for this text.
      // Can be used to insert a comment containing licensing information, for example.
      preamble: undefined as UnsafeAny,

      // pass true to quote all keys in literal objects
      quote_keys: false,

      // preferred quote style for strings (affects quoted property names and directives as well):
      //  0 -- prefers double quotes, switches to single quotes when there are more double quotes in the string itself. 0 is best for gzip size.
      //  1 -- always use single quotes
      //  2 -- always use double quotes
      //  3 -- always use the original quotes
      quote_style: 0,

      // separate statements with semicolons.
      // If you pass false then whenever possible we will use a newline instead of a semicolon.
      semicolons: true,

      // preserve shebang #! in preamble (bash scripts)
      shebang: false,

      // enable workarounds for WebKit bugs. PhantomJS users should set this option to true.
      webkit: false,

      // pass true to wrap immediately invoked function expressions.
      wrap_iife: false,
    },
  };

  return options;
}
