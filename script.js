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
  const WHITELIST_API_URL = 'https://script.google.com/macros/s/AKfycbwVthVrwG68jpXPwp5WCJqfPdlaK49D6aoysaM5aUwcs220cpQEb9W9nkhGWBJTpV7Q/exec';
  
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
  
  // Validate Ethereum address format
  function isValidEthereumAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  
  // Check button click handler
  checkButton.addEventListener('click', function() {
    const walletAddress = walletInput.value.trim();
    console.log('Checking address:', walletAddress);
    
    // Show result container
    resultContainer.style.display = 'block';
    
    // Reset all message displays
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    invalidMessage.style.display = 'none';
    socialTasks.style.display = 'none';
    
    // Check if wallet address is valid format
    if (!walletAddress.startsWith('0x') || !isValidEthereumAddress(walletAddress)) {
      invalidMessage.style.display = 'block';
      return;
    }
    
    // Display the address in result messages
    document.getElementById('success-address').textContent = walletAddress;
    document.getElementById('error-address').textContent = walletAddress;
    
    console.log('Current whitelist:', whitelistedWallets);
    console.log('Is address in whitelist?', whitelistedWallets.includes(walletAddress));
    
    // Check if wallet is whitelisted (both exact match and case-insensitive)
    if (whitelistedWallets.includes(walletAddress)) {
      // Exact match found
      console.log('Address found (exact match)');
      successMessage.style.display = 'block';
    } else {
      // Try case-insensitive match as a fallback
      const lowerAddress = walletAddress.toLowerCase();
      const foundCaseInsensitive = whitelistedWallets.some(addr => 
        addr.toLowerCase() === lowerAddress);
      
      if (foundCaseInsensitive) {
        console.log('Address found (case-insensitive match)');
        successMessage.style.display = 'block';
      } else {
        console.log('Address not found in whitelist');
        errorMessage.style.display = 'block';
        socialTasks.style.display = 'block';
      }
    }
    
    // Clear input field for next search
    walletInput.value = '';
    walletInput.focus();
  });

  // Create floating social icons
  const socialPlatforms = [
    { type: 'x', href: 'https://twitter.com/nuko', position: { left: '75%', top: '25%' } },
    { type: 'telegram', href: 'https://t.me/nuko', position: { left: '20%', top: '70%' } },
    { type: 'discord', href: 'https://discord.gg/nuko', position: { left: '30%', top: '20%' } }
  ];
  
  socialPlatforms.forEach(platform => {
    const icon = document.createElement('a');
    icon.href = platform.href;
    icon.target = '_blank';
    icon.className = `floating-icon`;
    
    // Add SVG icons
    if (platform.type === 'x') {
      icon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1522 12.8955L4 20H5.38122L10.7653 13.7878L15.0491 20H19.7111L13.3171 10.7749H13.3174ZM11.4822 12.9738L10.9082 12.0881L5.96738 5.03974H7.97256L11.9234 10.7402L12.4974 11.6259L17.7371 19.0075H15.7319L11.4822 12.9742V12.9738Z"/></svg>';
    } else if (platform.type === 'telegram') {
      icon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.04.01-.19-.07-.27-.08-.08-.21-.05-.3-.03-.13.03-2.2 1.4-6.22 4.12-.59.4-1.12.6-1.6.58-.53-.02-1.54-.3-2.3-.55-.93-.31-1.67-.47-1.61-.99.03-.27.38-.54 1.03-.83 4.04-1.75 6.73-2.92 8.08-3.49 3.85-1.67 4.65-1.96 5.17-1.97.12 0 .37.03.54.17.14.12.18.28.2.46-.02.18.05.37-.05.66z"/></svg>';
    } else if (platform.type === 'discord') {
      icon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.9999 5.00001C19.9999 5.00001 12.7145 0.589913 8.40005 5.00001C4.40005 5.00001 -1.00006 10 2.99998 17.7778C6.99998 25.5556 16.0952 22.5 17 21.75C17.9047 21 13.9999 19.75 13.4999 19.25C12.9999 18.75 17.9999 18.5 19.4999 14C20.9999 9.50001 19.9999 5.00001 19.9999 5.00001ZM9.38932 15.301C8.58709 15.301 7.93599 14.5979 7.93599 13.741C7.93599 12.8842 8.58709 12.1811 9.38932 12.1811C10.1916 12.1811 10.8427 12.8842 10.8427 13.741C10.8427 14.5979 10.1916 15.301 9.38932 15.301ZM14.9001 15.301C14.0979 15.301 13.4468 14.5979 13.4468 13.741C13.4468 12.8842 14.0979 12.1811 14.9001 12.1811C15.7023 12.1811 16.3534 12.8842 16.3534 13.741C16.3534 14.5979 15.7023 15.301 14.9001 15.301Z"/></svg>';
    }
    
    icon.style.left = platform.position.left;
    icon.style.top = platform.position.top;
    
    // Animation path
    if (platform.type === 'x') {
      icon.style.setProperty('--x1', '100px');
      icon.style.setProperty('--y1', '50px');
      icon.style.setProperty('--x2', '50px');
      icon.style.setProperty('--y2', '-50px');
      icon.style.setProperty('--x3', '-30px');
      icon.style.setProperty('--y3', '20px');
    } else if (platform.type === 'telegram') {
      icon.style.setProperty('--x1', '-80px');
      icon.style.setProperty('--y1', '-30px');
      icon.style.setProperty('--x2', '20px');
      icon.style.setProperty('--y2', '80px');
      icon.style.setProperty('--x3', '60px');
      icon.style.setProperty('--y3', '-40px');
    } else {
      icon.style.setProperty('--x1', '30px');
      icon.style.setProperty('--y1', '-100px');
      icon.style.setProperty('--x2', '-50px');
      icon.style.setProperty('--y2', '-30px');
      icon.style.setProperty('--x3', '70px');
      icon.style.setProperty('--y3', '50px');
    }
    
    // Animation timing
    icon.style.animationDuration = platform.type === 'x' ? '18s' : 
                                  platform.type === 'telegram' ? '20s' : '15s';
    icon.style.animationDelay = platform.type === 'x' ? '-2s' : 
                               platform.type === 'telegram' ? '-5s' : '0s';
    
    // Size and opacity
    icon.style.width = '45px';
    icon.style.height = '45px';
    icon.style.opacity = '0.5';
    
    floatingIconsContainer.appendChild(icon);
  });
});