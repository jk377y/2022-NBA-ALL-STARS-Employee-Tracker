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
        }
    });
};

const viewAllRoles = async () => {
    db.query("SELECT * FROM roleTable", (err, result) => {
        if (err) {
            console.log("An Error Occured: ", err);
        } else {
            console.table(result);
        }
    });
};

const viewAllEmployees = async () => {
    db.query("SELECT * FROM employeeTable", (err, result) => {
        if (err) {
            console.log("An Error Occured: ", err);
        } else {
            console.table(result);
        }
    });
};

const addDepartment = async () => {
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
    }   
    catch (err) {
        console.log("Error Occurred: ", err);
    }
};




// todos:
// addDepartment()
// addRole()
// addEmployee()
// updateEmployeeRole()
// exit()


