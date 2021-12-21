import fs from 'fs';

const sortTask = (data) => {
    const text = data.toString().split("\r\n");
    let filterData = text.filter(function (value) {
        return value !== ''; 
      });
    let obj = {};
    filterData.forEach((task) => {
        const i = task.split(' ');
        obj[i[0]] = i[1];
    });
    Object.keys(obj).sort();
    return obj;
}

const ls =(path) => {
    const data = fs.readFileSync(path);
    const sortedData = sortTask(data);
    let index =0;
    for (let [key, value] of Object.entries(sortedData)) {
        index ++;
        console.log(`${index}. ${value} [${key}]`);
    };
}

const updateComplete = (data) => {
    fs.appendFile('./completed.txt',`\r\n${data}`,err => {
        if(err) {
            console.log("Error in updating complete");
        }
    })
}

const infoTask = () => {
    console.log(`Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`);
}

const report = () => {
    let count = 0;
    let data = fs.readFileSync('./task.txt');
    count = data.toString().split("\r\n").length;
    console.log(`Pending: ${count}\n`);
    ls('./task.txt');
    data = fs.readFileSync('./completed.txt');
    count = data.toString().split("\r\n").length;
    console.log(`\nCompleted: ${count}\n`)
    ls('./completed.txt');
}

const add = (p,str) => {
    const data = fs.readFileSync('./task.txt').toString();
    fs.writeFile('./task.txt', `${p} ${str}\r\n${data}`, err => {
        if (err) {
              console.log("Error in adding")
        };
        console.log(`Added task: "${str}" with priority ${p}`); 
    });
}

const del = (index) => {
    const fileData = fs.readFileSync('./task.txt').toString(); 
    let data = fileData.split('\n');
    let filterData = data.filter(function (value) {
      return value !== ''; 
    });

    const removedData = filterData.splice(filterData.length - index, 1); 
    const newData = filterData.join('\n'); 
    fs.writeFile('task.txt',newData, err=> {
        if (err) {
            console.log("Error in deleting!");
        }
    });
    return removedData;
}

const done = (index) => {
    const data = del(index);
    data.join('');
    updateComplete(data);
    console.log('Marked item as done');
}

const main = (terminalArg) => {
    if (fs.existsSync('./task.txt') === false) {
        fs.writeFileSync("task.txt","");
    }
    if (fs.existsSync('./completed.txt') === false) {
        fs.writeFileSync('completed.txt',"");
    }
    const argv = terminalArg.slice(2);
    if(!argv[0]){
        infoTask();
    } else{
        switch(argv[0]) {
            case 'ls':
            ls('./task.txt');
            break;
            case 'help':
            infoTask();
            break;
            case 'report':
            report();
            break;
            case 'add':
                if(argv[1] && argv[2]){
                    add(argv[1],argv[2]);
                } else {
                    console.log(`Usage: 
./task add 2 "hello world"    # Add a new item with priority 2 and text "hello world" to the list`);
                }
            break;
            case 'done':
                if(argv[1]){
                    done(argv[1]);
                } else {
                    console.log(`Usage: 
./task done INDEX           # Mark the incomplete item with the given index as complete`);
                }
            break;
            case 'del':
                if(argv[1]){
                    del(argv[1]);
                    console.log(`Deleted item with index ${argv[1]}`); 
                } else {
                    console.log(`Usage: 
./task del INDEX            # Delete the incomplete item with the given index`);
                }
            break;
            default:
            console.log(`Please check the help for supported commands.`);
            infoTask();
        }
    }
}

export function cli(args) {
    main(args);
}