const openingGraphics = require('./lib/openingGraphics');
var mysql = require("mysql");
var inquirer = require("inquirer");
const clear = require('clear');
const Table = require('cli-table');
const chalk = require('chalk');


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "employeesDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    openingGraphics();
    initialQuestions();
   
});

function initialQuestions() {
    inquirer
    .prompt({
        name: "initialChoice",
        type: "list",
        message: "Select one of the following",
        choices: ["View all employees.",
            "Done"
        ]
    })
    .then(function (answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.initialChoice === "View all employees.") {
            viewAllEmp();
        }
     
        else {
            clear();
        }
    });

}

function viewAllEmp() {

    
    connection.query("SELECT e.id, e.first_name, e.last_name, title, salary, name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id;", ["manager_first_name", "manager_last_name"], function (err, res) {

        if (err) throw err;
        clear(); 

        var table = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                   , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                   , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                   , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
          });
          
          let tableHeaders = [chalk.blueBright("ID"), chalk.blueBright("First Name"), chalk.blueBright("Last Name"), chalk.blueBright("Title"), chalk.blueBright("Department"), chalk.blueBright("Salary"), chalk.blueBright("Manager")];
          table.push(tableHeaders);

          for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].name, res[i].salary, res[i].manager_first_name + " " + res[i].manager_last_name]);
            }
        
          let finalTable = table.toString();
           console.log("");
          console.log(finalTable);
          initialQuestions();
        
    })

  
}
