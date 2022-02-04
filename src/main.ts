import {
  COMPLETION_TYPES,
  FormulaLanguage,
  TokenConfig,
} from "./formula-language";
import "./style.css";
import dateAndTime from "./function-definitions/dateAndTime.json";
import { tags } from "@codemirror/highlight";
const functionNames = dateAndTime.map((def) => def.functionName);
const autoCompletionOptions = dateAndTime.map((def) => {
  return {
    label: def.functionName,
    type: COMPLETION_TYPES.KEYWORD,
    info: def.description,
  };
});
const formulaLanguage = new FormulaLanguage({
  styleTags: TokenConfig,
  functionNames: functionNames,
  containerId: "app",
  autoCompletionOptions: autoCompletionOptions,
  errorMessage: "There's some error",
  style: [
    {
      tag: tags.variableName,
      color: "red",
      fontStyle: "italic",
    },
    {
      tag: tags.operator,
      color: "green",
    },
    {
      tag: tags.logicOperator,
      color: "blue",
    },
    {
      tag: tags.keyword,
      color: "cyan",
    },
    {
      tag: tags.paren,
      color: "teal",
    },
    {
      tag: tags.number,
      color: "orange",
    },
    {
      tag: tags.string,
      color: "brown",
    },
  ],
});
formulaLanguage.displayEditor();
// add event lister to button to display the editor
document.getElementById("display-editor").addEventListener("click", () => {
  formulaLanguage.getValue();
});
