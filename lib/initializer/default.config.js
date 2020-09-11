module.exports = function (mode) {
  return {
    // Project settings. Command line arguments will override the settings.
    settings: {
      // Source directory. Absolute path or relative path to {cwd}.
      src: 'www',
      // Dist directory. Absolute path or relative path to {cwd}.
      dist: 'dist',
      // Development server host.
      host: '0.0.0.0',
      // Development server port.
      port: 8080,
      // Log level (log, info, warning, error).
      logLevel: 'log',
      // Disable all logs.
      quiet: false,
      // No colors for logs.
      noColors: false,
    },
    // Template global variables. Add anything you need in template here.
    templateGlobals: {
      PUBLIC_URL: '/',
      MODE: mode,
    },
    // Output filename formats, available placeholders are:
    // [name] original file name without extension.
    // [hash] file hash value string.
    // [hash:{length}] file hash value string with the length of length.
    output: {
      defaultHashLength: 7,
      less: '[name].[hash].css',
      css: '[name].[hash].css',
      js: '[name].[hash].js',
    },
    // Scan settings
    scan: {
      // Index file for server.
      index: ['index.html', 'index.htm'],
      // Regular expression for html files.
      htmlRegexp: /\.html$/i,
      // Regular expression for fragment files.
      fragmentRegexp: /\.fragment\.html$/i,
    },
    // Copy settings
    copy: {
      // Paths to ignore on copy. Relative to {src}.
      // Can be a string or a regular expression or a function that accepts
      // the relative path and returns a boolean.
      ignorePaths: [],
      // Filename (no directory prefix) to ignore recursively on copy.
      // Can be a string or a regular expression or a function that accepts
      // the relative path and returns a boolean.
      ignoreNames: ['.DS_Store', 'node_modules'],
    },
    // Clean settings
    clean: {
      // Remove files that match {fragmentRegexp}.
      removeFragments: false,
      // Paths to remove after building. Relative to {dist}.
      // Can be a string or a regular expression or a function that accepts
      // the relative path and returns a boolean.
      removePaths: [],
      // Filename (no directory prefix) to remove recursively after building.
      // Can be a string or a regular expression or a function that accepts
      // the relative path and returns a boolean.
      removeNames: [],
    },
  };
};
