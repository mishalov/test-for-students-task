const fs = require("fs");
const randomWord = require("random-words");
const { exec, execSync } = require("child_process");
var diff = require("fast-diff");

function setColumn(table, f, c, rs = 1, re = table.length) {
  const output = [...table.map((el) => [...el])];
  for (let i = (rs == "-" ? table.length - 1 : rs - 1); i < (re == "-" ? table.length : re); i++) {
    output[i][c] = f(table[i][c]);

  }
  return output;
}

function toInt(c, delim, from, to) {
  const table = new Array(10)
    .fill("")
    .map(() =>
      new Array(10).fill("").map(() => Math.random() + Math.random() * 10)
    );

  let output = setColumn(table, Math.trunc, c - 1, from, to);

  return {
    name: "int",
    argument: c,
    command: `./main ${delim && delim !== " " ? `-d ${delim}` : ""} ${from !== "+" ? `rows ${from} ${to}` : ""} int ${c}`,
    delim,
    output,
    rows: `${from} / ${to}`,
    table,
  };
}

function cSet(c, word, delim, from, to) {
  const table = new Array(10)
    .fill("")
    .map(() =>
      new Array(10).fill("").map(() => Math.random() + Math.random() * 10)
    );

  let output = setColumn(table, () => word, c - 1, from, to);

  return {
    name: "cset",
    argument: c + "/" + word,
    command: `./main ${delim && delim !== " " ? `-d ${delim}` : ""} ${from !== "+" ? `rows ${from} ${to}` : ""} cset ${c} ${word}`,
    delim,
    output,
    rows: `${from} / ${to}`,
    table,
  };
}

function toLower(c, delim, from, to) {
  const table = new Array(10)
    .fill("")
    .map(() => new Array(10).fill("").map(() => randomWord().toUpperCase()));

  let output = setColumn(table, (e) => e.toLowerCase(), c - 1, from, to);

  return {
    name: "tolower",
    command: `./main ${delim && delim !== " " ? `-d ${delim}` : ""} ${from !== "+" ? `rows ${from} ${to}` : ""} tolower ${c} `,
    delim,
    argument: c,
    output,
    table,
  };
}

function toUpper(c, delim, from, to) {
  const table = new Array(10)
    .fill("")
    .map(() => new Array(10).fill("").map(() => randomWord().toLowerCase()));

  let output = setColumn(table, (e) => e.toUpperCase(), c - 1, from, to);

  return {
    name: "toupper",
    argument: c,
    command: `./main ${delim && delim !== " " ? `-d ${delim}` : ""} ${from !== "+" ? `rows ${from} ${to}` : ""} toupper ${c} `,
    delim,
    output,
    rows: `${from} / ${to}`,
    table,
  };
}

function icol(r, delim) {
  const table = new Array(10)
    .fill("")
    .map(() => new Array(10).fill("").map(() => randomWord()));

  let output = setColumn(table, (e) => e, r);

  for (let i = 0; i < output.length; i++) {
    // output[i].push("")

    for (let j = output[i].length; j >= r; j--) {
      output[i][j] = output[i][j - 1];
      if (j == r) {
        output[i][j - 1] = "";
      }
    }
  }

  return {
    name: "icol",
    argument: r,
    command: `./main ${delim && delim !== " " ? `-d ${delim}` : ""} icol ${r} `,
    delim,
    output,
    table,
  };
}

function irow(r, delim) {
  const table = new Array(10)
    .fill("")
    .map(() => new Array(10).fill("").map(() => randomWord()));

  let output = setColumn(table, (e) => e, 0);
  output.push((new Array(output[0].length)).fill(""));
  for (let i = output.length - 1; i >= r; i--) {
    for (let j = 0; j < output[i].length; j++) {
      output[i][j] = output[i - 1][j];
      if (i == r) {
        output[i - 1][j] = "";
      }
    }
  }

  return {
    name: "irow",
    argument: r,
    command: `./main ${delim && delim !== " " ? `-d ${delim}` : ""} irow ${r} `,
    delim,
    output,
    table,
  };
}

function arow(delim) {
  const table = new Array(10)
    .fill("")
    .map(() => new Array(10).fill("").map(() => randomWord()));

  let output = setColumn(table, (e) => e, 0);
  output.push((new Array(output[0].length)).fill(""));

  return {
    name: "arow",
    command: `./main ${delim && delim !== " " ? `-d ${delim}` : ""} arow `,
    delim,
    output,
    table,
  };
}

