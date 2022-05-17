var startServer = require('./index');

/*
 * Start the PostgreSQL server
 * @param {String} dataDir Directory will be initialized if does not exist
 * @param {Object} config  Settings for postgresql.conf
 */
var postgres = startServer('dbdata', { port: 12345 });

postgres.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

postgres.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

postgres.on('close', function (code) {
  console.log('child process exited with code ' + code);
});