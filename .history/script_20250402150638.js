document.addEventListener('DOMContentLoaded', function() {
  const checkButton = document.getElementById('check-waitlist');
  const resultContainer = document.getElementById('result-container');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const invalidMessage = document.getElementById('invalid-message');
  const socialTasks = document.getElementById('social-tasks');
  const walletInput = document.getElementById('wallet-address');
  const floatingIconsContainer = document.getElementById('floating-icons');
  
  // Your Google Apps Script web app URL
  const WHITELIST_API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
  
  // Start with fallback address
  let whitelistedWallets = ['0x0000000000000000000000000000000000000000'];
  let isLoading = false;
  
  // Fetch wallet addresses using JSONP
  function fetchWhitelistJSONP() {
    if (isLoading) return;
    
    isLoading = true;
    checkButton.disabled = true;
    checkButton.textContent = 'Loading Whitelist...';
    
    console.log('Attempting to fetch whitelist via JSONP...');
    
    // Generate a unique callback name to avoid conflicts
    const callbackName = 'jsonpCallback_' + Math.random().toString(36).substring(2, 15);
    
    // Define the callback function globally
    window[callbackName] = function(data) {
      console.log('JSONP response received:', data);
      
      if (data.addresses && data.addresses.length > 0) {
        whitelistedWallets = data.addresses;
        console.log(`Loaded ${whitelistedWallets.length} addresses from API`);
      } else {
        console.log('No addresses returned from API, using fallback');
      }
      
      // Always ensure the fallback address is included
      if (!whitelistedWallets.includes('0x0000000000000000000000000000000000000000')) {
        whitelistedWallets.push('0x0000000000000000000000000000000000000000');
      }
      
      checkButton.disabled = false;
      checkButton.textContent = 'Check Whitelist Status';
      isLoading = false;
      
      // Clean up - remove the script tag and delete the global callback
      if (scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
      delete window[callbackName];
    };
    
    // Create a script element to fetch the data
    const scriptElement = document.createElement('script');
    scriptElement.src = `${WHITELIST_API_URL}?callback=${callbackName}&cacheBuster=${Date.now()}`;
    
    // Handle load errors
    scriptElement.onerror = function() {
      console.error('Error loading whitelist via JSONP');
      checkButton.disabled = false;
      checkButton.textContent = 'Check Whitelist Status';
      isLoading = false;
      
      if (scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
      delete window[callbackName];
    };
    
    // Add the script to the page to initiate the request
    document.body.appendChild(scriptElement);
  }
  
  // Load whitelist when page loads
  fetchWhitelistJSONP();
  
  // Rest of your code (wallet validation, check button handler, etc.)
  // ...
});