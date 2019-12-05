const envfile = require('envfile');
const chalk = require('chalk');
const inquirer = require('inquirer');

const questions = [{
    type: 'input',
    name: 'mainEnvPath',
    message: 'Input your main env path',
    default: '.env',
}, {
    type: 'input',
    name: 'comparingEnvPath',
    message: 'Input your comparing env path',
    default: '.env.dev',
}];

inquirer.prompt(questions).then(answers => {
    console.log('\n');

    const mainEnvPath = answers['mainEnvPath'];
    const comparingEnvPath = answers['comparingEnvPath'];

    const mainEnv = envfile.parseFileSync(mainEnvPath);
    const comparingEnv = envfile.parseFileSync(comparingEnvPath);

    let missingEnvironmentVariables = [];
    let differentEnvironmentVariables = [];

    for (let key in comparingEnv) {
        const comparingValue = comparingEnv[key];
        const mainValue = mainEnv[key];
        if (mainValue === undefined) {
            missingEnvironmentVariables.push(`${key}=${comparingValue}`);
        } else if (mainValue !== comparingValue) {
            differentEnvironmentVariables.push({
                key,
                main: mainValue,
                comparing: comparingValue,
            });
        }
    }

    console.log(
        chalk.yellow(`Variables that's missing from ${mainEnvPath} but exists on ${comparingEnvPath}:`),
        chalk.red(missingEnvironmentVariables.reduce((accumulator, currentValue) => (`${accumulator}\n${currentValue}`), '')),
    );
    console.log('\n');

    console.log(
        chalk.yellow(`Variables that's different from ${mainEnvPath} and ${comparingEnvPath}:`),
        differentEnvironmentVariables.reduce((accumulator, currentValue) => {
            const main = chalk.green(`${currentValue.main} (${mainEnvPath})`);
            const comparing = chalk.blue(`${currentValue.comparing} (${comparingEnvPath})`);
            return `${accumulator}\n${currentValue.key}\n${main}\n${comparing}\n`
        }, ''),
    );
});
