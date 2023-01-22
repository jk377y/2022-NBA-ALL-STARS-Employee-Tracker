const mysql = require('mysql2')  // mysql2 module package
const inquirer = require('inquirer')  // inquirer module package
const cTable = require('console.table')  // console.table module package
const dotenv = require('dotenv')  // dotenv module package
require('dotenv').config()  // accessing .env variables

// discovered an npm package to help decorate
const chalk = require('chalk')
const log = console.log
const bad = chalk.redBright
const good = chalk.bgGreen.white
const good1 = chalk.bgRed.white
const good2 = chalk.bgWhite.black
const good3 = chalk.bgBlue.white
const view = chalk.bgCyan.white
const del = chalk.bgRed.white
const update = chalk.bgRgb(125,100,0).white
const thanks = chalk.bgYellow.black

// *************************************************************************************
//        Connection - using variables from dotenv file for security purposes
// *************************************************************************************
const db = mysql.createConnection({  // creating a database connection called db
    // importing these values from the .env file; setting promise wrapper
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    Promise: Promise
});

db.connect(function(err) {  // displaying success status in terminal if db connects
    if (err) throw err;  // or error message
    log(good("\n", "Database connected successfully", "\n"))
    log(good1("\n", "********* INTRODUCING **********"));
    log(good2("************   THE   ************"));
    log(good3(" *** 2022 NBA ALL STAR TEAMS ***", "\n"));

    startMenu();  // returns to main menu after table is printed
    });

// *************************************************************************************
//               Start Menu - gives View, Add, Update and Exit options
// *************************************************************************************
function startMenu() {  // present main menu options to the user
    log(good("********** MAIN MENU **********"))
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
                // "View Employees by Manager",  // not useable
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
            // case "View Employees by Manager":  // not usable
            //     viewEmployeesByManager();
            //     break;
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

// *************************************************************************************
//   View (SELECT) fuctions - departments, role, employees and salaries by department
// *************************************************************************************

const viewAllDepartments = async () => {
    db.query("SELECT * FROM departmentTable", (err, result) => {  // queries everything from the departmentTable
        if (err) {
            log(bad("\n", "An Error Occured: ", err, "\n"));
        } else {
            log(view("\n", "Viewing All Departments"))
            console.table(result, "\n");  // sends the output to the terminal window
            startMenu();  // returns to main menu after table is printed
        }
    });
};

const viewAllRoles = async () => {
    db.query("SELECT * FROM roleTable", (err, result) => {  // queries everything from the roleTable
        if (err) {
            log(bad("\n", "An Error Occured: ", err, "\n"));
        } else {
            log(view("\n", "Viewing All Roles"))
            console.table(result, "\n");  // sends the output to the terminal window
            startMenu();  // returns to main menu after table is printed
        }
    });
};

const viewAllEmployees = async () => {
    db.query(`SELECT employeeTable.id, employeeTable.firstName, employeeTable.lastName, roleTable.title, departmentTable.deptname, roleTable.salary, employeeTable.managerId 
                FROM employeeTable 
                JOIN roleTable ON employeeTable.roleId = roleTable.id 
                JOIN departmentTable ON roleTable.departmentId = departmentTable.id`, (err, result) => { 
        if (err) {
            log(bad("\n", "An Error Occured: ", err, "\n"));
        } else {
            log(view("\n", "Viewing All Employees"))
            console.table(result, "\n");  // sends the output to the terminal window
            startMenu();  // returns to main menu after table is printed
        }
    });
};

async function viewSalariesByDepartment() {  // get the total salary for each department
    try {
        const query = `
        SELECT departmentTable.deptName as department, 
        SUM(roleTable.salary) as total_salary
        FROM employeeTable 
        JOIN roleTable ON employeeTable.roleId = roleTable.id 
        JOIN departmentTable ON roleTable.departmentId = departmentTable.id 
        GROUP BY departmentTable.id;`;
        const [rows] = await db.promise().query(query);  // query 3 tables and joining them on several columns, uses the SUM function to calculate the total salary of all employees in each department, setting those values into an array
        log(view("\n", "Viewing Salaries By Department"))
        console.table(rows, "\n");
        startMenu();  // returns to main menu after table is printed
    } catch (err) {
        console.log("\n");
        log(bad("\n", "An Error Occured: ", err, "\n"));
        console.log("\n");
    }
}

// *************************************************************************************
//                Add (INSERT) fuctions - departments, role and employees
// *************************************************************************************

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
        const query = `INSERT INTO departmentTable (deptName) VALUES ('${deptName}')`;  // creating an INSERT command based on user input
        await db.promise().query(query);  // using INSERT to add the users input into the departmentTable
        log(good("\n", `Department ${deptName} added successfully`, "\n"));
        startMenu();  // returns to main menu after new department is added
    }   
    catch (err) {
        log(bad("\n", "An Error Occured: ", err, "\n"));
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
            }
            // {
            //     type: "input",
            //     name: "deptId",
            //     message: "Enter the department id of the new role:"
            // }
        ]);
        const {roleTitle, roleSalary} = answer;  // creating an INSERT command based on user input
        const query = `INSERT INTO roleTable (title, salary) 
                        VALUES ('${roleTitle}', '${roleSalary}')`;
        await db.promise().query(query);  // using INSERT to add the users input into the roleTable
        log(good("\n", `Role ${roleTitle} added successfully`, "\n"));
        startMenu();  // returns to main menu after new role is added
    }   
    catch (err) {
        log(bad("\n", "An Error Occured: ", err, "\n"));
    }
}

