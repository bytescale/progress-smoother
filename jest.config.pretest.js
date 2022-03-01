global.console = {
  log: msg => {
    process.stdout.write(msg.toString());
    process.stdout.write("\n");
  },

  // Keep native behaviour for other methods, use those to print out things in your own tests, not `console.log`
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
};
