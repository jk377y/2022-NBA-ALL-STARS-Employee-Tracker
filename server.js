//const inquirer = require('inquirer')

//const cTable = require('console.table')
const dotenv = require('dotenv')
const PORT = process.env.PORT || 3001

// connection/login credentials
async function main() {
        const mysql = require('mysql2/promise')
        const connection = await mysql.createConnection(
                {
                        host: process.env.HOST,
                        user: process.env.USER,
                        password: process.env.DATABASE,
                        database: process.env.PASSWORD
                },
                //console.error(err),
                //console.log(result)
        )
}


// set up function
const getInputs = async () => {
        const answers = await inquirer.prompt([
                {
                        type: 'list',
                        name: 'chooseTask',
                        message: 'Choose one of the options below.',
                        choices: [
                                'View all Departments',
                                'View all Roles',
                                'View all Employees',
                                'Add a Department',
                                'Add a Role',
                                'Add an Employee',
                                'Update an Employee',
                                'Exit'
                        ]
                }
        ]);
        


}

// START()://switch/inquirer inputs  -> choose  view/add/update
        // view(),add(),update()


// inquirer:list -> view:  allEmployees, allDepts, allRoles
        //viewAllE(), viewAllD(), viewAllR()

// inquirer:list -> add:  addEmployee, add Depts, addRoles
        //addE(), addD(), addR()

// inquirer:list -> update:  employee, dept, role
        //updateE(),updateD(),updateR()

// loop back to the START()