async function addEmployee() {
    try {
        // Get existing role IDs from the database
        const [rows] = await db.promise().query("SELECT id FROM roleTable"); // querying the roleTable for all role IDs and storing them in [rows] then the returned data is destructured into rows
        const roleIds = rows.map(row => row.id); // using the map function to extract the id from each row and store it in an array called roleIds
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
        const { firstName, lastName, roleId, managerId } = answers;  // using destructuring to extract the values of firstName, lastName, roleId, and managerId from the "answers" object
        const query = `INSERT INTO employeeTable (firstName, lastName, roleId, managerId) 
                       VALUES ('${firstName}', '${lastName}', '${roleId}', ${managerId || null})`;  // query to insert the new employee's information into the employeeTable
        await db.promise().query(query);  // executing the query and waiting for the promise to be resolved
        log(good("\n", `Employee ${firstName} ${lastName} added successfully`, "\n"));
        startMenu();  // returns to main menu after new employee is added
    } catch (err) {
        log(bad("\n", "An Error Occured: ", err, "\n"));
    }
}

// *************************************************************************************
//                  DELETE fuctions - departments, role and employees
// *************************************************************************************

async function deleteDepartment() {
    try {
        const [rows] = await db.promise().query("SELECT id, deptName FROM departmentTable");  // get existing departments from the departmentTable
        const departments = rows.map(row => ({ name: row.deptName, value: row.id })); // using the map function to extract the id from each row and store it in an array called departments
        const { departmentId } = await inquirer.prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Choose the department you want to delete:",
                choices: departments,
            }
        ]);
        const query = `DELETE FROM departmentTable WHERE id = ${departmentId}`;  // setting delete command for selected department from above
        await db.promise().query(query);  // sent delete command to the departmentTable
        log(del("Department deleted successfully"));
        startMenu();  // returns to main menu after above is executed
    } catch (err) {
        log(bad("\n", "An Error Occured: ", err, "\n"));
    }
}

async function deleteRole() {
    try {
        const [rows] = await db.promise().query("SELECT id, title FROM roleTable");  // get existing roles from the roleTable
        const roles = rows.map(row => ({ name: row.title, value: row.id })); // using the map function to extract the id from each row and store it in an array called roles
        const { role } = await inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "Choose the role you want to delete:",
                choices: roles,
            }
        ]);
        const query = `DELETE FROM roleTable WHERE id = ${role}`;  // creating the DELETE query command
        await db.promise().query(query);  // executing the query
            log(del("Role deleted successfully"));
            startMenu();  // returns to main menu after above is executed
        } catch (err) {
            log(bad("\n", "An Error Occured: ", err, "\n"));
        }
}

async function deleteEmployee() {
    try {
    const [rows] = await db.promise().query("SELECT id, CONCAT(firstName, ' ', lastName) as name FROM employeeTable");  // querying employeeTable to get all employee ids and names and storing them in an array called [rows] then the returned data is destructured into rows. The CONCAT function is used to concatenate the firstName and lastName to get the full name of the employee
    const employees = rows.map(row => (  // using the map function to extract the employee name and id from each row and store it in an array called [employees]. It's mapping the employees to an array of objects with properties 'name' and 'value'
        { 
            name: row.name, 
            value: row.id 
        }
    ));
    const { employeeName } = await inquirer.prompt([  // use the list of employees from above to present the user with an option for deletion
        {
            type: "list",
            name: "employeeName",
            message: "Choose the employee you want to delete:",
            choices: employees,
        }
    ]);
    const query = `DELETE FROM employeeTable WHERE id = ${employeeName}`;  // make query command DELETE to delete the selected employee from the employeeTable. the WHERE is used to specify the condition that identifies which employee to delete
    await db.promise().query(query);  // executing the query on the database
    log(del("Employee deleted successfully"));
    startMenu();  // returns to main menu after above is executed
    } catch (err) {
        log(bad("\n", "An Error Occured: ", err, "\n"));
    }
}

