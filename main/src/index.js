"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaLanguage = exports.FormulaLanguageConfig = exports.TextStyle = exports.COMPLETION_TYPES = exports.TokenConfig = exports.functionDefinitions = void 0;
var grammar_1 = require("./grammar");
var highlight_1 = require("@codemirror/highlight");
var autocomplete_1 = require("@codemirror/autocomplete");
var language_1 = require("@codemirror/language");
var view_1 = require("@codemirror/view");
var lint_1 = require("@codemirror/lint");
var basic_setup_1 = require("@codemirror/basic-setup");
var dateAndTime_json_1 = __importDefault(require("./function-definitions/dateAndTime.json"));
var statistical_json_1 = __importDefault(require("./function-definitions/statistical.json"));
var array_json_1 = __importDefault(require("./function-definitions/array.json"));
var engineering_json_1 = __importDefault(require("./function-definitions/engineering.json"));
var financial_json_1 = __importDefault(require("./function-definitions/financial.json"));
var information_json_1 = __importDefault(require("./function-definitions/information.json"));
var logical_json_1 = __importDefault(require("./function-definitions/logical.json"));
var lookup_and_reference_json_1 = __importDefault(require("./function-definitions/lookup-and-reference.json"));
var math_and_trigo_json_1 = __importDefault(require("./function-definitions/math-and-trigo.json"));
var matrix_json_1 = __importDefault(require("./function-definitions/matrix.json"));
var operator_json_1 = __importDefault(require("./function-definitions/operator.json"));
var text_json_1 = __importDefault(require("./function-definitions/text.json"));
exports.functionDefinitions = [
    dateAndTime_json_1.default,
    statistical_json_1.default,
    array_json_1.default,
    engineering_json_1.default,
    financial_json_1.default,
    information_json_1.default,
    logical_json_1.default,
    lookup_and_reference_json_1.default,
    math_and_trigo_json_1.default,
    matrix_json_1.default,
    operator_json_1.default,
    text_json_1.default,
];
exports.TokenConfig = {
    Variable: highlight_1.tags.variableName,
    ArtithMeticOperators: highlight_1.tags.operator,
    LogicalOperators: highlight_1.tags.logicOperator,
    Functions: highlight_1.tags.keyword,
    "( )": highlight_1.tags.paren,
    String: highlight_1.tags.string,
    Number: highlight_1.tags.number,
    Assign: highlight_1.tags.operator,
};
var COMPLETION_TYPES;
(function (COMPLETION_TYPES) {
    COMPLETION_TYPES["KEYWORD"] = "keyword";
    COMPLETION_TYPES["VARIABLE"] = "variable";
})(COMPLETION_TYPES = exports.COMPLETION_TYPES || (exports.COMPLETION_TYPES = {}));
var AutoComplete = /** @class */ (function () {
    function AutoComplete() {
        Object.defineProperty(this, "label", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "info", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "detail", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apply", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    return AutoComplete;
}());
var TextStyle = /** @class */ (function () {
    function TextStyle() {
        Object.defineProperty(this, "tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fontStyle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    return TextStyle;
}());
exports.TextStyle = TextStyle;
var FormulaLanguageConfig = /** @class */ (function () {
    function FormulaLanguageConfig() {
        Object.defineProperty(this, "styleTags", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: exports.TokenConfig
        });
        Object.defineProperty(this, "functionNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "style", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "autoCompletionOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "errorMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "containerId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    return FormulaLanguageConfig;
}());
exports.FormulaLanguageConfig = FormulaLanguageConfig;
var FormulaLanguage = /** @class */ (function () {
    function FormulaLanguage(config) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "editorView", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        config.functionNames.forEach(function (functioName) {
            exports.TokenConfig[functioName] = highlight_1.tags.keyword;
        });
        config.style = config.style ? config.style : [];
        this.config = config;
    }
    Object.defineProperty(FormulaLanguage.prototype, "autoCompletionLogic", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (context) {
            console.log(this.config);
            var word = context.matchBefore(/\w*/);
            if (word.from == word.to && !context.explicit)
                return null;
            return {
                from: word.from,
                options: this.config.autoCompletionOptions,
            };
        }
    });
    Object.defineProperty(FormulaLanguage.prototype, "linterLogic", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (view) {
            var _this = this;
            console.log("-----");
            var diag = [];
            (0, language_1.syntaxTree)(view.state).iterate({
                enter: function (type, from, to, _get) {
                    if (type.isError) {
                        diag.push({
                            from: from,
                            to: to,
                            severity: "error",
                            message: _this.config.errorMessage,
                        });
                    }
                },
            });
            return diag;
        }
    });
    Object.defineProperty(FormulaLanguage.prototype, "getLanguage", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            console.log(this.config.styleTags);
            console.log(this.config.style);
            var parserWithMetadata = grammar_1.parser.configure({
                props: [(0, highlight_1.styleTags)(this.config.styleTags)],
            });
            var Language = language_1.LRLanguage.define({
                parser: parserWithMetadata,
            });
            var highLightStyle = highlight_1.HighlightStyle.define(this.config.style);
            var dummy = function (c) {
                return _this.autoCompletionLogic(c);
            };
            var dummy1 = function (c) {
                return _this.linterLogic(c);
            };
            var t = new language_1.LanguageSupport(Language, [
                highLightStyle,
                (0, autocomplete_1.autocompletion)({
                    override: [dummy],
                    activateOnTyping: true,
                }),
                (0, lint_1.linter)(dummy1),
            ]);
            return t;
        }
    });
    Object.defineProperty(FormulaLanguage.prototype, "displayEditor", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            console.log(1);
            this.editorView = new view_1.EditorView({
                state: basic_setup_1.EditorState.create({
                    extensions: [basic_setup_1.basicSetup, this.getLanguage()],
                }),
                parent: document.getElementById(this.config.containerId),
            });
        }
    });
    Object.defineProperty(FormulaLanguage.prototype, "getValue", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            console.log(this.editorView.state.toJSON().doc.split("\n"));
        }
    });
    return FormulaLanguage;
}());
exports.FormulaLanguage = FormulaLanguage;
