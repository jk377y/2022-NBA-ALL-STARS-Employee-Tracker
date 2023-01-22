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
                "View Salaries by department",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Delete a department",
                "Delete a role",
                "Delete an employee",
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
            case "View Salaries by department":
                viewSalariesByDepartment();
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
            case "Delete a department":
                deleteDepartment();
                break;
            case "Delete a role":
                deleteRole();
                break;
            case "Delete an employee":
                deleteEmployee();
                break;
            case "Update an employee role":
                updateEmployee();
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
        const query = `INSERT INTO roleTable (title, salary, departmentId) 
                        VALUES ('${roleTitle}', '${roleSalary}', '${deptId}')`;
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
        // Get existing role IDs from the database
        const [rows] = await db.promise().query("SELECT id FROM roleTable");
        const roleIds = rows.map(row => row.id);
        
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
                type: "list",
                name: "roleId",
                message: "Choose the role ID for the new employee:",
                choices: roleIds,
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

async function deleteDepartment() {
    try {
        // Get existing departments from the database
        const [rows] = await db.promise().query("SELECT id, deptName FROM departmentTable");
        const departments = rows.map(row => ({ name: row.deptName, value: row.id }));

        // Use the list of departments to present the user with a choice
        const { departmentId } = await inquirer.prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Choose the department you want to delete:",
                choices: departments,
            }
        ]);

        // Delete the selected department
        const query = `DELETE FROM departmentTable WHERE id = ${departmentId}`;
        await db.promise().query(query);
        console.log("Department deleted successfully");
        startMenu();
    } catch (err) {
        console.log("Error Occurred: ", err);
    }
}

async function deleteRole() {
    try {
        // Get existing roles from the database
        const [rows] = await db.promise().query("SELECT id, title FROM roleTable");
        const roles = rows.map(row => ({ name: row.title, value: row.id }));

        // Use the list of roles to present the user with a choice
        const { role } = await inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "Choose the role you want to delete:",
                choices: roles,
            }
        ]);
            // Delete the selected role
        const query = `DELETE FROM roleTable WHERE id = ${role}`;
        await db.promise().query(query);
            console.log("Role deleted successfully");
            startMenu();
        } catch (err) {
            console.log("Error Occurred: ", err);
        }
}

async function deleteEmployee() {
    try {
    // Get existing employees from the database
    const [rows] = await db.promise().query("SELECT id, CONCAT(firstName, ' ', lastName) as name FROM employeeTable");
    const employees = rows.map(row => (
        { 
            name: row.name, 
            value: row.id 
        }
    ));
    
    // Use the list of employees to present the user with a choice
    const { employeeName } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeName",
            message: "Choose the employee you want to delete:",
            choices: employees,
        }
    ]);
    
    // Delete the selected employee
    const query = `DELETE FROM employeeTable WHERE id = ${employeeName}`;
    await db.promise().query(query);
    console.log("Employee deleted successfully");
    startMenu();
    } catch (err) {
        console.log("Error Occurred: ", err);
    }
}

async function updateEmployee() {
    try {
        // Get existing employees from the database
        const [rows] = await db.promise().query("SELECT id, CONCAT(firstName, ' ', lastName) as name FROM employeeTable");
        const employees = rows.map(row => (
            { 
                name: row.name, 
                value: row.id 
            }
        ));

        // Use the list of employees to present the user with a choice
        const { updateEmployee } = await inquirer.prompt([
            {
                type: "list",
                name: "updateEmployee",
                message: "Choose the employee you want to update:",
                choices: employees,
            }
        ]);

        // Get the existing roles
        const [roles] = await db.promise().query("SELECT id, title FROM roleTable");
        const roleOptions = roles.map(role => (
            { 
                name: role.title, 
                value: role.id 
            }
        ));

        // Prompt the user to select a new role
        const { role } = await inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "Choose the new role for the employee:",
                choices: roleOptions,
            }
        ]);

        // Update the selected employee's role
        const query = `UPDATE employeeTable SET roleId = ${role} WHERE id = ${updateEmployee}`;
        await db.promise().query(query);
        console.log("Employee role updated successfully");
        startMenu();
    } catch (err) {
        console.log("Error Occurred: ", err);
    }
}

async function viewSalariesByDepartment() {
    try {
        // Get the total salary for each department
        const query = `
        SELECT departmentTable.deptName as department, 
        SUM(roleTable.salary) as total_salary
        FROM employeeTable
        JOIN roleTable ON employeeTable.roleId = roleTable.id 
        JOIN departmentTable ON roleTable.departmentId = departmentTable.id 
        GROUP BY departmentTable.id;`;
        const [rows] = await db.promise().query(query);
        console.table(rows);
        startMenu();
    } catch (err) {
        console.log("Error Occurred: ", err);
    }
};


// todos:
// exit()


