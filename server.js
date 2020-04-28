const openingGraphics = require('./lib/openingGraphics');
var mysql = require("mysql");
var inquirer = require("inquirer");
const clear = require('clear');
const Table = require('cli-table');
const chalk = require('chalk');
const joi = require("joi");

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

        else if (answer.initialChoice === "See total labor cost by department.")  {
            laborCost();
        }

        else if (answer.initialChoice === "Add a new role.")  {
            addRole();
        }

        else if (answer.initialChoice === "Add a new department.")  {
            addDepartment();
        }

        else if (answer.initialChoice === "Remove a role.")  {
            removeRole();
        }
     
        else if (answer.initialChoice === "Remove a department.")  {
            removeDepartment();
        }

        else if (answer.initialChoice === "View all departments.")  {
            viewDepartments();
        }

        else if (answer.initialChoice === "View all roles.")  {
            viewRoles();
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
          
          let tableHeaders = [chalk.blueBright.bold("ID"), chalk.blueBright.bold("First Name"), chalk.blueBright.bold("Last Name"), chalk.blueBright.bold("Title"), chalk.blueBright.bold("Department"), chalk.blueBright.bold("Salary"), chalk.blueBright.bold("Manager")];
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

    connection.query("SELECT name FROM department;", function (err, res) {

        if (err) throw err;
      
        let departmentArray = [];

          for (var i = 0; i < res.length; i++) {
          
            departmentArray.push(res[i].name);
            
        }
      
        inquirer
        .prompt({
            name: "deptName",
            type: "list",
            message: "Ok, which department?",
            choices: departmentArray
            
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
          
          let tableHeaders = [chalk.blueBright.bold("ID"), chalk.blueBright.bold("First Name"), chalk.blueBright.bold("Last Name"), chalk.blueBright.bold("Title"), chalk.blueBright.bold("Department"), chalk.blueBright.bold("Salary"), chalk.blueBright.bold("Manager")];
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
          
          let tableHeaders = [chalk.blueBright.bold("ID"), chalk.blueBright.bold("First Name"), chalk.blueBright.bold("Last Name"), chalk.blueBright.bold("Title"), chalk.blueBright.bold("Department"), chalk.blueBright.bold("Salary"), chalk.blueBright.bold("Manager")];
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
        let managerIdArray = ["NULL"];
        let managerNamesArray = ["None"];
        
          for (var i = 0; i < res.length; i++) {
       
            managerNamesArray.push(res[i].first_name + " " + res[i].last_name);
            managerIdArray.push(res[i].id);
    
        }
    
    connection.query("SELECT title, id FROM role;", function (err, res) {

            if (err) throw err;
          
            let roleArray = [];
            let roleIdArray = [];
    
              for (var i = 0; i < res.length; i++) {
              
                roleArray.push(res[i].title);
                roleIdArray.push(res[i].id);
                
            }
    inquirer
    .prompt([{
        name: "empName",
        type: "text",
        message: "Enter employee's first name:", 
        validate: validateString   
    },
    {
        name: "empLastName",
        type: "text",
        message: "Enter employee's last name:",
        validate: validateString    
    },
    {
        name: "empTitle",
        type: "list",
        message: "What is the employee's title?",
        choices: roleArray 
    },
    {
        name: "empManager",
        type: "list",
        message: "Who is the employee's Manager?",
        choices: managerNamesArray
    }])
    .then(function(answer){

    
        for (var i = 0; i < roleArray.length; i++){
            if (answer.empTitle === roleArray[i]) {
              roleId = roleIdArray[i];   
            }         
        }

        for (var i = 0; i < managerNamesArray.length; i++){
            if (answer.empManager === managerNamesArray[i]) {
               newManagerId = managerIdArray[i];   

            }
           
        }
        if(newManagerId === "NULL"){
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
     
    connection.query("SELECT title, id FROM role;", function (err, res) {

        if (err) throw err;
      
        let roleArray = [];
        let roleIdArray = [];

          for (var i = 0; i < res.length; i++) {
          
            roleArray.push(res[i].title);
            roleIdArray.push(res[i].id);
            
        }
        inquirer
        .prompt({
            name: "roleName",
            type: "list",
            message: "Ok, which role?",
            choices: roleArray
            
        })  

    .then(function(answer){
        for (var i = 0; i < roleArray.length; i++){
            if (answer.roleName === roleArray[i]) {
              roleId = roleIdArray[i];   
            }         
        }
    
        connection.query("UPDATE employee set role_id = ? where id = ?;", [roleId, updateThisId], function (err, res) {
            if (err) throw err;
            clear();
            let success = chalk.greenBright(`You've succesfully updated ${selectedEmpName}'s role to ${answer.roleName}.`)
            console.log(success)

            initialQuestions();
        })
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
        let managerIdArray = ["NULL"];
        let managerNamesArray = ["None"];
        let setThisManagerId = 0;
        
          for (var i = 0; i < res.length; i++) {
       
            empNamesArray.push(res[i].first_name + " " + res[i].last_name);
            empIdArray.push(res[i].id);
            managerNamesArray.push(res[i].first_name + " " + res[i].last_name);
            managerIdArray.push(res[i].id);
    
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
        choices: managerNamesArray
    })
    .then(function(answer){
        for (var i = 0; i < managerNamesArray.length; i++){
            if (answer.newEmpManager === managerNamesArray[i]) {
               setThisManagerId = managerIdArray[i];   
            }         
        }
    if(setThisManagerId === "NULL"){
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
            let success = chalk.greenBright(`You've succesfully updated ${selectedEmpName}'s manager to ${answer.newEmpManager}.`)
            console.log(success)

            initialQuestions();
        })
    }
    })
})
})
}

function laborCost() {

    clear();

    connection.query("SELECT name FROM department;", function (err, res) {

        if (err) throw err;
      
        let departmentArray = [];

          for (var i = 0; i < res.length; i++) {
          
            departmentArray.push(res[i].name);
            
        }
       
        inquirer
        .prompt({
            name: "deptName",
            type: "list",
            message: "Ok, which department?",
            choices: departmentArray
            
        })  


    .then(function (answer) {

    
    connection.query("SELECT sum(salary) AS ? FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m on e.manager_id = m.id where name = ? ;", ["sum_salary", answer.deptName], function (err, res) {

        if (err) throw err;
        clear(); 

        var table = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                   , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                   , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                   , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
          });
          
          let tableHeaders = [chalk.magenta.bold("Department"), chalk.magenta.bold("Total Labor Cost")];
          table.push(tableHeaders);

        
        table.push([answer.deptName, res[0].sum_salary]);
            
        
          let totalSum = table.toString();
           console.log("");
          console.log(totalSum);

          initialQuestions();
        
    })
})

})

}

function addRole() {
    clear();
    connection.query("SELECT name, id FROM department;", function (err, res) {

        if (err) throw err;
      
        let departmentArray = [];
        let departmentIdArray = [];
        

          for (var i = 0; i < res.length; i++) {
          
            departmentArray.push(res[i].name);
            departmentIdArray.push(res[i].id);
        }
      
        inquirer
        .prompt([{
            name: "roleName",
            type: "text",
            message: "Enter Title for the new role:",
            validate: validateString 
        },
        {
            name: "roleSalary",
            type: "input",
            message: "Enter Salary for the new role:", 
            validate: validateNumber
        },
        {
            name: "deptName",
            type: "list",
            message: "Which department does this role belong to?",
            choices: departmentArray    
        },
    ])
    .then(function (answer) {
        let selectedDepartment = answer.deptName;
        for (var i = 0; i < departmentArray.length; i++){
            if (answer.deptName === departmentArray[i]) {
               updateThisDepartmentId = departmentIdArray[i];   
            }         
        }
      
    connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);", [answer.roleName, answer.roleSalary, updateThisDepartmentId], function (err, res) {

        if (err) throw err;

        clear();
        let success = chalk.greenBright(`You've succesfully added ${answer.roleName}.`)
        console.log(success)

        initialQuestions();
      
      
}) //insert into role query
    }) // .then
    }) //main query
} //main function

function addDepartment() {
    clear();
  
        inquirer
        .prompt({
            name: "departmentName",
            type: "text",
            message: "Enter Department name:", 
            validate: validateString
        })
    .then(function (answer) {
        let selectedDepartment = answer.departmentName;
  
      
    connection.query("INSERT INTO department (name) VALUES (?);", [answer.departmentName], function (err, res) {

        if (err) throw err;

        clear();
        let success = chalk.greenBright(`You've succesfully added ${selectedDepartment}.`)
        console.log(success)

        initialQuestions();
      
      
}) //insert into role query
    }) // .then
   
} //main function

function removeRole() {
    clear();
    connection.query("SELECT title, id FROM role;", function (err, res) {

        if (err) throw err;
        let roleIdArray = [];
        let roleNamesArray = [];
        
          for (var i = 0; i < res.length; i++) {
       
            roleNamesArray.push(res[i].title);
            roleIdArray.push(res[i].id);
    
        }
    inquirer
    .prompt({
        name: "removeThisRole",
        type: "list",
        message: "Select role to remove:",
        choices: roleNamesArray
    })
    .then(function(answer){

        for (var i = 0; i < roleNamesArray.length; i++){
            if (answer.removeThisRole === roleNamesArray[i]) {
               removeThisId = roleIdArray[i];   
            }         
        }
        connection.query("DELETE from role where id = ?;", [removeThisId], function (err, res) {
            if (err) throw err;
            clear();
            let success = chalk.greenBright(`You've succesfully removed ${answer.removeThisRole}.`)
            console.log(success)

            initialQuestions();
        })
    })
    
})
}

function removeDepartment() {
    clear();
    connection.query("SELECT name, id FROM department;", function (err, res) {

        if (err) throw err;
        let departmentIdArray = [];
        let departmentNamesArray = [];
        
          for (var i = 0; i < res.length; i++) {
       
            departmentNamesArray.push(res[i].name);
            departmentIdArray.push(res[i].id);
    
        }
    inquirer
    .prompt({
        name: "removeThisDepartment",
        type: "list",
        message: "Select department to remove:",
        choices: departmentNamesArray
    })
    .then(function(answer){

        for (var i = 0; i < departmentNamesArray.length; i++){
            if (answer.removeThisDepartment === departmentNamesArray[i]) {
               removeThisId = departmentIdArray[i];   
            }         
        }
        connection.query("DELETE from department where id = ?;", [removeThisId], function (err, res) {
            if (err) throw err;
            clear();
            let success = chalk.greenBright(`You've succesfully removed ${answer.removeThisDepartment}.`)
            console.log(success)

            initialQuestions();
        })
    })
    
})
}

function viewDepartments() {
    clear(); 
    
    connection.query("SELECT name FROM department;", function (err, res) {

        if (err) throw err;
       

        var table = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                   , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                   , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                   , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
          });
          
          let tableHeaders = [chalk.magenta.bold("Department Name")];
          table.push(tableHeaders);

          for (var i = 0; i < res.length; i++) {
            table.push([res[i].name]);
            }
        
          let finalTable = table.toString();
           console.log("");
          console.log(finalTable);
          
          initialQuestions();
        
    })
}

function viewRoles() {
    clear(); 
    
    connection.query("SELECT title FROM role;", function (err, res) {

        if (err) throw err;
       

        var table = new Table({
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                   , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                   , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                   , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
          });
          
          let tableHeaders = [chalk.magenta.bold("Role Title")];
          table.push(tableHeaders);

          for (var i = 0; i < res.length; i++) {
            table.push([res[i].title]);
            }
        
          let finalTable = table.toString();
           console.log("");
          console.log(finalTable);
          
          initialQuestions();
        
    })

  
}

function validateNumber(name) {
    let schema = joi.number().required();
    return joi.validate(name, schema, onValidation);
 }
 
 
 function onValidation(err, val){
     if(err) {
         return err.message;
     }
     else {
         return true;
     }
 }
 
 function validateString(name) {
     var schema = joi.string().required();
     return joi.validate(name, schema, onValidation);
 }