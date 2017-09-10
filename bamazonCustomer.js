var mysql = require("mysql");
var inquirer = require("inquirer");



// function that starts if Customer is chosen in first questions
function bamazonCustomer() {
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
      }, {
        name: "amountbuy",
        type: "input",
        message: "How many would you like to buy?",
        validate: validInt
      }])
      .then(function(stuff) {
        var pickedItem;
        for (var i = 0; i < results.length; i++) {
          pickedItem = results[i];
        }
      });
    if (pickedItem.stock_quantity < parseInt(stuff.amountbuy)) {
      console.log("I am sorry there is not enough stock for this amount!");
    } else {
      // connection.query("UPDATE ")
    }
  });
};

function validInt(int) {
  var reg = /^\d+$/;
  return reg.test(int) || "This should be a number!";
};


module.exports = bamazonCustomer;
