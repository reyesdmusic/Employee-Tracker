const openingGraphics = require('./lib/openingGraphics'); //opening graphics
const mysql = require("mysql");
const inquirer = require("inquirer");
const clear = require('clear'); //clears terminal viewport
const Table = require('cli-table'); //used to format tables
const chalk = require('chalk'); //used to colorize text
const validate = require('./lib/validate'); //validating functions

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employeesDB"
});
//After connection, initialize graphics and then initialQuestions function
connection.connect(function (err) {
    if (err) throw err;
    openingGraphics();
    initialQuestions();
});
//initialQuestons prompts user then runs the appropriate function
function initialQuestions() {
    inquirer
        .prompt({
            name: "initialChoice",
            type: "list",
            message: "Select one of the following",
            choices:
                ["View all employees.",
                    "View all employees by department.",
                    "View all employees by manager.",
                    "View all departments.",
                    "View all roles.",
                    "Add a new employee.",
                    "Remove employee.",
                    "Update employee role.",
                    "Update employee manager.",
                    "See total labor cost by department.",
                    "Add a new role.",
                    "Add a new department.",
                    "Remove a role.",
                    "Remove a department.",
                    "Done"]
        })
        .then(function (answer) {
            if (answer.initialChoice === "View all employees.") { viewAllEmp(); }
            else if (answer.initialChoice === "View all employees by department.") { viewByDept(); }
            else if (answer.initialChoice === "View all employees by manager.") { viewByMgr(); }
            else if (answer.initialChoice === "Add a new employee.") { addEmp(); }
            else if (answer.initialChoice === "Remove employee.") { removeEmp(); }
            else if (answer.initialChoice === "Update employee role.") { updateRole(); }
            else if (answer.initialChoice === "Update employee manager.") { updateManager(); }
            else if (answer.initialChoice === "See total labor cost by department.") { laborCost(); }
            else if (answer.initialChoice === "Add a new role.") { addRole(); }
            else if (answer.initialChoice === "Add a new department.") { addDepartment(); }
            else if (answer.initialChoice === "Remove a role.") { removeRole(); }
            else if (answer.initialChoice === "Remove a department.") { removeDepartment(); }
            else if (answer.initialChoice === "View all departments.") { viewDepartments(); }
            else if (answer.initialChoice === "View all roles.") { viewRoles(); }
            else {
                clear();
                connection.end()
            }
        });
}
//viewALlEmp query uses a LEFT SELF-join of the employee table to render managers in both the manager and employee columns. Also, Employee Table is joined with Role on role_id and Role is joined with Department Table on department_id. Then renderTable function renders a table using the query response.
function viewAllEmp() {
    connection.query("SELECT e.id, e.first_name, e.last_name, title, salary, name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id;", ["manager_first_name", "manager_last_name"], function (err, res) {
        renderTable(err, res);
    })
}
//in viewByDept, the empNameAndIdArrays function is used to render Department Names in the choices list.
function viewByDept() {
    connection.query("SELECT name FROM department;", function (err, res) {

        if (err) throw err;

        inquirer
            .prompt({
                name: "deptName",
                type: "list",
                message: "Ok, which department?",
                choices: empNameAndIdArrays(err, res, "department")[1]
            })
            .then(function (answer) {
                connection.query("SELECT e.id, e.first_name, e.last_name, title, salary, name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id where name = ? ;", ["manager_first_name", "manager_last_name", answer.deptName], function (err, res) {
                    renderTable(err, res);
                })
            })
    })
}
//viewByMgr is similar to viewByDept, this time the empNameAndIdArrays function helps us keep track of both the Names and Ids of all managers. Passing the user's answer and the managerArrays into the findId function allows the query search to user-selected Manager's ID to perform the search.
function viewByMgr() {
    
    clear();

    connection.query("SELECT m.first_name AS ? , m.last_name AS ? , m.id FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id GROUP BY m.id;", ["manager_first_name", "manager_last_name"], function (err, res) {

        let managerArrays = empNameAndIdArrays(err, res, "manager");

        inquirer
            .prompt({
                name: "findThisName",
                type: "list",
                message: "Ok, which manager?",
                choices: managerArrays[1]

            })
            .then(function (answer) {
                connection.query("SELECT e.id, e.first_name, e.last_name, title, salary, name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id where m.id = ?;", ["manager_first_name", "manager_last_name", findId(answer, managerArrays)], function (err, res) {
                renderTable(err, res);
                })          
            })
    })

}
//uses INSERT to add a new employee.
function addEmp() {
//clear(); is a function of the "clear dependency", it clears the terminal viewport for a tidier user experience.
    clear();
//These two queries, one from Employee, the other from Role, are used to later populate the list choices in the inquirer propmpt.
    connection.query("SELECT first_name, last_name, id FROM employee;", function (err, res) {

        let managerArrays = empNameAndIdArrays(err, res, "employee", "yes");
        let roleId = 0;
        let newManagerId = 0;
    
        connection.query("SELECT title, id FROM role;", function (err, res) {

            let roleArrays = empNameAndIdArrays(err, res, "role");
//Validation functions are declared in ./lib/validate.js using "joi" npm library.
            inquirer
                .prompt([{
                    name: "empName",
                    type: "text",
                    message: "Enter employee's first name:",
                    validate: validate.validateString
                },
                {
                    name: "empLastName",
                    type: "text",
                    message: "Enter employee's last name:",
                    validate: validate.validateString
                },
                {
                    name: "empTitle",
                    type: "list",
                    message: "What is the employee's title?",
                    choices: roleArrays[1]
                },
                {
                    name: "empManager",
                    type: "list",
                    message: "Who is the employee's Manager?",
                    choices: managerArrays[1]
                }])
                .then(function (answer) {
//The user is only presented with Manager Names and Role Title, the following forEach loops determine the appropriate ID's. 
                    roleArrays[1].forEach((value, i) => {if (answer.empTitle === roleArrays[1][i]) {roleId = roleArrays[0][i];}});
        
                    managerArrays[1].forEach((value, i) => {if (answer.empManager === managerArrays[1][i]) {newManagerId = managerArrays[0][i];}});
//Since having a manager is OPTIONAL, the user can select None, in which case the corresponding ID is NULL and this function is query is called. Otherwise, an Insert query with the manager_id is called.
                    if (newManagerId === "NULL") {
                        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, NULL)", [answer.empName, answer.empLastName, roleId], function (err, res) {
                            if (err) throw err;
                            clear();
                            let success = chalk.greenBright(`You've succesfully added ${answer.empName} ${answer.empLastName}.`)
                            console.log(success)

                            initialQuestions();
                        })
                    }
                    else {
                        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [answer.empName, answer.empLastName, roleId, newManagerId], function (err, res) {
                            if (err) throw err;
                            clear();
                            let success = chalk.greenBright(`You've succesfully added ${answer.empName} ${answer.empLastName}.`)
                            console.log(success)

                            initialQuestions();
                        })
                    }
                })
        })
    })
}
//DELETE query removes employee from the database. Again empNameAndIdArrays and findId is used.
function removeEmp() {
    clear();
    connection.query("SELECT first_name, last_name, id FROM employee;", function (err, res) {

        let empArrays = empNameAndIdArrays(err, res, "employee")

        inquirer
            .prompt({
                name: "findThisName",
                type: "list",
                message: "Select employee to remove:",
                choices: empArrays[1]
            })
            .then(function (answer) {

                connection.query("DELETE from employee where id = ?;", [findId(answer, empArrays)], function (err, res) {
                    if (err) throw err;
                    clear();
                    let success = chalk.greenBright(`You've succesfully removed ${answer.findThisName}.`)
                    console.log(success)

                    initialQuestions();
                })
            })

    })
}
//Uses UPDATE query to update employee Role.
function updateRole() {
    clear();
    connection.query("SELECT first_name, last_name, id FROM employee;", function (err, res) {

        let empArrays = empNameAndIdArrays(err, res, "employee");

        inquirer
            .prompt({
                name: "findThisName",
                type: "list",
                message: "Select employee to update:",
                choices: empArrays[1]
            })
            .then(function (answer) {
                let selectedEmpName = answer.findThisName;
                updateThisId = findId(answer, empArrays);

                connection.query("SELECT title, id FROM role;", function (err, res) {

                   let roleArrays = empNameAndIdArrays(err, res, "role");

                    inquirer
                        .prompt({
                            name: "findThisName",
                            type: "list",
                            message: "Ok, which role?",
                            choices: roleArrays[1]

                        })

                        .then(function (answer) {
                            roleId = findId(answer, roleArrays);

                            connection.query("UPDATE employee set role_id = ? where id = ?;", [roleId, updateThisId], function (err, res) {
                                if (err) throw err;
                                clear();
                                let success = chalk.greenBright(`You've succesfully updated ${selectedEmpName}'s role to ${answer.findThisName}.`)
                                console.log(success)

                                initialQuestions();
                            })
                        })
                })
            })
    })
}
//Uses UPDATE query to update employee manager.
function updateManager() {
    clear();
    connection.query("SELECT first_name, last_name, id FROM employee;", function (err, res) {

        let empArrays = empNameAndIdArrays(err, res, "employee");

        let managerArrays = empNameAndIdArrays(err, res, "employee", "yes");

        inquirer
            .prompt({
                name: "findThisName",
                type: "list",
                message: "Select employee to update:",
                choices: empArrays[1]
            })
            .then(function (answer) {
                let selectedEmpName = answer.findThisName;
                updateThisId = findId(answer, empArrays);
    
                inquirer
                    .prompt({
                        name: "findThisName",
                        type: "list",
                        message: "Who is the new manager?",
                        choices: managerArrays[1]
                    })
                    .then(function (answer) {
                        setThisManagerId = findId(answer, managerArrays);

                        if (setThisManagerId === "NULL") {
                            connection.query("UPDATE employee set manager_id = NULL where id = ?;", [updateThisId], function (err, res) {
                                if (err) throw err;
                                clear();
                                let success = chalk.greenBright(`You've succesfully updated ${selectedEmpName}'s manager to none.`)
                                console.log(success)

                                initialQuestions();
                            })
                        }
                        else {
                            connection.query("UPDATE employee set manager_id = ? where id = ?;", [setThisManagerId, updateThisId], function (err, res) {
                                if (err) throw err;
                                clear();
                                let success = chalk.greenBright(`You've succesfully updated ${selectedEmpName}'s manager to ${answer.findThisName}.`)
                                console.log(success)

                                initialQuestions();
                            })
                        }
                    })
            })
    })
}
//Uses sum() function in sql to sum all salaries
function laborCost() {

    clear();

    connection.query("SELECT name FROM department;", function (err, res) {

        let departmentArrays = empNameAndIdArrays(err, res, "department");

        inquirer
            .prompt({
                name: "deptName",
                type: "list",
                message: "Ok, which department?",
                choices: departmentArrays[1]

            })
            .then(function (answer) {
                connection.query("SELECT sum(salary) AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id where name = ? ;", ["sum_salary", answer.deptName], function (err, res) {
                    renderTable2(err, res, "Department", "cost", answer);
                })
            })
    })

}
//Add a new role
function addRole() {
    clear();
    connection.query("SELECT name, id FROM department;", function (err, res) {

        let nameArrays = empNameAndIdArrays(err, res, "department")

        inquirer
            .prompt([{
                name: "roleName",
                type: "text",
                message: "Enter Title for the new role:",
                validate: validate.validateString
            },
            {
                name: "roleSalary",
                type: "input",
                message: "Enter Salary for the new role:",
                validate: validate.validateNumber
            },
            {
                name: "findThisName",
                type: "list",
                message: "Which department does this role belong to?",
                choices: nameArrays[1]
            },
            ])
            .then(function (answer) {
               
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);", [answer.roleName, answer.roleSalary, findId(answer, nameArrays)], function (err, res) {

                    if (err) throw err;

                    clear();
                    let success = chalk.greenBright(`You've succesfully added ${answer.roleName}.`)
                    console.log(success)

                    initialQuestions();
                }) 
            }) 
    }) 
}
//Add a department
function addDepartment() {
    clear();

    inquirer
        .prompt({
            name: "departmentName",
            type: "text",
            message: "Enter Department name:",
            validate: validate.validateString
        })
        .then(function (answer) {
            let selectedDepartment = answer.departmentName;

            connection.query("INSERT INTO department (name) VALUES (?);", [answer.departmentName], function (err, res) {

                if (err) throw err;

                clear();

                let success = chalk.greenBright(`You've succesfully added ${selectedDepartment}.`)
                console.log(success)

                initialQuestions();
            }) 
        }) 

}
//Remove role
function removeRole() {
    clear();
    connection.query("SELECT title, id FROM role;", function (err, res) {

        let nameArrays = empNameAndIdArrays(err, res, "role");

        inquirer
            .prompt({
                name: "findThisName",
                type: "list",
                message: "Select role to remove:",
                choices: nameArrays[1]
            })
            .then(function (answer) {

                connection.query("DELETE from role where id = ?;", [findId(answer, nameArrays)], function (err, res) {
                    if (err) throw err;
                    clear();
                    let success = chalk.greenBright(`You've succesfully removed ${answer.findThisName}.`)
                    console.log(success)

                    initialQuestions();
                })
            })

    })
}
//Remove department
function removeDepartment() {
    clear();
    connection.query("SELECT name, id FROM department;", function (err, res) {

        let nameArrays = empNameAndIdArrays(err, res, "department");
        inquirer
            .prompt({
                name: "findThisName",
                type: "list",
                message: "Select department to remove:",
                choices: nameArrays[1]
            })
            .then(function (answer) {

                connection.query("DELETE from department where id = ?;", [findId(answer, nameArrays)], function (err, res) {
                    if (err) throw err;
                    clear();
                    let success = chalk.greenBright(`You've succesfully removed ${answer.findThisName}.`)
                    console.log(success)

                    initialQuestions();
                })
            })
    })
}
//Renders all departments onto a table
function viewDepartments() {
    connection.query("SELECT name FROM department;", function (err, res) {
        renderTable2(err, res, "Department Name", "name");
    })
}
//Renders all roles onto a table
function viewRoles() {
    connection.query("SELECT title FROM role;", function (err, res) {
        renderTable2(err, res, "Role Title", "title");
    })
}
//Function called to render all Employees as well as Employees by manager and department.
function renderTable(err, res) {
    if (err) throw err;
    clear();

    let table = new Table({
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        }
    });

    let tableHeaders = [chalk.blueBright.bold("ID"), chalk.blueBright.bold("First Name"), chalk.blueBright.bold("Last Name"), chalk.blueBright.bold("Title"), chalk.blueBright.bold("Department"), chalk.blueBright.bold("Salary"), chalk.blueBright.bold("Manager")];
    table.push(tableHeaders);

    res.forEach((value, i) => {table.push([res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].name, res[i].salary, res[i].manager_first_name + " " + res[i].manager_last_name])});

    let finalTable = table.toString();
    console.log(finalTable);

    initialQuestions();
}
//Function called to render Departments, Roles, and Labor Cost tables
function renderTable2(err, res, headerTitle, name, answer) {
    clear();
    if (err) throw err;

    var table = new Table({
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        }
    });

    let tableHeaders = [chalk.magenta.bold(headerTitle)];
    table.push(tableHeaders);

    if (name === "name") {
        res.forEach((value, i) => {let finalName = res[i].name; table.push([finalName])});
    }

    else if (name === "title") {
        res.forEach((value, i) => {let finalName = res[i].title; table.push([finalName])});
    }

    else if (name === "cost") {
        table.shift();
        let tableHeaders2 = [chalk.magenta.bold(headerTitle), chalk.magenta.bold("Total Labor Cost")];
        table.push(tableHeaders2);
        table.push([answer.deptName, res[0].sum_salary]);
    }

    let finalTable = table.toString();
    console.log(finalTable);

    initialQuestions();
}
//empNameAndIdArrays declares two arrays, one for names (or titles) and the other for ID's. The user selects from names, but the queries utilize the appropriate IDs.
function empNameAndIdArrays(err, res, nameType, needEmpty) {
    if (err) throw err;
    let empIdArray = [];
    let empNamesArray = [];

    if (needEmpty === "yes") {
        empIdArray.push("NULL")
        empNamesArray.push("none");
        res.forEach((value, i) => {empNamesArray.push(res[i].first_name + " " + res[i].last_name); empIdArray.push(res[i].id);});
        }
    if (nameType === "manager") {
        res.forEach((value, i) => {if (res[i].manager_first_name != null) 
            {empNamesArray.push(res[i].manager_first_name + " " + res[i].manager_last_name); empIdArray.push(res[i].id);}});
    }
    if (nameType === "department") {
        res.forEach((value, i) => {empNamesArray.push(res[i].name); empIdArray.push(res[i].id);});
    }
    if (nameType === "role") {
        res.forEach((value, i) => {empNamesArray.push(res[i].title); empIdArray.push(res[i].id);});
    }
    if (nameType === "employee") {
        res.forEach((value, i) => {empNamesArray.push(res[i].first_name + " " + res[i].last_name); empIdArray.push(res[i].id);});
    }
    return empArrays = [empIdArray, empNamesArray];
}
//Using the Name and ID arrays, findId compares the user-response to the Name array and returns the ID located in the same position in the ID array.
let findId = (answer, nameArrays) => {nameArrays[1].forEach((value, i) => {if (answer.findThisName === value) {useThisId = nameArrays[0][i];}});
      return useThisId;   
}