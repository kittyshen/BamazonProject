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
// tableRowInsert(2,4,5,6,3,2);

// console.log(table.toString());

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
    table = new Table({
        head: ['Item #','Product','Department', 'Price', 'Stock Quantity'], colWidths: [8, 40,30,10,20]
    });
    connection.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        var itemArr = [];        //define an item Arr to hold the returns json objects from database
        // console.log(result);
        // print out the table with data returned from database
        for (var i = 0; i < result.length; i++) {
            itemArr.push(result[i]);  //push each product into item array
            tableRowInsert(result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity);
        }
        console.log(table.toString()); // display the products on sale, then start to prompt user what they want to buy

        ////// ****** user interaction starts here
        inquirer.prompt([
            {
                type: "list",
                message: "Interested in purchase any items on sale or Exit the store?",
                choices: ["Purchase", "Quit"],
                name: "action"
            }
        ]).then(function (response) {
            if (response.action == "Quit") { // if user don't wanna buy ,end the connection
                console.log("Thanks for visiting bamazon, See you again");
                // calTotal();
                connection.end();
            }
            else {       // user selected purchase, want to buy something from the table
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Please enter the item # you want to make a purchase on",
                        name: "itemId"
                    },
                    {
                        type: "input",
                        message: "Please enter the quantity you want to buy",
                        name: "itemNum"
                    }
                ]).then(function (response) {
                    var index = parseInt(response.itemId)-1;
                    // console.log(itemArr[index]);
                    var itemName = itemArr[index].product_name;
                    var availableNum = itemArr[index].stock_quantity;  // check items stock inventory 
                    if (availableNum < response.itemNum) { // if user input more than available stock of the item, display error 
                        console.log("Sorry, insufficient stock. there is only " + availableNum + " of " + itemName + " available,");
                        console.log("Default amount of " + availableNum + " add to cart. More on the way!");
                    }
                    var purchasedNum = availableNum < response.itemNum? availableNum:response.itemNum; 
                    availableNum -= purchasedNum;
                    console.log("current stock of : " + itemName + " : "+availableNum);
                    console.log("-----------------\n Your receipt \n------------------\n ");
                    console.log( purchasedNum + " of " +itemName +"\n");
                    var price = purchasedNum * itemArr[index].price;
                    console.log("Total : " + price.toFixed(2));
                    updateProduct(itemName, availableNum);

                });
            }
        });
    });
}

function updateProduct(name, number){
    connection.query("UPDATE products SET ? WHERE ?",
    [{stock_quantity:number},{product_name:name}],
    function(err,data){
        if (err) throw err;
        // console.log(data.affectedRows + " Updated.");
    });
    inquirer.prompt([
        {
            type: "list",
            message: "Make More purchase? Exit the store?",
            choices: ["Purchase", "Quit"],
            name: "action"
        }
    ]).then(function (response) {
        if (response.action == "Quit") { // if user don't wanna buy ,end the connection
                console.log("Thanks for visiting bamazon, See you again");
                // calTotal();
                connection.end();
            }
        else {  
            displayProducts();
        }
    });
}
 
