var mysql = require("mysql");
var inquirer = require("inquirer");
//testing cli table
var Table = require('cli-table');
 
// instantiate a table with display products header info
// var table = new Table({
//     head: ['Item #','Product','Department', 'Price', 'Stock Quantity'], colWidths: [8, 40,30,10,20]
// });
var table = new Table();  //define this here to be able to call it in tableRowInsert function
// table is an Array, so you can `push`, `unshift`, `splice` and friends
function tableRowInsert(a,b,c,d,e){
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
    // displayProducts();
    managing();
});

//task to do
//   View Products for Sale
//   View Low Inventory
//   Add to Inventory
//   Add New Product
function managing(){
    inquirer.prompt([
        {
            type: "list",
            message: "What to do?",
            choices: ["View Products for Sale", "View Low Inventory","Add to Inventory","Add New Product", "Quit"],
            name: "action"
        }
    ]).then(function (response) {
        switch (response.action) {
            case "Quit": connection.end(); break;
            case "View Products for Sale": viewProduct(); break;
            case "View Low Inventory":  viewLowInventory(); break;
            case "Add to Inventory": addInventory(); break;
            case "Add New Product": addProduct(); break;
            default:connection.end(); break;
        }
    });
}


function viewProduct() {
    console.log("Display all products...\n");
    table = new Table({
        head: ['Item #','Product','Department', 'Price', 'Stock Quantity'], colWidths: [8, 40,30,10,20]
    });
    connection.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        // console.log(result);
        // print out the table with data returned from database
        for (var i = 0; i < result.length; i++) {
            tableRowInsert(result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity);
        }
        console.log(table.toString()); // display the products on sale
    });
}

function viewLowInventory() {
    console.log("Display low inventory products...\n");

    connection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, result) {
        if (err) throw err;
        // var itemArr = [];        //define an item Arr to hold the returns json objects from database
        
        if (result == "") console.log("Everything is fine, no low inventory products");
        // print out the table with data returned from database
        else{
            table = new Table({
                head: ['Item #','Product','Department', 'Price', 'Stock Quantity'], colWidths: [8, 40,30,10,20]
            });
            for (var i = 0; i < result.length; i++) {
            // itemArr.push(result[i]);  //push each product into item array
            tableRowInsert(result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity);
            }
            console.log(table.toString()); 
        }
        managing();  //return to main menu
    });
}

// function updateProduct(name, number){
//     connection.query("UPDATE products SET ? WHERE ?",
//     [{stock_quantity:number},{product_name:name}],
//     function(err,data){
//         if (err) throw err;
//         // console.log(data.affectedRows + " Updated.");
//     });
//     inquirer.prompt([
//         {
//             type: "list",
//             message: "Make More purchase? Exit the store?",
//             choices: ["Purchase", "Quit"],
//             name: "action"
//         }
//     ]).then(function (response) {
//         if (response.action == "Quit") { // if user don't wanna buy ,end the connection
//                 calTotal();
//                 console.log("Thanks for visiting bamazon, See you again!");
//                 connection.end();
//             }
//         else {  
//             displayProducts();
//         }
//     });
// }
