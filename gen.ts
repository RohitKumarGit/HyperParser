const t = `| ARRAYFORMULA | Enables array arithmetic inside. | ARRAYFORMULA(Formula) |
| FILTER | Filters the array based on boolean arrays. | FILTER(Array; BoolArray1[; BoolArray2[; ...]])
| ARRAY_CONSTRAIN | Truncates the array to given dimensions. | ARRAY_CONSTRAIN(Array; Height; Width) |`
const fs = require("fs");
const res = t.split("\n").map((row) =>
  row
    .trim()
    .split("|")
    .map((token) => token.trim())
    .filter((k) => k.length > 0)
);
const errored = [];
const result = [];
res.forEach((def) => {
  const functionName = def[0];
  const description = def[1];
  console.log(functionName,description)
  if (def[2].includes("[;") && !def[2].includes("Array") && !def[2].includes("...")) {
    result.push({ functionName, description, numberOfParams: def });
    errored.push(functionName);
  } else {
    const t = new RegExp(",", "g");
    let count = [0];
    const context = def[2]
      .replace(t, ";")
      .substring(def[2].lastIndexOf("(") + 1, def[2].lastIndexOf(")"));
    if(context.includes("...") || context.includes("Array")){
      count = [-1]
    }

    else if (context.includes(";")) {
      count[0] = context.split(";").length;
    }
    else if(context[0] === '[') count = [0,1]
    else if(context.length > 1){
      count[0] = 1

    }
    
    result.push({
      functionName,
      description,
      numberOfParams: count,
    });
  }
});
console.log(errored);
fs.writeFile(
  "src/function-definitions/array.json",
  JSON.stringify(result),
  function (err) {
    if (err) {
      console.log(err);
    }
  }
);