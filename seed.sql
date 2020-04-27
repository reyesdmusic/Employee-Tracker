DROP DATABASE IF EXISTS employeesDB;
CREATE DATABASE employeesDB;

USE employeesDB;

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Tony", "Albertson", 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Toby", "McDermott", 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Olga", "Pavlova", 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Maria","De la Costa", 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Alex", "Bienvenue", 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Miguel", "Suarez", 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Rebekah", "Glass", 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Richard", "Smith", 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Christina", "Lang", 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Michael", "Zhou", 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Monica", "Brighton", 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ralph", "Vaughan Williams", 6);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Mahler", "Gustav", 7);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Sondheim", "Stephen", 7);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Guillermina", "Barroso-Orozco", 7);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ignacio", "Barroso", 8);





INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Kennedy", "Davenport",);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Trixie", "Mattel", );

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Erin", "Sorvino", );

CREATE TABLE department (
  id INT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO department (id, name)
VALUES (1, "Sales");

INSERT INTO department (id, name)
VALUES (2, "Legal");

INSERT INTO department (id, name)
VALUES (3, "Finance");

INSERT INTO department (id, name)
VALUES (4, "Engineering");

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Sales Person", 55000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "Sales Lead", 65000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (3, "Software Engineer", 65000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Lead Engineer", 100000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (5, "Accountant", 70000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (6, "Account Manager", 110000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (7, "Junior Legal", 100000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (8, "Legal Team Lead", 150000, 2);








