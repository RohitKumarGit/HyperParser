import { parser } from "./grammar";
import {
  HighlightStyle,
  styleTags,
  Tag,
  tags as t,
} from "@codemirror/highlight";
import { CompletionContext, autocompletion } from "@codemirror/autocomplete";
import { LanguageSupport, syntaxTree, LRLanguage } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { closeLintPanel, Diagnostic, linter } from "@codemirror/lint";
import { basicSetup, EditorState } from "@codemirror/basic-setup";

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
  style?: TextStyle[] = [];
  autoCompletionOptions: AutoComplete[];
  errorMessage: string;
  containerId: string;
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
  }
  autoCompletionLogic(context: CompletionContext) {
    console.log(this.config);
    let word = context.matchBefore(/\w*/);
    if (word.from == word.to && !context.explicit) return null;

    return {
      from: word.from,
      options: this.config.autoCompletionOptions,
    };
  }
  linterLogic(view: EditorView) {
    console.log("-----");
    const diag: Diagnostic[] = [];
    syntaxTree(view.state).iterate({
      enter: (type, from, to, get) => {
        console.log(type, from, to);
        if (type.isError) {
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
    console.log(this.config.styleTags);
    console.log(this.config.style);
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
    return new LanguageSupport(Language, [
      highLightStyle,
      autocompletion({
        override: [dummy],
        activateOnTyping: true,
      }),
      linter(dummy1),
    ]);
  }
  displayEditor() {
    this.editorView = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, this.getLanguage()],
      }),

      parent: document.getElementById(this.config.containerId),
    });
  }
  getValue() {
    console.log(this.editorView.state.toJSON().doc);
  }
}
