const openingGraphics = require('./lib/openingGraphics');
var mysql = require("mysql");
var inquirer = require("inquirer");
const clear = require('clear');
const Table = require('cli-table');
const chalk = require('chalk');



var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",

    database: "employeesDB"
});


connection.connect(function (err) {
    if (err) throw err;
    openingGraphics();
    initialQuestions();
   
});

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
        "Add a new employee.",
        "Remove employee.",
        "Update employee role.",
        "Update employee manager.",
        "Done"
        ]
    })
    .then(function (answer) {

        if (answer.initialChoice === "View all employees.") {
            viewAllEmp();
        }

        else if (answer.initialChoice === "View all employees by department.")  {
            viewByDept();
        }

        else if (answer.initialChoice === "View all employees by manager.")  {
            viewByMgr();
        }

        else if (answer.initialChoice === "Add a new employee.")  {
            addEmp();
        }

        else if (answer.initialChoice === "Remove employee.")  {
            removeEmp();
        }

        else if (answer.initialChoice === "Update employee role.")  {
            updateRole();
        }

        else if (answer.initialChoice === "Update employee manager.")  {
            updateManager();
        }
     
        else {
            clear();
            connection.end()
        }
    });

}

function viewAllEmp() {
    clear(); 
    
    connection.query("SELECT e.id, e.first_name, e.last_name, title, salary, name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id;", ["manager_first_name", "manager_last_name"], function (err, res) {

        if (err) throw err;
       

        var allEmpTable = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                   , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                   , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                   , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
          });
          
          let tableHeaders = [chalk.blueBright("ID"), chalk.blueBright("First Name"), chalk.blueBright("Last Name"), chalk.blueBright("Title"), chalk.blueBright("Department"), chalk.blueBright("Salary"), chalk.blueBright("Manager")];
          allEmpTable.push(tableHeaders);

          for (var i = 0; i < res.length; i++) {
            allEmpTable.push([res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].name, res[i].salary, res[i].manager_first_name + " " + res[i].manager_last_name]);
            }
        
          let finalTable = allEmpTable.toString();
           console.log("");
          console.log(finalTable);
          
          initialQuestions();
        
    })

  
}

function viewByDept() {

    clear();

    inquirer
    .prompt({
        name: "deptName",
        type: "list",
        message: "Ok, which department?",
        choices: ["Sales",
        "Engineering",
            "Finance",
            "Legal"
        ]
    })

    .then(function (answer) {

    
    connection.query("SELECT e.id, e.first_name, e.last_name, title, salary, name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id where name = ? ;", ["manager_first_name", "manager_last_name", answer.deptName], function (err, res) {

        if (err) throw err;
        clear(); 

        var deptTable = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                   , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                   , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                   , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
          });
          
          let tableHeaders = [chalk.blueBright("ID"), chalk.blueBright("First Name"), chalk.blueBright("Last Name"), chalk.blueBright("Title"), chalk.blueBright("Department"), chalk.blueBright("Salary"), chalk.blueBright("Manager")];
          deptTable.push(tableHeaders);

          for (var i = 0; i < res.length; i++) {
            deptTable.push([res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].name, res[i].salary, res[i].manager_first_name + " " + res[i].manager_last_name]);
            }
        
          let departmentTable = deptTable.toString();
           console.log("");
          console.log(departmentTable);
          initialQuestions();
        
    })
})

}

