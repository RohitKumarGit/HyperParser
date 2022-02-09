import {
  COMPLETION_TYPES,
  FormulaLanguage,
  TokenConfig,
} from "./formula-language";
import "./style.css";
import dateAndTime from "./function-definitions/dateAndTime.json";
import statistical from './function-definitions/statistical.json'
const funtions = [dateAndTime,statistical]
const autoCompletionOptions = []
const functionNames : string[]= []
funtions.forEach(fn=>{
  
  fn.forEach(def=>{
      functionNames.push(def.functionName)
        autoCompletionOptions.push({
        label: def.functionName,
        type: COMPLETION_TYPES.KEYWORD,
        info: def.description,
      })
  })
  
})
const variableNames = ["single_sel","$status"]
variableNames.forEach(t=>{
  autoCompletionOptions.push({
    label:t,
    type : COMPLETION_TYPES.VARIABLE,
   
    apply : `{${t}}`
  })
})
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
