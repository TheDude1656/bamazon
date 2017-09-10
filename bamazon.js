var mysql = require("mysql");
var inquirer = require("inquirer");


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "schoolpassword",
  database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// funciton which starts the bamazon app - chooses whether the user is a customer or admin
function start() {
  inquirer
    .prompt([{
      name: "customerOrAdmin",
      type: "list",
      message: "Are you a customer or an administrator?",
      choices: ["Customer", "Administrator"]
    }])
    .then(function(res) {
      console.log(res.customerOrAdmin);
      if (res.customerOrAdmin === "Customer") {
        bamazonCustomer();
      } else {
        bamazonAdmin();
      }
    })
};

// function that starts if Customer is chosen in first question
function bamazonCustomer() {
  console.log("________________________");
  console.log("|                      |");
  console.log("|Starting Customer App!|");
  console.log("|                      |");
  console.log("________________________\n");
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    inquirer
      .prompt([{
          name: "itemlist",
          type: "rawlist",
          choices: function() {
            var itemsArr = [];
            for (var i = 0; i < results.length; i++) {
              itemsArr.push(results[i].product_name);
            }
            return itemsArr;
          },
          message: "Which item would you like to view?"
        },
        {
          name: "amountbuy",
          type: "input",
          message: "How many would you like to buy?",
          validate: function(amountbuy) {
            var reg = /^\d+$/;
            return reg.test(amountbuy) || "This should be a number!";
          }
        }
      ])
      .then(function(stuff) {
        var pickedItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === stuff.itemlist) {
            pickedItem = results[i];
          }
        }
        if (pickedItem.stock_quantity < stuff.amountbuy) {
          console.log("I am sorry there is not enough stock for this amount!");
        } else {
          console.log("placeholder");
          // connection.query("UPDATE ")
        }
      });
  });
