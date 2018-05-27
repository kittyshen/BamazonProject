-- DROP DATABASE IF EXISTS bamazon;

-- CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT  PRIMARY KEY,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs FLOAT(10,2) NOT NULL
);

INSERT INTO departments (department_name,over_head_costs) VALUES ("Toy", 200) ,("Game", 500) ,("Food",300),("Clothes" , 800);

-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);
SELECT * FROM departments