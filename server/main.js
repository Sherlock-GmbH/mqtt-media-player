// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';

// general Error Handler
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err)
})
