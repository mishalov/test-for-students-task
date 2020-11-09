const fs = require("fs");
const randomWord = require("random-words");
const { exec, execSync } = require("child_process");
var diff = require("fast-diff");

function setColumn(table, f, c, rs = 0, re = table.length) {
  const output = [...table.map((el) => [...el])];
  for (let i = rs; i < re; i++) {
    output[i][c] = f(table[i][c]);
  }
  return output;
}

function toInt(c) {
  const table = new Array(10)
    .fill("")
    .map(() =>
      new Array(10).fill("").map(() => Math.random() + Math.random() * 10)
    );

  let output = setColumn(table, Math.trunc, c - 1);

  return {
    name: "int",
    command: `./main int ${c}`,
    delim: ",",
    output,
    table,
  };
}

function cSet(c) {
  const table = new Array(10)
    .fill("")
    .map(() =>
      new Array(10).fill("").map(() => Math.random() + Math.random() * 10)
    );

  let output = setColumn(table, () => "aaa", c - 1);

  return {
    name: "cset",
    command: `./main cset ${c} aaa`,
    delim: ",",
    output,
    table,
  };
}

function toLower(c) {
  const table = new Array(10)
    .fill("")
    .map(() => new Array(10).fill("").map(() => randomWord().toUpperCase()));

  let output = setColumn(table, (e) => e.toLowerCase(), c - 1);
  //setColumn(table, (e) => e.toLowerCase(), c - 1);

  return {
    name: "tolower",
    command: `./main tolower ${c}`,
    delim: ",",
    output,
    table,
  };
}

const tables = [toInt(2), cSet(1), toLower(1)];

function compare() {
  for (tableItem of tables) {
    const dir = tableItem.name;

    const inputTableName = `./${dir}/table`;
    const outputTableName = `./${dir}/out.table`;
    const outputTestedTableName = `./${dir}/tested.out.table`;

    try {
      !fs.existsSync(dir) && fs.mkdirSync(dir, {});

      fs.writeFileSync(
        inputTableName,
        tableItem.table.map((el) => el.join(tableItem.delim)).join("\n")
      );

      fs.writeFileSync(
        outputTableName,
        tableItem.output.map((el) => el.join(tableItem.delim)).join("\n")
      );

      const buffer = execSync(
        `${tableItem.command} <  ${inputTableName} > ${outputTestedTableName}`
      );

      const resultOfProgram = fs.readFileSync(outputTestedTableName).toString();
      const ourResult = fs.readFileSync(outputTableName).toString();

      if (ourResult !== resultOfProgram) {
        const diffs = diff(ourResult, resultOfProgram, 0);
        if (diffs.length > 2) {
          console.log(
            "\x1b[31m",
            `Проверяю ${tableItem.name}, команда \x1b[37m ${tableItem.command}\x1b[0m:`
          );
          let error = "";
          diffs.forEach((diff, index) => {
            if (diff[0] == -1) {
              error += `${
                index > 0
                  ? `\x1b[32m${
                      diffs[index - 1][0] == 0 &&
                      diffs[index - 1][1] !== tableItem.delim
                        ? diffs[index - 1][1]
                        : ""
                    }`
                  : ""
              }\x1b[31m${diff[1]}${
                index < diffs.length - 1
                  ? `\x1b[32m${
                      diffs[index + 1][0] == 0 &&
                      diffs[index + 1][1] !== tableItem.delim
                        ? diffs[index + 1][1]
                        : ""
                    }`
                  : ""
              }`;
            } else {
              if (diff[0] == 1) {
                error += `${
                  index > 0
                    ? `\x1b[32m${
                        diffs[index - 1][0] == 0 &&
                        diffs[index - 1][1] !== tableItem.delim
                          ? diffs[index - 1][1]
                          : ""
                      }`
                    : ""
                }\x1b[35m${diff[1]}${
                  index < diffs.length - 1
                    ? `\x1b[32m${
                        diffs[index + 1][0] == 0 &&
                        diffs[index + 1][1] !== tableItem.delim
                          ? diffs[index + 1][1]
                          : ""
                      }`
                    : ""
                }`;
              }
            }
          });
          console.log(error);

          throw "Result is Wrong!";
        }
        console.log("\x1b[32m", "All ok with", dir);
      }

      // exec(, (error, stdout, stderr) => {});
    } catch (e) {
      console.log("\x1b[31m", `Error in ${tableItem.name}:`, e);
    }
  }
}

compare();
