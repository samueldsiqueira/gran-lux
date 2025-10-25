// Suppress React DevTools semver warning - AGGRESSIVE MODE
(function() {
  'use strict';
  
  // Intercept as early as possible
  if (typeof window !== 'undefined') {
    // Save original Error
    const OriginalError = window.Error;
    
    // Override Error constructor to filter React DevTools errors
    window.Error = function(message) {
      if (typeof message === 'string' && (
        message.includes('not valid semver') ||
        message.includes('validateAndParse') ||
        message.includes('react_devtools')
      )) {
        // Return a silent error
        const err = new OriginalError('');
        err.stack = '';
        return err;
      }
      return new OriginalError(message);
    };
    
    // Preserve prototype
    window.Error.prototype = OriginalError.prototype;
    
    // Save original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Filter function
    const shouldSuppress = (args) => {
      const message = String(args[0] || '');
      return message.includes('not valid semver') || 
             message.includes('react_devtools_backend') ||
             message.includes('validateAndParse') ||
             message.includes('Invalid argument');
    };
    
    // Override console.error
    console.error = function(...args) {
      if (shouldSuppress(args)) return;
      originalError.apply(console, args);
    };
    
    // Override console.warn
    console.warn = function(...args) {
      if (shouldSuppress(args)) return;
      originalWarn.apply(console, args);
    };
    
    // Suppress unhandled errors
    window.addEventListener('error', function(event) {
      if (event.message && (
        event.message.includes('not valid semver') ||
        event.message.includes('react_devtools')
      )) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }, true);
    
    // Suppress unhandled rejections
    window.addEventListener('unhandledrejection', function(event) {
      const reason = String(event.reason || '');
      if (reason.includes('not valid semver') || reason.includes('react_devtools')) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }, true);
    
    // Try to prevent React DevTools from loading at all
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      try {
        // Monkey patch the hook to prevent version checking
        const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (hook.checkDCE) {
          const originalCheckDCE = hook.checkDCE;
          hook.checkDCE = function() {
            try {
              return originalCheckDCE.apply(this, arguments);
            } catch (e) {
              // Silently catch all errors from DevTools
              return true;
            }
          };
        }
      } catch (e) {
        // Ignore
      }
    }
  }
})();
