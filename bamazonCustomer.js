var mysql = require("mysql");
var inquirer = require("inquirer");
//testing cli table
var Table = require('cli-table');
 
// instantiate a table with display products header info
var table = new Table({
    head: ['Item #','Product','Department', 'Price', 'Stock Quantity'], colWidths: [8, 40,30,10,20]
});
 
// table is an Array, so you can `push`, `unshift`, `splice` and friends
function tableRowInsert(a,b,c,d,e){
    arr = [];
    arr.push(a,b,c,d,e)
    table.push(arr);
}
// tableRowInsert(2,4,5,6,3,2);

console.log(table.toString());

//making a connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
  });

  function displayProducts() {
    console.log("Display all products...\n");
    connection.query("SELECT * FROM products", function(err, result) {
      if (err) throw err;
      // Log all results of the SELECT statement
    //   console.log(result);
      // print out the table with data returned from database
      for(var i =0; i<result.length; i++){
        tableRowInsert(result[i].item_id,result[i].product_name,result[i].department_name,result[i].price,result[i].stock_quantity);
      }
      console.log(table.toString());
    //   connection.end();
    });
  }