// *************************************************************************************
//                             UPDATE function - employee
// *************************************************************************************

async function updateEmployee() {
    try {
        const [rows] = await db.promise().query("SELECT id, CONCAT(firstName, ' ', lastName) as name FROM employeeTable");  // get existing employees from the database and stores them in [rows] then the returned data is destructured into rows. The CONCAT function is used to concatenate the firstName and lastName to get the full name of the employee
        const employees = rows.map(row => (  // using the map function to extract the employee name and id from each row and store it in an array called [employees]. It's mapping the employees to an array of objects with properties 'name' and 'value'
            { 
                name: row.name, 
                value: row.id 
            }
        ));
        const { updateEmployee } = await inquirer.prompt([  // use the list of employees to present the user with a choice
            {
                type: "list",
                name: "updateEmployee",
                message: "Choose the employee you want to update:",
                choices: employees,
            }
        ]);
        const [roles] = await db.promise().query("SELECT id, title FROM roleTable");  // querying the roleTable to get all roles ids and titles and storing them in an array called [roles]
        const roleOptions = roles.map(role => (  // using the map function to extract the role title and id from each [role] and store it in an array called roleOptions then mapping the roles to an array of objects with properties 'name' and 'value'
            { 
                name: role.title, 
                value: role.id 
            }
        ));
        const { role } = await inquirer.prompt([
            {
                type: "list",
                name: "role",
                message: "Choose the new role for the employee:",
                choices: roleOptions,  // asking the user to choose the new role for the selected employee from a list of all roles retrieved from the roleOptions
            }
        ]);
        const query = `UPDATE employeeTable SET roleId = ${role} WHERE id = ${updateEmployee}`;  // query to UPDATE the selected employee's role in the employeeTable then SET is used to specify the new role (from user input) and the WHERE is used to specify the employee from inquirer list that needs to be updated
        await db.promise().query(query);  // executes the query
        log(update("Employee role updated successfully"));
        startMenu();  // returns to main menu after above is executed
    } catch (err) {
        log(bad("\n", "An Error Occured: ", err, "\n"));
    }
}

// *************************************************************************************
//                                   Exit function
// *************************************************************************************

function exit() {  // rearched to find it is best practice to "gracefully" close a connection, so implementing here
    log(thanks("\n", "         Thanks for using me!         "));
    log(thanks("                                       "))
    if (db.state === 'disconnected') {  // checking to see if db connection is already closed
        log(thanks("  Database connection already closed  "));  // if true
    } else {
        db.end(function(err) {  // if false, closing the database connection by calling the end() on the database object
            if (err) {
                log(bad("Error while closing the connection:", err));  // if an error occurs while attempting to close connection, display this message
                process.exit(1);  // This line of code is used to exit the application with a non-zero exit code, indicating that an error has occurred
            }
            log(thanks("Database connection closed successfully"));  // if closing connection is successful
        });
    }
    process.exit();  // exits the application back to the command prompt
}




// Could not get to work
// function viewEmployeesByManager() {
//     let sql = "SELECT * FROM employeeTable WHERE managerId = 15 or managerId = 16 or managerId is null";
//     db.query(sql, function (err, results) {
//         if (err) throw err;
//         let managers = results.map(result => result.firstName + " " + result.lastName);
//         inquirer.prompt([
//             {
//                 type: "list",
//                 name: "manager",
//                 message: "Select a manager",
//                 choices: managers
//             }
//         ]).then(answer => {
//             let selectedManager = answer.manager;
//             let sql = "SELECT * FROM employeeTable WHERE id = (SELECT id FROM employeeTable WHERE CONCAT(firstName, ' ', lastName) = ?)";
//             db.query(sql, [selectedManager], function (err, results) {
//                 //console.log([selectedManager]);
//                 if (err) throw err;
//                 console.table("\n", results, "\n");
//                 startMenu();  // returns to main menu after above is executed
//             });
//         });
//     });
// }