function viewByMgr() {

    clear();

    connection.query("SELECT m.first_name AS ? , m.last_name AS ? , m.id FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id GROUP BY m.id;", ["manager_first_name", "manager_last_name"], function (err, res) {

        if (err) throw err;
      
        let managerIdArray = [];
        let managerChoicesArray = [];
          for (var i = 0; i < res.length; i++) {
              if (res[i].manager_first_name != null){
            managerChoicesArray.push(res[i].manager_first_name + " " + res[i].manager_last_name);
            managerIdArray.push(res[i].id);
            }
        }
        
        inquirer
        .prompt({
            name: "managerName",
            type: "list",
            message: "Ok, which manager?",
            choices: managerChoicesArray
            
        })
        .then(function(answer){
            for (var i = 0; i < managerChoicesArray.length; i++){
            if (answer.managerName === managerChoicesArray[i]) {
                let managerID = managerIdArray[i];
                connection.query("SELECT e.id, e.first_name, e.last_name, title, salary, name, m.first_name AS ? , m.last_name AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id where m.id = ?;", ["manager_first_name", "manager_last_name", managerID], function (err, res) {

                    if (err) throw err;
        clear(); 

        var managerTable = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                   , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                   , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                   , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
          });
          
          let tableHeaders = [chalk.blueBright("ID"), chalk.blueBright("First Name"), chalk.blueBright("Last Name"), chalk.blueBright("Title"), chalk.blueBright("Department"), chalk.blueBright("Salary"), chalk.blueBright("Manager")];
          managerTable.push(tableHeaders);

          for (var i = 0; i < res.length; i++) {
            managerTable.push([res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].name, res[i].salary, res[i].manager_first_name + " " + res[i].manager_last_name]);
            }
        
          let mgrTable = managerTable.toString();
           console.log("");
          console.log(mgrTable);
          initialQuestions();
                    
                   
                    
                })
            }
            }
        })
        
    })

}

function addEmp() {

    clear();
    connection.query("SELECT first_name, last_name, id FROM employee;", function (err, res) {

        if (err) throw err;
        let roleId = 0;
        let newManagerId = 0;
        let empIdArray = [];
        let empNamesArray = [];
        
          for (var i = 0; i < res.length; i++) {
       
            empNamesArray.push(res[i].first_name + " " + res[i].last_name);
            empIdArray.push(res[i].id);
    
        }
    inquirer
    .prompt([{
        name: "empName",
        type: "text",
        message: "Enter employee's first name:",    
    },
    {
        name: "empLastName",
        type: "text",
        message: "Enter employee's last name:",    
    },
    {
        name: "empTitle",
        type: "list",
        message: "What is the employee's title?",
        choices: ["Sales Person",
        "Sales Lead",
        "Software Engineer",
        "Lead Engineer",
        "Accountant",
        "Account Manager",
        "Junior Legal",
        "Legal Team Lead"
        ]   
    },
    {
        name: "empManager",
        type: "list",
        message: "Who is the employee's Manager?",
        choices: empNamesArray
    }])
    .then(function(answer){

        for (var i = 0; i < empNamesArray.length; i++){
            if (answer.empManager === empNamesArray[i]) {
               newManagerId = empIdArray[i];   

            }
           
        }
     

        if (answer.empTitle === "Sales Person") {
            roleId = 1;
        }

        else if (answer.empTitle === "Sales Lead") {
            roleId = 2;
        }

        else if (answer.empTitle === "Software Engineer") {
            roleId = 3;
        }

        else if (answer.empTitle === "Lead Engineer") {
            roleId = 4;
        }

        else if (answer.empTitle === "Accountant") {
            roleId = 5;
        }

        else if (answer.empTitle === "Account Manager") {
            roleId = 6;
        }

        else if (answer.empTitle === "Junior Legal") {
            roleId = 7;
        }

        else if (answer.empTitle === "Legal Team Lead") {
            roleId = 8;
        }
   
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [answer.empName, answer.empLastName, roleId, newManagerId], function (err, res) {
            if (err) throw err;
            clear();
            let success = chalk.greenBright(`You've succesfully added ${answer.empName} ${answer.empLastName}.`)
            console.log(success)

            initialQuestions();
        })              
    })
})
}

function removeEmp() {
    clear();
    connection.query("SELECT first_name, last_name, id FROM employee;", function (err, res) {

        if (err) throw err;
        let empIdArray = [];
        let empNamesArray = [];
        
          for (var i = 0; i < res.length; i++) {
       
            empNamesArray.push(res[i].first_name + " " + res[i].last_name);
            empIdArray.push(res[i].id);
    
        }
    inquirer
    .prompt({
        name: "removeThisEmp",
        type: "list",
        message: "Select employee to remove:",
        choices: empNamesArray
    })
    .then(function(answer){

        for (var i = 0; i < empNamesArray.length; i++){
            if (answer.removeThisEmp === empNamesArray[i]) {
               removeThisId = empIdArray[i];   
            }         
        }
        connection.query("DELETE from employee where id = ?;", [removeThisId], function (err, res) {
            if (err) throw err;
            clear();
            let success = chalk.greenBright(`You've succesfully removed ${answer.removeThisEmp}.`)
            console.log(success)

            initialQuestions();
        })
    })
    
})
}

