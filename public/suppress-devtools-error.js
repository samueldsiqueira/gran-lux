// Suppress React DevTools semver warning
(function() {
  'use strict';
  
  // Save original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Filter function to check if message should be suppressed
  const shouldSuppress = (message) => {
    if (typeof message === 'string') {
      return message.includes('not valid semver') || 
             message.includes('react_devtools_backend') ||
             message.includes('validateAndParse');
    }
    return false;
  };
  
  // Override console.error
  console.error = function(...args) {
    if (args.length > 0 && shouldSuppress(args[0])) {
      return; // Suppress this error
    }
    originalError.apply(console, args);
  };
  
  // Override console.warn
  console.warn = function(...args) {
    if (args.length > 0 && shouldSuppress(args[0])) {
      return; // Suppress this warning
    }
    originalWarn.apply(console, args);
  };
  
  // Suppress unhandled rejection for this specific error
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && shouldSuppress(String(event.reason))) {
      event.preventDefault();
    }
  });
})();
