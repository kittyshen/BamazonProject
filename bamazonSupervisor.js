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
//  View Product Sales by Department
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

    connection.query("SELECT * FROM departments as A LEFT JOIN products as B ON A.department_name = B.department_name ", function (err, result) {
        if (err) throw err;
        console.log(result);
        // print out the table with data returned from database
        table = new Table({
            head: ['Department #','Department Name', 'OverHead Cost', 'Product Sales', 'Total Profit'], colWidths: [8, 40,20,20,20]
        });
        for (var i = 0; i < result.length-1; i++) {
            // tableRowInsert(result[i].department_id, result[i].department_name, result[i].over_head_costs, result[i].product_sales, "0");
            tableRowInsert(table,result[i].department_id, result[i].department_name, result[i].over_head_costs, result[i].product_sales, "0");
        }
        console.log(table.toString()); // display the products on sale
        
        superb(); //back to main menu

    });
}

// function viewLowInventory() {
//     console.log("Display low inventory products...\n");

//     connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, result) {
//         if (err) throw err;
//         // var itemArr = [];        //define an item Arr to hold the returns json objects from database
        
//         if (result == "") console.log("Everything is fine, no low inventory products");
//         // print out the table with data returned from database
//         else{
//             table = new Table({
//                 head: ['Item #','Product','Department', 'Price', 'Stock Quantity'], colWidths: [8, 40,30,10,20]
//             });
//             for (var i = 0; i < result.length; i++) {
//             // itemArr.push(result[i]);  //push each product into item array
//             tableRowInsert(result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity);
//             }
//             console.log(table.toString()); 
//         }
//         managing();  //return to main menu
//     });
// }

// function addInventory(){
//     // need to query the database to select all item with low inventory first then prompt manager to select the item
//     connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, result) {
//         if (err) throw err;
//         var itemArr = [];//define an item Arr to hold the returns low inverntory json objects from database
//         var itemArrName = [];
//         if (result == "") {
//             console.log("Everything is fine, no low inventory products");
//             managing(); //back to main menu
//         }
//         // print out the table with data returned from database
//         else{
//             for(var i = 0; i<result.length; i++){
//                 itemArr.push(result[i].stock_quantity);
//                 itemArrName.push(result[i].product_name);
//             }
//             // console.log(itemArr);

//             inquirer.prompt([
//                 {
//                     type: "list",
//                     message: "Select a low inventory product from list",
//                     choices: itemArrName,
//                     name: "name"
//                 },
//                 {
//                     type: "input",
//                     message: "How much to re-instock?",
//                     name: "amount"
//                 }

//             ]).then(function (response) {
//                 // console.log(response.name);
//                 var newAmount = parseInt(itemArr[itemArrName.indexOf(response.name)]) + parseInt(response.amount);
//                 connection.query("UPDATE products SET ? WHERE ? ",[{stock_quantity:newAmount },{product_name:response.name}],function(err,data){
//                     if(err) throw err;
//                     else console.log(data.changedRows + " updated " + response.amount +" of " + response.name + " added.");
//                     managing(); //back to main menu
//                 });
//             });
//         }
//     });
// }

// function addProduct(){
//     connection.query("SELECT department_name FROM products GROUP BY department_name", function (err, result) {
//         if (err) throw err;
//         var itemDeptArr = [];//define an item Arr to hold the returns department Info json objects from database

//         // print out the table with data returned from database

//         for(var i = 0; i<result.length; i++){
//             itemDeptArr.push(result[i].department_name);
//         }
//         // console.log(itemDeptArr);

//         inquirer.prompt([
//             {
//                 type: "list",
//                 message: "Select a product department you want to add product on",
//                 choices: itemDeptArr,
//                 name: "deptName"
//             },
//             {
//                 type: "input",
//                 message: "What's the name of the new product?",
//                 name: "name"
//             },{
//                 type: "input",
//                 message: "What's the price of the new product?",
//                 name: "price"
//             },
//             {
//                 type: "input",
//                 message: "What's the quantity of the new product?",
//                 name: "quantity"
//             }

//         ]).then(function (response) {
//             console.log(response.name);
//             connection.query("INSERT INTO products SET ?",[{
//                 stock_quantity:response.quantity,
//                 price:response.price,
//                 product_name:response.name,
//                 department_name:response.deptName 
//             }],function(err){
//                 if(err) throw err;
//                 console.log(response.quantity +" of " + response.name + " added.");
//                 managing(); //back to main menu
//             });
//         }); 
//     });   
// }
