const part1 = `@top Program {expression*}
@detectDelim
expression { Operation  |  String | tep  | tep ',' expression  }
tep { Variable | Number | Functions }
Unlimited {  tep ',' Unlimited | "" | tep }
Operation {  Variable  Assign expression | tep ArtithMeticOperators tep | tep LogicalOperators tep }`
const part2 = `@tokens {\n`;
const part3 = `Variable { ("{" $[a-zA-Z_-]+ "}" | "{$" $[a-zA-Z_-]+ "}" )}
Number {std.digit+} 
String { '"' std.asciiLetter* '"'}
Assign {"="}
ArtithMeticOperators {("+"|"*"|"-")}
LogicalOperators {("&&" | "||")}
"$"
 "(" ")" "[" "]" "{" "}"
 Newline {$[\n]+}
}
@skip {NewLine}`;
let functionPattenrs = [];
let functionTokens = [];
const fs = require("fs");
class Def {
  functionName: string;
  description: string;
  numberOfParams: number[];
}
const getJSON = function (fileName, directoryName) {
  console.log(fileName);
  const readFileFromDirecttor = fs.readFileSync(
    `${directoryName}/${fileName}`,
    "utf8"
  );
  return JSON.parse(readFileFromDirecttor);
};

const readFilesFromADirecttory = function (directoryName) {
  const files = fs.readdirSync(directoryName);
  console.log(files);
  files.map((file) => {
    const json: Def[] = getJSON(file, directoryName);
    json.forEach((def) => {

      const functionName = def.functionName;
      console.log(functionName);
      let token = functionName;
      if (token.trim().includes(".")) {
          token = token.split(".").join("ZZ");
      }
      def.numberOfParams.forEach((count) => {
        if(count === -1){
          functionPattenrs.push(`${token} "(" Unlimited ")"`);
          return
        }
        
        console.log(functionName, count);
        let t = [];
        for (let i = 0; i < count; i++) {
          t.push("tep");
        }
        
        functionPattenrs.push(`${token} "(" ${t.join("','")} ")"`);
      });

      functionTokens.push(`${token} { "${functionName}"}`);
    });
  });
};
readFilesFromADirecttory("src/function-definitions");
const final =
  part1 +
  "\n Functions {" +
  functionPattenrs.join("|") +
  "}\n" +
  part2 +
  functionTokens.join("\n") +
  "\n" +
  part3;
// save final to language.grammmar
fs.writeFile("src/language.grammar", final, function (err) {
  if (err) {
    console.log(err);
  }
});
