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

function toInt(c, delim) {
  const table = new Array(10)
    .fill("")
    .map(() =>
      new Array(10).fill("").map(() => Math.random() + Math.random() * 10)
    );

  let output = setColumn(table, Math.trunc, c - 1);

  return {
    name: "int",
    command: `./main ${delim ? `-d ${delim}` : ""} int ${c}`,
    delim,
    output,
    table,
  };
}

function cSet(c, delim) {
  const table = new Array(10)
    .fill("")
    .map(() =>
      new Array(10).fill("").map(() => Math.random() + Math.random() * 10)
    );

  let output = setColumn(table, () => "aaa", c - 1);

  return {
    name: "cset",
    command: `./main ${delim ? `-d ${delim}` : ""} cset ${c} aaa`,
    delim,
    output,
    table,
  };
}

function toLower(c, delim) {
  const table = new Array(10)
    .fill("")
    .map(() => new Array(10).fill("").map(() => randomWord().toUpperCase()));

  let output = setColumn(table, (e) => e.toLowerCase(), c - 1);
  //setColumn(table, (e) => e.toLowerCase(), c - 1);

  return {
    name: "tolower",
    command: `./main ${delim ? `-d ${delim}` : ""} tolower ${c} `,
    delim,
    output,
    table,
  };
}

const tables = [toInt(2, ","),
cSet(1, ","),
toLower(1, ",")
];

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

      const resultOfProgram = fs.readFileSync(outputTestedTableName).toString().split("\n").map(el => el.split(tableItem.delim));
      const ourResult = fs.readFileSync(outputTableName).toString().split("\n").map(el => el.split(tableItem.delim));

      if (JSON.stringify(ourResult) !== JSON.stringify(resultOfProgram)) {

        if (ourResult.length !== resultOfProgram.length) {
          console.log(`\x1b[32m Количество строк неверное! должно быть : ${ourResult.length} а получили : ${resultOfProgram.length}`);
          continue;
        }

        if (ourResult[0].length !== resultOfProgram[0].length) {
          console.log(`\x1b[32m Количество колонок неверное! должно быть : ${ourResult[0].length} а получили : ${resultOfProgram[0].length}`);
          continue;
        }


        for (let i = 0; i < resultOfProgram.length; i++) {
          const row = resultOfProgram[i];
          let rowOutput = "";
          for (let j = 0; j < row.length && row.length !== 1; j++) {
            const modifier = resultOfProgram[i][j] !== ourResult[i][j] ? "\x1b[32m" : "\x1b[31m"
            rowOutput += `${modifier}${row[j]}`
            if (j != row.length - 1) {
              rowOutput += tableItem.delim;
            }
          }
          console.log(rowOutput);
        }
      }
      console.log("\x1b[32m", "All ok with", dir);

      // exec(, (error, stdout, stderr) => {});
    } catch (e) {
      console.log("\x1b[31m", `Error in ${tableItem.name}:`, e);
    }
  }
}

compare();
