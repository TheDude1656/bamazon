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
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which starts the bamazon app - chooses whether the user is a customer or admin
function start() {
  inquirer
    .prompt([{
      name: "customerOrAdmin",
      type: "list",
      message: "Are you a customer or an administrator?",
      choices: ["Customer", "Administrator"]
    }])
    .then(function (res) {
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
  setTimeout(function () {
    connection.query("SELECT * FROM products", function (err, results) {
      if (err) throw err;
      console.log("Item |  Price | Stock");
      console.log("_____________________");
      for (var i = 0; i < results.length; i++) {

        console.log(results[i].product_name + " | " + "$" + results[i].price + " | " + results[i].stock_quantity);
      }
      setTimeout(startQuestions, 6000);

      function startQuestions() {
        inquirer
          .prompt([{
            type: "list",
            message: "Which item would you like to buy?",
            choices: function () {
              var itemsArr = [];
              for (var i = 0; i < results.length; i++) {
                itemsArr.push(results[i].product_name);
              }
              return itemsArr;
            },
            name: "itemlist",
          }, {
            type: "input",
            message: "How many would you like to buy?",
            validate: function (amountbuy) {
              var reg = /^\d+$/;
              return reg.test(amountbuy) || "This should be a number!";
            },
            name: "amountbuy"
          }])
          .then(function (stuff) {
            var pickedItem;
            for (var i = 0; i < results.length; i++) {
              if (results[i].product_name === stuff.itemlist) {
                pickedItem = results[i];
              }
            }
            if (pickedItem.stock_quantity < stuff.amountbuy) {
              console.log("I am sorry there is not enough stock for this amount!");
              console.log("We only have " + pickedItem.stock_quantity + " in stock!");
              setTimeout(startQuestions, 1000);
            } else {
              console.log("Great!  Let me place that order for you!");
              var itemSelected = pickedItem.item_id;
              var quantitySelected = stuff.amountbuy;
              connection.query("UPDATE products SET ? WHERE ?", [{
                  stock_quantity: pickedItem.stock_quantity - quantitySelected
                },
                {
                  item_id: itemSelected
                }
              ], function (err) {
                if (err) throw err;
                console.log("Order has been placed!");
                console.log("Your total for this order is $" + (quantitySelected * pickedItem.price));
                inquirer.prompt([{
                    type: "confirm",
                    message: "Are you done ordering items?",
                    name: "confirm",
                    default: true
                  }])
                  .then(function (finished) {
                    if (finished.confirm) {
                      console.log("Thank you come again!");
                      connection.end();
                    } else {
                      setTimeout(bamazonCustomer, 3000);
                    }
                  })

              });
            }
          });
      };
    });
  }, 3000);

};

function bamazonAdmin() {
  console.log("____________________________");
  console.log("|                           |");
  console.log("|Starting Administrator App!|");
  console.log("|                           |");
  console.log("____________________________\n");
  setTimeout(goAdmin, 3000);

  function goAdmin() {
    connection.query("SELECT * FROM products", function (err, results) {
      if (err) throw err;
      inquirer
        .prompt([{
          type: "list",
          message: "What would you like to do?",
          choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
          name: "adminOption"
        }])
        .then(function (res) {
          if (res.adminOption === "View Products for Sale") {
            console.log("Item ID | Item |  Department | Price | Stock");
            console.log("____________________________________________");
            for (var i = 0; i < results.length; i++) {
              console.log(results[i].item_id + " | " + results[i].product_name + " | " + results[i].department_name + " | $" + results[i].price + " | " + results[i].stock_quantity);
            }
            goAdmin();
          } else if (res.adminOption === "View Low Inventory") {
            for (var i = 0; i < results.length; i++) {
              if (results[i].stock_quantity < 5) {
                console.log("Item low on stock: " + results[i].product_name + " | QTY: " + results[i].stock_quantity);
              }
            }
            goAdmin();
          } else if (res.adminOption === "Add New Product") {
            inquirer
              .prompt([{
                  type: "input",
                  message: "What is the item name?",
                  name: "itemAdd"
                },
                {
                  type: "input",
                  message: "How many are you selling?",
                  name: "itemQty",
                  validate: function (qtyadd) {
                    var reg = /^\d+$/;
                    return reg.test(qtyadd) || "This should be a number!";
                  }
                },
                {
                  type: "input",
                  message: "How much is this product?",
                  name: "itemPrice",
                  validate: function (itemPrice) {
                    var isNumber = /^(?!0\.00)[1-9]\d{0,2}(,\d{3})*(\.\d\d)?$/;
                    return isNumber.test(itemPrice) || "This needs to be a price!(i.e. 2.99)";
                  }
                },
                {
                  type: "input",
                  message: "What is the department this is sold in?",
                  name: "itemDepartment"
                }
              ])
              .then(function (results) {
                console.log("Item to add")
                console.log("Item: " + results.itemAdd + "\nQty: " + results.itemQty + "\nPrice: $" + results.itemPrice + "\nDepartment: " + results.itemDepartment);
                connection.query("INSERT INTO products SET ?", {
                  product_name: results.itemAdd,
                  department_name: results.itemDepartment,
                  price: results.itemPrice,
                  stock_quantity: results.itemQty
                }, function (err) {
                  if (err) throw err;
                  console.log("Item has been added!");
                  goAdmin();
                })

              });
          } else if (res.adminOption === "Add to Inventory") {
            inquirer
              .prompt([{
                type: "list",
                message: "What item would you like to update the inventory for?",
                choices: function () {
                  var itemsArr = [];
                  for (var i = 0; i < results.length; i++) {
                    itemsArr.push(results[i].product_name);
                  }
                  return itemsArr;
                },
                name: "invAdd"
              }, {
                type: "input",
                message: "Amount to add to existing inventory?",
                name: "invAddQty",
                validate: function (invqtyadd) {
                  var reg = /^\d+$/;
                  return reg.test(invqtyadd) || "This should be a number!";
                }
              }])
              .then(function (results) {
                connection.query("UPDATE products SET stock_quantity=stock_quantity+ ? WHERE product_name=?", [results.invAddQty, results.invAdd], function (err) {
                  if (err) throw err;
                  console.log("Item: " + results.invAdd + "\nQty added: " + results.invAddQty + "\nItem has been updated in db!");
                  goAdmin();
                })
              })
          }
        })
    })
  };
}