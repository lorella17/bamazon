DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL auto_increment,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL (10,4) NULL,
  stock_quantity INT NOT NULL,

  PRIMARY KEY (item_id)
);

SELECT * FROM bamazon_;
