DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;


USE bamazonDB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45),
  price DECIMAL(9, 2) NOT NULL DEFAULT 0.00,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("ground beef", "food", "4.99", "10"), ("tortilla shells", "food", "1.79", "5"), ("shredded taco blend cheese", "food", "2.79", "15"), ("pico de gallo", "food", "3.59", "3"), ("tomatoes", "food", "0.99", "23");

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("toilet paper", "home furnishings", "6.99", "10"), ("shampoo", "home furnishings", "3.79", "7"), ("conditioner", "home furnishings", "3.49", "8"), ("toothpaste", "home furnishings", "4.49", "12"), ("toothbrush", "homefurnishings", "3.19", "2");
