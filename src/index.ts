import { parser } from "./grammar";
import fdetails from "./function-details/index.json";
import {
  HighlightStyle,
  styleTags,
  Tag,
  tags as t,
} from "@codemirror/highlight";
import { CompletionContext, autocompletion } from "@codemirror/autocomplete";
import { LanguageSupport, syntaxTree, LRLanguage } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { Diagnostic, linter } from "@codemirror/lint";
import { basicSetup, EditorState } from "@codemirror/basic-setup";
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
import custom from "./function-definitions/custom-functions.json";
export const functionDefinitions = [
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
  custom,
];

export const TokenConfig = {
  Variable: t.variableName,
  ArtithMeticOperators: t.operator,
  LogicalOperators: t.logicOperator,
  Functions: t.keyword,
  "( )": t.paren,
  String: t.string,
  Number: t.number,
  Assign: t.operator,
};
export enum COMPLETION_TYPES {
  KEYWORD = "keyword",
  VARIABLE = "variable",
}
class AutoComplete {
  label: string;
  type: COMPLETION_TYPES;
  info?: string;
  detail?: string;
  apply?: string;
}
export class TextStyle {
  tag: Tag;
  color: string;
  fontStyle?: string;
}
export class FormulaLanguageConfig {
  styleTags = TokenConfig;
  functionNames: string[] = [];
  style?: any[] = [];
  autoCompletionOptions: AutoComplete[];
  variablesCompletions?: AutoComplete[] = [];
  errorMessage: string;
  containerId: string;
  lintingDelay? = 100;
}
export class FormulaLanguage {
  config: FormulaLanguageConfig;
  editorView: EditorView;
  constructor(config: FormulaLanguageConfig) {
    config.functionNames.forEach((functioName) => {
      TokenConfig[functioName] = t.keyword;
    });

    config.style = config.style ? config.style : [];
    this.config = config;
    this.config.variablesCompletions = this.config.autoCompletionOptions.filter(
      (t) => t.type === COMPLETION_TYPES.VARIABLE
    );
  }
  autoCompletionLogic(context: CompletionContext) {
    this.editorView.dispatch();
    let word = context.matchBefore(/[\w,@[a-zA-Z_-]*]*/);
    if (word.from == word.to && word.text.charAt(word.from) === "@") {
      return {
        from: word.from,
        options: this.config.variablesCompletions,
        filter: false,
      };
    }

    if (word.text.startsWith("@")) {
      return {
        from: word.from,
        options: this.config.variablesCompletions.filter(
          (variable) =>
            variable.label

              .toLowerCase()
              .indexOf(word.text.substring(word.from + 1, word.to)) !== -1
        ),
        filter: false,
      };
    }
    return {
      from: word.from,
      options: this.config.autoCompletionOptions,
    };
  }
  linterLogic(view: EditorView) {
    const diag: Diagnostic[] = [];

    syntaxTree(view.state).iterate({
      enter: (type, from, to, _get) => {
        if (type.isError) {
          console.log(from, to);
          diag.push({
            from,
            to,
            severity: "error",
            message: this.config.errorMessage,
          });
        }
      },
    });
    return diag;
  }
  getLanguage() {
    const parserWithMetadata = parser.configure({
      props: [styleTags(this.config.styleTags)],
    });
    const Language = LRLanguage.define({
      parser: parserWithMetadata,
    });
    const highLightStyle = HighlightStyle.define(this.config.style);
    const dummy = (c) => {
      return this.autoCompletionLogic(c);
    };

    const dummy1 = (c) => {
      return this.linterLogic(c);
    };
    const t = new LanguageSupport(Language, [
      highLightStyle,
      autocompletion({
        override: [dummy],
        activateOnTyping: true,

        addToOptions: [
          {
            render: function (completion, _state) {
              let dom = document.createElement("div");
              dom.className = "cm-details";
              dom.innerHTML = fdetails[completion.label.toString().trim()]
                ? `<b>${
                    fdetails[completion.label.toString().trim()].signature
                  }</b>`
                : "";
              return dom;
            },
            position: 1000,
          },
        ],
      }),
      linter(dummy1, { delay: this.config.lintingDelay }),
    ]);
    t;

    return t;
  }
  displayEditor() {
    this.editorView = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, this.getLanguage(), EditorView.lineWrapping],
      }),

      parent: document.getElementById(this.config.containerId),
    });
    this.editorView.state.update({
      changes: {
        from: 0,
        to: this.editorView.state.doc.length,
        insert: "heuu",
      },
    });
  }
  getValue() {
    return this.editorView.state.toJSON().doc;
  }
}
