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

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tony", "Albertson", 1, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Toby", "McDermott", 1, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Olga", "Pavlova", 1, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Maria","De la Costa", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alex", "Bienvenue", 3, 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Miguel", "Suarez", 3, 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rebekah", "Glass", 3, 8);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Richard", "Smith", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Christina", "Lang", 5, 12);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Zhou", 5, 12);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Monica", "Brighton", 5, 12);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ralph", "Vaughan Williams", 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mahler", "Gustav", 7, 16);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sondheim", "Stephen", 7, 16);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Guillermina", "Barroso-Orozco", 7, 16);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ignacio", "Barroso", 8);



CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Engineering");

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Person", 55000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES ("Sales Lead", 65000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES ("Software Engineer", 65000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES ("Lead Engineer", 100000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES ("Accountant", 70000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES ("Account Manager", 110000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES ("Junior Legal", 100000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES ("Legal Team Lead", 150000, 2);