function updateRole() {
    clear(); 
    connection.query("SELECT first_name, last_name, id FROM employee;", function (err, res) {

        if (err) throw err;
        let empIdArray = [];
        let empNamesArray = [];
        
          for (var i = 0; i < res.length; i++) {
       
            empNamesArray.push(res[i].first_name + " " + res[i].last_name);
            empIdArray.push(res[i].id);
    
        }
    inquirer
    .prompt({
        name: "updateThisEmp",
        type: "list",
        message: "Select employee to update:",
        choices: empNamesArray
    })
    .then(function(answer){
        let selectedEmpName = answer.updateThisEmp;
        for (var i = 0; i < empNamesArray.length; i++){
            if (answer.updateThisEmp === empNamesArray[i]) {
               updateThisId = empIdArray[i];   
            }         
        }
        inquirer
    .prompt({
        name: "empTitle",
        type: "list",
        message: "What is the employee's title?",
        choices: ["Sales Person",
        "Sales Lead",
        "Software Engineer",
        "Lead Engineer",
        "Accountant",
        "Account Manager",
        "Junior Legal",
        "Legal Team Lead"
        ]  
    })
    .then(function(answer){

    if (answer.empTitle === "Sales Person") {
        roleId = 1;
    }

    else if (answer.empTitle === "Sales Lead") {
        roleId = 2;
    }

    else if (answer.empTitle === "Software Engineer") {
        roleId = 3;
    }

    else if (answer.empTitle === "Lead Engineer") {
        roleId = 4;
    }

    else if (answer.empTitle === "Accountant") {
        roleId = 5;
    }

    else if (answer.empTitle === "Account Manager") {
        roleId = 6;
    }

    else if (answer.empTitle === "Junior Legal") {
        roleId = 7;
    }

    else if (answer.empTitle === "Legal Team Lead") {
        roleId = 8;
    }
        connection.query("UPDATE employee set role_id = ? where id = ?;", [roleId, updateThisId], function (err, res) {
            if (err) throw err;
            clear();
            let success = chalk.greenBright(`You've succesfully updated ${selectedEmpName}'s role to ${answer.empTitle}.`)
            console.log(success)

            initialQuestions();
        })
    })
})
})
}

function updateManager() {
    clear(); 
    connection.query("SELECT first_name, last_name, id FROM employee;", function (err, res) {

        if (err) throw err;
        let empIdArray = [];
        let empNamesArray = [];
        let setThisManagerId = 0;
        
          for (var i = 0; i < res.length; i++) {
       
            empNamesArray.push(res[i].first_name + " " + res[i].last_name);
            empIdArray.push(res[i].id);
    
        }
    inquirer
    .prompt({
        name: "updateThisEmp",
        type: "list",
        message: "Select employee to update:",
        choices: empNamesArray
    })
    .then(function(answer){
        let selectedEmpName = answer.updateThisEmp;
        for (var i = 0; i < empNamesArray.length; i++){
            if (answer.updateThisEmp === empNamesArray[i]) {
               updateThisId = empIdArray[i];   
            }         
        }
        inquirer
    .prompt({
        name: "newEmpManager",
        type: "list",
        message: "Who is the new manager?",
        choices: empNamesArray
    })
    .then(function(answer){
        for (var i = 0; i < empNamesArray.length; i++){
            if (answer.newEmpManager === empNamesArray[i]) {
               setThisManagerId = empIdArray[i];   
            }         
        }
    
        connection.query("UPDATE employee set manager_id = ? where id = ?;", [setThisManagerId, updateThisId], function (err, res) {
            if (err) throw err;
            clear();
            let success = chalk.greenBright(`You've succesfully updated ${selectedEmpName}'s manager to ${answer.newEmpManager}.`)
            console.log(success)

            initialQuestions();
        })
    })
})
})
}
