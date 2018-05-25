DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT  PRIMARY KEY,
  department_name VARCHAR(45) NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  price FLOAT(10,2) NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0
);

INSERT INTO products (department_name,product_name, price, stock_quantity) VALUES ("Toy","Toy Car", 19.20 , 200) ,("Toy","Toy Ship", 25.00, 120);

-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);
SELECT * FROM products