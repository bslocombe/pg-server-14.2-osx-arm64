var fs = require('fs');
var path = require('path');
var spawnSync = require('spawn-sync');
var spawn = require('child_process').spawn;
var extend = require('extend');

var defaultConfig = {
  port: 5432
}

/*
 * Start the PostgreSQL server
 * @param {String} dataDir Directory will be initialized if does not exist
 * @param {Object} config  Settings for postgresql.conf
 * @return {ChildProcess} postgres server instance
 */
module.exports = function(dataDir, config) {
  var fullConfig = extend(defaultConfig, config || {});
  console.log(dataDir, fullConfig, '++++++++++++++++++++++++')

  try {
    var dataDirStat = fs.statSync(dataDir);
  } catch(err) {
    // Data directory does not exist
    var initResult1 = spawnSync('brew', ['install postgresql@14'])
    var initResult = spawnSync(
      // path.join(__dirname, 'server/bin/initdb'),
      'initdb',
      [ '-D', dataDir, '--username=postgres' ]);
      if (initResult.status !== 0) {
        process.stderr.write(initResult.stderr);
        process.exit(initResult.status);
      } else {
        process.stdout.write(initResult.stdout);
        process.stderr.write(initResult.stderr);
      }
  }

  if(dataDirStat && !dataDirStat.isDirectory()) {
    throw new Error('DATA_DIRECTORY_UNAVAILABLE');
  }

  // Generate postgresql.conf from provided configuration
  var conf = Object.keys(fullConfig).map(function(key) {
      if(fullConfig[key] === null) {
        return ''
      } else {
        return key + ' = ' + fullConfig[key]
      }
    }).join('\n');

  console.log(fs.statSync(dataDir))
  
  fs.writeFileSync(path.join(dataDir, 'postgresql.conf'), conf);


  var child = spawn(
    path.join(__dirname, 'server/bin/postgres'), [ '-D', dataDir ]);

    var child = spawn(
      'postgres', [ '-D', dataDir ]);
  
  return child
}

// Provide package directory for external use
module.exports.pkgdir = function() {
  return __dirname
}
