//testing cli table
var Table = require('cli-table');
 
// instantiate
var table = new Table({
    head: ['TH 1 label', 'TH 2 label','TH 3 label','TH 4 label','TH 5 label']
  , colWidths: [5, 40,30,10,15]
});
 
// table is an Array, so you can `push`, `unshift`, `splice` and friends
table.push(
    ['First value', 'Second value','3rd value','4th value','5th value']
  , ['First value', 'Second value','3rd value','4th value','5th value']
);
 
console.log(table.toString());
