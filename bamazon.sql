DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT  PRIMARY KEY,
  department_name VARCHAR(45) NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  price FLOAT(10,2) NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0,
  product_sales FLOAT(10,2) NOT NULL DEFAULT 0
);

INSERT INTO products (department_name,product_name, price, stock_quantity, product_sales) VALUES ("Toy","Toy Car", 19.20 , 200, 400) ,("Toy","Toy Ship", 25.00, 120,320),
("Toy","Toy Airplane", 22.99 , 100, 400),("Game","Dark Souls 3", 29.99 , 50, 300) ,("Game","Spelunker world", 10.00, 100, 400),("Game","Don't starve together", 13.99 , 200, 400),
("Food","Coke soda 6 pack", 5.00 , 200,350) ,("Food","Mochi Icecream", 10.00 , 500, 700),("Clothes"," T-top white female", 8.00 , 100,0),("Clothes","Suite", 80.00 , 30,600) ;

-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);
SELECT * FROM products;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT  PRIMARY KEY,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs FLOAT(10,2) NOT NULL
);

INSERT INTO departments (department_name,over_head_costs) VALUES ("Toy", 900) ,("Game", 800) ,("Food",600),("Clothes" , 800);

-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);
SELECT * FROM departments;

-- SELECT A.department_id,A.department_name, A.over_head_costs,SUM(B.product_sales) AS totalSale  FROM departments as A LEFT JOIN products as B ON A.department_name = B.department_name  GROUP BY  A.department_id;
-- SELECT A.department_id,A.department_name, A.over_head_costs FROM departments as A LEFT JOIN products as B ON A.department_name = B.department_name  GROUP BY  A.department_id;

