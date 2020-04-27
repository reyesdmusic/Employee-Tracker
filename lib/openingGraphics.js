const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const Table = require('cli-table');

function openingGraphics() {

    clear();


    var table = new Table({
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
               , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
               , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
               , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
      });
    
      let title = chalk.redBright(
        figlet.textSync('E-Tracker', { horizontalLayout: 'fitted' })
      );
    
    let subtitle = chalk.yellow("         An Employee Management Application.");
       

      table.push(
          [title]
        , [subtitle]
      );
    
      let finalTable = table.toString();
       
      console.log(finalTable);


      
}

module.exports = openingGraphics;