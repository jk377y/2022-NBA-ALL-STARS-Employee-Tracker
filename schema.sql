DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    departmentName VARCHAR(30)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(65, 2) NOT NULL,
    departmentId INT NOT NULL,
    FOREIGN KEY (departmentId) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    roleId INT NOT NULL,
    managerId INT,
    FOREIGN KEY (roleId) REFERENCES role(id) ON DELETE SET NULL,
    FOREIGN KEY (managerId) REFERENCES employee(id) ON DELETE SET NULL
);

