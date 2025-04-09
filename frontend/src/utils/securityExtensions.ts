/**
 * Utilities for handling security browser extensions that interfere with web requests
 */

// BitDefender extension ID
const BITDEFENDER_EXTENSION_ID = 'eppiocemhmnlbhjplcgkofciiegomcon';

/**
 * Detects if BitDefender or similar security extensions are active
 */
export const detectSecurityExtensions = (): { 
  hasBitDefender: boolean;
  hasAnySecurityExtension: boolean;
} => {
  // Check for BitDefender specific markers
  const hasBitDefender = Boolean(
    // Check for BitDefender extension ID in HTML
    document.documentElement.outerHTML.includes(BITDEFENDER_EXTENSION_ID) || 
    // Check for BitDefender attributes in DOM
    document.documentElement.outerHTML.includes('bis_skin_checked') ||
    document.documentElement.outerHTML.includes('bis_register')
  );

  // Detect any security extension that might inject attributes
  const hasAnySecurityExtension = hasBitDefender || 
    document.documentElement.outerHTML.includes('__processed_') ||
    document.documentElement.getAttribute('__processed') !== null;

  return {
    hasBitDefender,
    hasAnySecurityExtension
  };
};

/**
 * Creates a fetch-like function that uses XMLHttpRequest to bypass security extensions
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns Promise that resolves with the response data
 */
export const bypassFetch = <T>(
  url: string, 
  options: {
    method?: string;
    body?: FormData | string;
    headers?: Record<string, string>;
  } = {}
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const method = options.method || 'GET';
    
    xhr.open(method, url, true);
    
    // Set headers to avoid extension interception
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('X-Bypass-Extension', 'true');
    
    // Set custom headers if provided
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }
    
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('Invalid response format'));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.error || `HTTP Error: ${xhr.status}`));
        } catch (e) {
          reject(new Error(`HTTP Error: ${xhr.status}`));
        }
      }
    };
    
    xhr.onerror = function() {
      reject(new Error('Network error occurred, possibly due to a browser extension interference'));
    };
    
    // Send the request with body if provided
    if (options.body) {
      xhr.send(options.body);
    } else {
      xhr.send();
    }
  });
};

/**
 * Gets a helpful message to show users when security extensions are detected
 */
export const getSecurityExtensionMessage = (): string | null => {
  const { hasBitDefender, hasAnySecurityExtension } = detectSecurityExtensions();
  
  if (hasBitDefender) {
    return "BitDefender extension detected. If you experience issues with file uploads or website functionality, try temporarily disabling BitDefender Web Protection or use a different browser.";
  }
  
  if (hasAnySecurityExtension) {
    return "Security browser extension detected. If you experience issues, try temporarily disabling security extensions or use a different browser.";
  }
  
  return null;
}; 