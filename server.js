const openingGraphics = require('./lib/openingGraphics');
var mysql = require("mysql");
var inquirer = require("inquirer");
const clear = require('clear');


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

    clear(); 
    connection.query("SELECT * FROM employeesDB.employee", function (err, res) {

        if (err) throw err;
        console.log(res)
    });

    initialQuestions();
}
