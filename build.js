const { exec } = require('pkg');

const run = async () => {
    await exec([ 'index.js', '--target', 'node12', '--out-path', 'bin' ]);
};

run();
