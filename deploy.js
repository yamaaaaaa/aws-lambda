const fs = require('fs');
const exec = require('child_process').exec;

var functionName = '';
var path = '';

if (typeof process.argv[2] == 'undefined') {
    console.log('require argument function name');
    return;
} else {
    functionName = process.argv[2];
}

fs.exists('./' + functionName, (exists) => {
    if (!exists) {
        console.log('no passwd!');
        return;
    }

    exec('pwd', (err, stdout, stderr) => {
        if (err) {
            console.log(err);
        }else{
            path = stdout.replace('\n','');
            console.log(stdout);
        }

        exec('rm ./' + functionName + '.zip', (err, stdout, stderr) => {
            if (err) {
                console.log(err);
            }else{
                console.log('delete:'+functionName + '.zip');
            }
           
            exec('zip -r ../'+functionName+'.zip ./*', {cwd: './'+functionName}, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                }else{
                    console.log('create:'+functionName + '.zip ');
                }
                
                let cmd_upload = 'aws lambda update-function-code --function-name '+functionName+' --zip-file fileb://'+path+'/'+functionName+'.zip';
                exec(cmd_upload, (err, stdout, stderr) => {
                    if (err) {
                        console.log(err);
                    }else{
                        console.log(stdout);
                    }
                    console.log('===========================');
                    console.log('deployed!!');    
                });
            });
        });
    });
});
