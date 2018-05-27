var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
 
// instantiate a table 
// var table = new Table();  //define this here to be able to call it in tableRowInsert function
// table is an Array, so you can `push`, `unshift`, `splice` and friends
function tableRowInsert(table,a,b,c,d,e){
    arr = [];
    arr.push(a,b,c,d,e)
    table.push(arr);
}

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
    superb();
});

//task to do
// View Product Sales by Department
// Create New Department

//notes to myself superb() return to main menu function need to be called inside a 
//connection query to make sure return to main menu after database action finished, 
//otherwise might throw error due to query itself is async 
function superb(){
    inquirer.prompt([
        {
            type: "list",
            message: "What to do?",
            choices: ["View Product Sales by Department", "Create New Department", "Quit"],
            name: "action"
        }
    ]).then(function (response) {
        switch (response.action) {
            case "Quit": connection.end(); break;
            case "Create New Department": addDept(); break;
            case "View Product Sales by Department":  viewSales(); break;
            default:connection.end(); break;
        }
    });
}

function addDept(){
    inquirer.prompt([
        {
            type: "input",
            message: "What Department you want to add?",
            name: "name"
        },
        {
            type: "input",
            message: "Overhead cost?",
            name: "cost"
        }
    ]).then(function (response) {
        connection.query("INSERT INTO departments SET ?",[{department_name:response.name,over_head_costs:response.cost}], function (err, result) {
            if(err) throw err;
            console.log(result.affectedRows + " updated : Department "+ response.name +" added");
            superb();
        });
    });
}

function viewSales(){
  
    // create sum of rows group by same department reference forum post https://stackoverflow.com/questions/6335240/php-mysql-add-rows-together-to-get-total
    connection.query("SELECT A.department_id,A.department_name, A.over_head_costs,SUM(B.product_sales) AS totalSale FROM departments as A INNER JOIN products as B ON (A.department_name = B.department_name) GROUP BY A.department_id", function (err, result) {
        if (err) throw err;
        // console.log(result);
        // print out the table with data returned from database
        table = new Table({
            head: ['Dept #','Department Name', 'OverHead Cost', 'Product Sales', 'Total Profit'], colWidths: [8, 40,20,20,20]
        });
        
        // var objObj={};  // use this to filtering the department as key index and and add total sale for products on same department
        for (var i = 0; i < result.length; i++) {
            // tableRowInsert(result[i].department_id, result[i].department_name, result[i].over_head_costs, result[i].product_sales, "0");
            // note to myself if query of 79 used inner join to replace left join then it will exclude the colmn with has null value alreday don't need next if statement online 91
            // if(result[i].totalSale != null) { // this is nessasary to show the table without error
            tableRowInsert(table,result[i].department_id, result[i].department_name, result[i].over_head_costs, result[i].totalSale, result[i].totalSale- result[i].over_head_costs);
            // }
        }
        console.log(table.toString()); // display the products on sale
        
        superb(); //back to main menu
    });
}

