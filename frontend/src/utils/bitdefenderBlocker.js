/**
 * This file contains utilities to block BitDefender and other security extension scripts
 * that can cause hydration mismatches in React applications
 */

// BitDefender extension ID
const BITDEFENDER_EXTENSION_ID = "eppiocemhmnlbhjplcgkofciiegomcon";

/**
 * Blocks BitDefender scripts from loading
 * This should be included as a plain script tag in _document.tsx or layout.tsx
 */
export function getBlockerScript() {
  return `
    (function() {
      // Remove any BitDefender scripts that are already in the document
      function removeExistingScripts() {
        const scripts = document.querySelectorAll('script[src*="${BITDEFENDER_EXTENSION_ID}"], script[data-bis-config]');
        scripts.forEach(script => script.remove());
      }
      
      // Block script injection by overriding appendChild
      const originalAppendChild = Node.prototype.appendChild;
      Node.prototype.appendChild = function(node) {
        if (node.nodeName === 'SCRIPT' && 
           (node.src?.includes('${BITDEFENDER_EXTENSION_ID}') || 
            node.hasAttribute('data-bis-config'))) {
          console.warn('Blocked BitDefender script injection');
          return node; // Return node without appending
        }
        return originalAppendChild.call(this, node);
      };
      
      // Block script injection by overriding insertBefore
      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function(newNode, referenceNode) {
        if (newNode.nodeName === 'SCRIPT' && 
           (newNode.src?.includes('${BITDEFENDER_EXTENSION_ID}') || 
            newNode.hasAttribute('data-bis-config'))) {
          console.warn('Blocked BitDefender script insertion');
          return newNode; // Return node without inserting
        }
        return originalInsertBefore.call(this, newNode, referenceNode);
      };
      
      // Block setAttribute for scripts
      const originalSetAttribute = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function(name, value) {
        if (this.nodeName === 'SCRIPT' && 
           ((name === 'src' && value?.includes('${BITDEFENDER_EXTENSION_ID}')) || 
             name === 'data-bis-config')) {
          console.warn('Blocked BitDefender attribute setting');
          return; // Don't set the attribute
        }
        return originalSetAttribute.call(this, name, value);
      };
      
      // Set up a MutationObserver to watch for script additions
      const observer = new MutationObserver(function(mutations) {
        let needsCleaning = false;
        
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeName === 'SCRIPT' && 
                 (node.src?.includes('${BITDEFENDER_EXTENSION_ID}') || 
                  node.getAttribute('data-bis-config'))) {
                node.remove();
                needsCleaning = true;
              }
            });
          }
        });
        
        if (needsCleaning) {
          removeExistingScripts();
        }
      });
      
      // Initial cleanup
      removeExistingScripts();
      
      // Start observing
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      
      // Also periodically clean just to be sure
      setInterval(removeExistingScripts, 100);
      
      // Suppress hydration warnings
      if (typeof console !== 'undefined' && console.error) {
        const originalConsoleError = console.error;
        console.error = function(...args) {
          const message = args[0] && typeof args[0] === 'string' ? args[0] : '';
          if (message.includes('Hydration failed') || 
              message.includes('hydrated but some attributes') ||
              message.includes('bis_') ||
              message.includes('extension') ||
              message.includes('traffic.js')) {
            // Ignore hydration errors from extensions
            return;
          }
          return originalConsoleError.apply(this, args);
        };
      }
    })();
  `;
}

/**
 * Creates a CSP (Content Security Policy) that blocks BitDefender scripts
 */
export function getBitDefenderBlockingCSP() {
  return `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${getBlockedDomains()}; object-src 'none'; frame-ancestors 'self'`;
}

/**
 * Returns a list of domains to block
 */
function getBlockedDomains() {
  return `'nonce-blockedext' chrome-extension://${BITDEFENDER_EXTENSION_ID}`;
}