function acol(delim) {
  const table = new Array(10)
    .fill("")
    .map(() => new Array(10).fill("").map(() => randomWord()));

  let output = setColumn(table, (e) => e, 0);
  output.forEach(o => o.push(""))

  return {
    name: "acol",
    command: `./main ${delim && delim !== " " ? `-d ${delim}` : ""} acol `,
    delim,
    output,
    table,
  };
}

function irow(r, delim) {
  const table = new Array(10)
    .fill("")
    .map(() => new Array(10).fill("").map(() => randomWord()));

  let output = setColumn(table, (e) => e, 0);
  output.push((new Array(output[0].length)).fill(""));
  for (let i = output.length - 1; i >= r; i--) {
    for (let j = 0; j < output[i].length; j++) {
      output[i][j] = output[i - 1][j];
      if (i == r) {
        output[i - 1][j] = "";
      }
    }
  }

  return {
    name: "irow",
    argument: r,
    command: `./main ${delim && delim !== " " ? `-d ${delim}` : ""} irow ${r} `,
    delim,
    output,
    table,
  };
}

const array10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const delims = [" ", "/", "$", " ", ":", ","];//
const froms = [[1, 3], [5, 10], ["-", "-"], [4, "-"], [1, 10]];

const tables = [
  ...array10.flatMap(el => delims.flatMap(delim => froms.flatMap(fr => toInt(el, delim, fr[0], fr[1])))),
  ...array10.flatMap(el => delims.flatMap(delim => froms.flatMap(fr => toInt(cSet(el, randomWord(), delim, fr[0], fr[1]))))),
  ...array10.flatMap(el => delims.flatMap(delim => froms.flatMap(fr => toInt(toLower(el, delim, fr[0], fr[1]))))),
  ...array10.flatMap(el => delims.flatMap(delim => froms.flatMap(fr => toInt(toUpper(el, delim, fr[0], fr[1]))))),
  ...delims.flatMap(delim => acol(delim)),
  ...delims.flatMap(delim => arow(delim)),
  icol(1, ","), ...(new Array(10).fill("").map((el, index) => irow(index + 1, ":"))),

];

function compare() {
  let index = 0;
  for (tableItem of tables) {
    index++;
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
        tableItem.output.map((el) => el.join(tableItem.delim[0])).join("\n")
      );

      const buffer = execSync(
        `${tableItem.command} <  ${inputTableName} > ${outputTestedTableName}`
      );

      const resultOfProgram = fs.readFileSync(outputTestedTableName).toString().split("\n").map(el => el.split(tableItem.delim[0]));
      const ourResult = fs.readFileSync(outputTableName).toString().split("\n").map(el => el.split(tableItem.delim[0]));

      if (JSON.stringify(ourResult) !== JSON.stringify(resultOfProgram)) {

        if (ourResult.length !== resultOfProgram.length) {
          console.log(`\x1b[31m ${tableItem.name}: Количество строк неверное! должно быть : ${ourResult.length} а получили : ${resultOfProgram.length}`, "command\x1b[37m", tableItem.command);
          break;
        }

        if (ourResult[0].length !== resultOfProgram[0].length) {
          console.log(`\x1b[31m ${tableItem.name}: Количество колонок неверное! должно быть : ${ourResult[0].length} а получили : ${resultOfProgram[0].length}`, "command\x1b[37m", tableItem.command);
          break;
        }
        console.log("\x1b[31m", `${index}/${tables.length} Failed`, dir, "argument", tableItem.argument, "delim", tableItem.delim, "rows:", tableItem.rows, "command\x1b[37m", tableItem.command);


        for (let i = 0; i < resultOfProgram.length; i++) {
          const row = resultOfProgram[i];
          let rowOutput = "";
          for (let j = 0; j < row.length && row.length !== 1; j++) {
            const modifier = resultOfProgram[i][j] !== ourResult[i][j] ? "\x1b[31m" : "\x1b[32m"
            rowOutput += `${modifier}${row[j]}`
            if (j != row.length - 1) {
              rowOutput += tableItem.delim[0];
            }
          }
          console.log(rowOutput);
        }
        break;
      }
      console.log("\x1b[32m", `${index}/${tables.length} Tested`, dir, "argument", tableItem.argument, "delim", tableItem.delim, "command\x1b[37m", tableItem.command);
    } catch (e) {
      console.log("\x1b[31m", `Error in ${tableItem.name}:`, e);
    }
  }
}

compare();
