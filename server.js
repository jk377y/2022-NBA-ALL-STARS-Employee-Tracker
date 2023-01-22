const mysql = require('mysql2')
const inquirer = require('inquirer')
const cTable = require('console.table')
const dotenv = require('dotenv')
require('dotenv').config()

// query database in scope with .promise
//  const [rows, fields] =  connection.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);

// *************************************************************************************
// Connection - using variables from dotenv file for security purposes
// *************************************************************************************
const db = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    Promise: Promise
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Database is connected!");
    startMenu();
    });

// *************************************************************************************
// Start Menu - gives View, Add, Update and Exit options
// *************************************************************************************
function startMenu() {
    // Present main menu options to the user
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Exit"
            ]
        }
    ]).then(answer => {
        // Call the corresponding functions based on the user's choice
        switch (answer.menu) {
            case "View all departments":
                viewAllDepartments();
                break;
            case "View all roles":
                viewAllRoles();
                break;
            case "View all employees":
                viewAllEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployeeRole();
                break;
            case "Exit":
                exit();
                break;
        }
    });
}

const viewAllDepartments = async () => {
    db.query("SELECT * FROM departmentTable", (err, result) => {
        if (err) {
            console.log("An Error Occured: ", err);
        } else {
            console.table(result);
            startMenu();
        }
    });
};

const viewAllRoles = async () => {
    db.query("SELECT * FROM roleTable", (err, result) => {
        if (err) {
            console.log("An Error Occured: ", err);
        } else {
            console.table(result);
            startMenu();
        }
    });
};

const viewAllEmployees = async () => {
    db.query("SELECT * FROM employeeTable", (err, result) => {
        if (err) {
            console.log("An Error Occured: ", err);
        } else {
            console.table(result);
            startMenu();
        }
    });
};

async function addDepartment() {
    try {
        const answer = await inquirer.prompt ([
            {
                type: "input",
                name: "deptName",
                message: "Enter the name of the new department:"
            }
        ]);
        const {deptName} = answer;
        const query = `INSERT INTO departmentTable (deptName) VALUES ('${deptName}')`;
        await db.promise().query(query);
        console.log(`Department ${deptName} added successfully`);
        startMenu();
    }   
    catch (err) {
        console.log("Error Occurred: ", err);
    }
}

async function addRole() {
    try {
        const answer = await inquirer.prompt ([
            {
                type: "input",
                name: "roleTitle",
                message: "Enter the title of the new role:"
            },
            {
                type: "input",
                name: "roleSalary",
                message: "Enter the salary of the new role:"
            },
            {
                type: "input",
                name: "deptId",
                message: "Enter the department id of the new role:"
            }
        ]);
        const {roleTitle, roleSalary, deptId} = answer;
        const query = `INSERT INTO roleTable (title, salary, departmentId) VALUES ('${roleTitle}', '${roleSalary}', '${deptId}')`;
        await db.promise().query(query);
        console.log(`Role ${roleTitle} added successfully`);
        startMenu();
    }   
    catch (err) {
        console.log("Error Occurred: ", err);
    }
}

async function addEmployee() {
    try {
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "Enter the first name of the new employee:"
            },
            {
                type: "input",
                name: "lastName",
                message: "Enter the last name of the new employee:"
            },
            {
                type: "input",
                name: "roleId",
                message: "Enter the role ID of the new employee:"
            },
            {
                type: "input",
                name: "managerId",
                message: "Enter the manager ID of the new employee (if any):"
            }
        ]);
        const { firstName, lastName, roleId, managerId } = answers;
        const query = `INSERT INTO employeeTable (firstName, lastName, roleId, managerId) 
                       VALUES ('${firstName}', '${lastName}', '${roleId}', ${managerId || null})`;
        await db.promise().query(query);
        console.log(`Employee ${firstName} ${lastName} added successfully`);
        startMenu();
    } catch (err) {
        console.log("Error Occurred: ", err);
    }
}






// todos:
// updateEmployeeRole()
// exit()


