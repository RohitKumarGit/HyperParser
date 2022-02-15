"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
require("./style.css");
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
var funtions = [
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
var autoCompletionOptions = [];
var functionNames = [];
funtions.forEach(function (fn) {
    fn.forEach(function (def) {
        functionNames.push(def.functionName);
        autoCompletionOptions.push({
            label: def.functionName,
            type: _1.COMPLETION_TYPES.KEYWORD,
            info: def.description,
        });
    });
});
var variableNames = ["single_sel", "$status"];
variableNames.forEach(function (t) {
    autoCompletionOptions.push({
        label: t,
        type: _1.COMPLETION_TYPES.VARIABLE,
        apply: "{".concat(t, "}"),
    });
});
var highlight_1 = require("@codemirror/highlight");
var formulaLanguage = new _1.FormulaLanguage({
    styleTags: _1.TokenConfig,
    functionNames: functionNames,
    containerId: "app",
    autoCompletionOptions: autoCompletionOptions,
    errorMessage: "There's some error",
    style: [
        {
            tag: highlight_1.tags.variableName,
            color: "red",
            fontStyle: "italic",
        },
        {
            tag: highlight_1.tags.operator,
            color: "green",
        },
        {
            tag: highlight_1.tags.logicOperator,
            color: "blue",
        },
        {
            tag: highlight_1.tags.keyword,
            color: "cyan",
        },
        {
            tag: highlight_1.tags.paren,
            color: "teal",
        },
        {
            tag: highlight_1.tags.number,
            color: "orange",
        },
        {
            tag: highlight_1.tags.string,
            color: "brown",
        },
    ],
});
formulaLanguage.displayEditor();
// add event lister to button to display the editor
document.getElementById("display-editor").addEventListener("click", function () {
    formulaLanguage.getValue();
});
