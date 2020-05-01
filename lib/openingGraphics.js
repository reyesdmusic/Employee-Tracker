const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet'); //npm library used to render text into graphic
const Table = require('cli-table');

function openingGraphics() {

    clear();

    var table = new Table({
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
               , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
               , 'left': '║' , 'left-mid': '║' , 'mid': ' ' , 'mid-mid': ''
               , 'right': '║' , 'right-mid': '║' , 'middle': '' }
      });
    
      let title1 = chalk.magenta.bold(
        figlet.textSync('Employee', { font: 'colossal', horizontalLayout: 'fitted' })
      );

      let title2 = chalk.magenta.bold(
        figlet.textSync('     Tracker', { font: 'colossal', horizontalLayout: 'fitted' })
      );
    
    let subtitle = chalk.blueBright.bold.italic("           ================ An Employee Management Application ================");
       
      table.push(
          [title1]
        , [title2]
        , [subtitle]
      );
    
      let finalTable = table.toString();
       
      console.log(finalTable);
      
}

module.exports = openingGraphics;