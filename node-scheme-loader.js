// Custom loader to handle node: scheme imports
module.exports = function(source) {
  return source;
};

module.exports.getSchemaHandlers = function() {
  return {
    'node:': function(url, options, callback) {
      const mod = url.replace('node:', '');
      // Return empty module for Node.js built-in modules
      callback(null, {
        source: 'module.exports = {};',
        map: null,
        meta: {}
      });
    }
  };
};