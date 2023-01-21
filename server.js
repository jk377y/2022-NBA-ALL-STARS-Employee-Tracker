const inquirer = require('inquirer')
const cTable = require('console.table')
const dotenv = require('dotenv')
const mysql = require('mysql2')

// *************************************************************************************
// Connection - using variables from dotenv file for security purposes
// *************************************************************************************
require('dotenv').config()
async function connect() {
    try {
        const mysql = require('mysql2/promise')
        const connection = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            port: process.env.PORT,
            database: process.env.DATABASE,
            password: process.env.PASSWORD
        })
        console.log("Connection established successfully.")
    } catch (err) {
        console.log(`Error: ${err.message}`)
    }
}   connect()

// *************************************************************************************
// Start Menu - gives View, Add, Update and Exit options
// *************************************************************************************
const start = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'Choose one of the options below.',
            choices: [
                'View Options',
                'Add Options',
                'Update Options',
                'Exit'
            ]
        }
    ]);
    switch (answers.start) {
        case 'View Options':
            await views()
            break;
        case 'Add Options':
            await adds()
            break;
        case 'Update Options':
            await updates()
            break;
        case 'Exit':
            await exit()
    };
};

// *************************************************************************************
// View Menu - gives viewAllDepartments, viewAllRoles, ViewAllEmployees and Exit options
// *************************************************************************************
const views = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'views',
            message: 'Choose one of the options below.',
            choices: [
                'View all Departments',
                'View all Roles',
                'View all Employees',
                'Exit'
            ]
        }
    ]);
    switch (answers.views) {
        case 'View all Departments':
            await viewAllDepartments()
            break;
        case 'View all Roles':
            await viewAllRoles()
            break;
        case 'View all Employees':
            await viewAllEmployees()
            break;
    };
}; 
        
// *************************************************************************************
// Add Menu - gives addDepartment, addRole, addEmployee and Exit options
// *************************************************************************************
const adds = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'adds',
            message: 'Choose one of the options below.',
            choices: [
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Exit'
            ]
        }
    ]);
    switch (answers.adds) {
        case 'Add a Department':
            await addDepartment()
            break;
        case 'Add a Role':
            await addRole()
            break;
        case 'Add an Employee':
            await addEmployee()
            break;
        case 'Exit':
            await exit()
            break;
    };
};

        
  




// exit()
// views()
// adds()
// updates()
// viewAllDepartments()
// viewAllRoles()
// viewAllEmployees()
// addDepartment()
// addRole()
// addEmployee()
