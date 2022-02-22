import { COMPLETION_TYPES, FormulaLanguage, TokenConfig } from ".";
import "./style.css";
import dateAndTime from "./function-definitions/dateAndTime.json";
import statistical from "./function-definitions/statistical.json";
import array from "./function-definitions/array.json";
import engineering from "./function-definitions/engineering.json";
import financial from "./function-definitions/financial.json";
import information from "./function-definitions/information.json";
import logical from "./function-definitions/logical.json";
import lookup from "./function-definitions/lookup-and-reference.json";
import math from "./function-definitions/math-and-trigo.json";
import matrix from "./function-definitions/matrix.json";
import operator from "./function-definitions/operator.json";
import text from "./function-definitions/text.json";
const funtions = [
  dateAndTime,
  statistical,
  array,
  engineering,
  financial,
  information,
  logical,
  lookup,
  math,
  matrix,
  operator,
  text,
];
const autoCompletionOptions = [];
const functionNames: string[] = [];
funtions.forEach((fn) => {
  fn.forEach((def: any) => {
    functionNames.push(def.functionName);
    autoCompletionOptions.push({
      label: def.functionName,
      type: COMPLETION_TYPES.KEYWORD,
      detail: def.description,
    });
  });
});
const variableNames = ["single_sel", "$status"];
variableNames.forEach((t) => {
  autoCompletionOptions.push({
    label: t,
    type: COMPLETION_TYPES.VARIABLE,
    info: "test",
    apply: `{${t}}`,
  });
});
import { tags } from "@codemirror/highlight";

const formulaLanguage = new FormulaLanguage({
  styleTags: TokenConfig,
  functionNames: functionNames,
  containerId: "app",
  autoCompletionOptions: autoCompletionOptions,
  errorMessage: "There's some error",
  style: [
    {
      tag: tags.variableName,
      color: "black",

      background: "#ececec",
    },
    {
      tag: tags.operator,
      color: "#2B95EF",
    },
    {
      tag: tags.logicOperator,
      color: "#2B95EF",
    },
    {
      tag: tags.keyword,
      color: "#21df54",
    },
    {
      tag: tags.paren,
      color: "black",
    },
    {
      tag: tags.number,
      color: "#2B95EF",
    },
    {
      tag: tags.string,
      color: "blue",
    },
  ],
  lintingDelay: 100,
});
formulaLanguage.displayEditor();
// add event lister to button to display the editor
