document.addEventListener('DOMContentLoaded', function() {
  const checkButton = document.getElementById('check-waitlist');
  const resultContainer = document.getElementById('result-container');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const invalidMessage = document.getElementById('invalid-message');
  const socialTasks = document.getElementById('social-tasks');
  const walletInput = document.getElementById('wallet-address');
  const floatingIconsContainer = document.getElementById('floating-icons');
  
  // API URL for your Google Apps Script Web App 
  // Replace this with your actual deployed script URL
  const WHITELIST_API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec';
  
  // Array to store whitelisted wallets fetched from Google Sheets
  let whitelistedWallets = [];
  
  // Fetch wallet addresses from Google Sheets when page loads
  async function fetchWhitelist() {
      try {
          // Display loading state
          checkButton.disabled = true;
          checkButton.textContent = 'Loading Whitelist...';
          
          const response = await fetch(WHITELIST_API_URL);
          if (!response.ok) {
              throw new Error('Failed to fetch whitelist');
          }
          
          const data = await response.json();
          whitelistedWallets = data.addresses || [];
          
          // Reset button state
          checkButton.disabled = false;
          checkButton.textContent = 'Check Whitelist Status';
          
          console.log('Whitelist loaded successfully with', whitelistedWallets.length, 'addresses');
      } catch (error) {
          console.error('Error loading whitelist:', error);
          // Reset button and show fallback to static list
          checkButton.disabled = false;
          checkButton.textContent = 'Check Whitelist Status';
          
          // Fallback to static list if API fails
          whitelistedWallets = [
              '0x1234567890abcdef1234567890abcdef12345678',
              '0xabcdef1234567890abcdef1234567890abcdef12',
              '0x7890abcdef1234567890abcdef1234567890abcd',
              '0x0000000000000000000000000000000000000000'
          ];
      }
  }
  
  // Load whitelist when page loads
  window.addEventListener('DOMContentLoaded', fetchWhitelist);
  
  // Function to validate Ethereum address format
  function isValidEthereumAddress(address) {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  
  checkButton.addEventListener('click', async function() {
      const walletAddress = walletInput.value.trim().toLowerCase();
      
      // Show result container
      resultContainer.style.display = 'block';
      
      // Reset all message displays
      successMessage.style.display = 'none';
      errorMessage.style.display = 'none';
      invalidMessage.style.display = 'none';
      socialTasks.style.display = 'none';
      
      // Check if wallet address is valid format
      if (!walletAddress.startsWith('0x') || !isValidEthereumAddress(walletAddress)) {
          // Invalid wallet address format
          invalidMessage.style.display = 'block';
          return;
      }
      
      // If the whitelist hasn't been loaded yet, try to fetch it now
      if (whitelistedWallets.length === 0) {
          await fetchWhitelist();
      }
      
      // Display the searched address in the result
      document.getElementById('success-address').textContent = walletAddress;
      document.getElementById('error-address').textContent = walletAddress;
      
      // Check if wallet is whitelisted
      if (whitelistedWallets.includes(walletAddress)) {
          // Wallet is on the waitlist
          successMessage.style.display = 'block';
      } else {
          // Wallet is not on the waitlist
          errorMessage.style.display = 'block';
          socialTasks.style.display = 'block';
      }
      
      // Clear the input field to make it easy to search for another address
      walletInput.value = '';
      
      // Set focus back to the input field
      walletInput.focus();
  });

  // Create one floating icon for each social platform
  const socialPlatforms = [
      { type: 'x', href: 'https://twitter.com/nuko', class: 'icon-x', text: '', position: { left: '75%', top: '25%' } },
      { type: 'telegram', href: 'https://t.me/nuko', class: 'icon-telegram', text: '', position: { left: '20%', top: '70%' } },
      { type: 'discord', href: 'https://discord.gg/nuko', class: 'icon-discord', text: '', position: { left: '30%', top: '20%' } }
  ];
  
  // Create each social icon
  socialPlatforms.forEach(platform => {
      const icon = document.createElement('a');
      icon.href = platform.href;
      icon.target = '_blank';
      icon.className = `floating-icon ${platform.class}`;
      
      // Add SVG icons
      if (platform.type === 'x') {
          icon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.3174 10.7749L19.1457 4H17.7646L12.7039 9.88256L8.66193 4H4L10.1522 12.8955L4 20H5.38122L10.7653 13.7878L15.0491 20H19.7111L13.3171 10.7749H13.3174ZM11.4822 12.9738L10.9082 12.0881L5.96738 5.03974H7.97256L11.9234 10.7402L12.4974 11.6259L17.7371 19.0075H15.7319L11.4822 12.9742V12.9738Z"/></svg>';
      } else if (platform.type === 'telegram') {
          icon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.04.01-.19-.07-.27-.08-.08-.21-.05-.3-.03-.13.03-2.2 1.4-6.22 4.12-.59.4-1.12.6-1.6.58-.53-.02-1.54-.3-2.3-.55-.93-.31-1.67-.47-1.61-.99.03-.27.38-.54 1.03-.83 4.04-1.75 6.73-2.92 8.08-3.49 3.85-1.67 4.65-1.96 5.17-1.97.12 0 .37.03.54.17.14.12.18.28.2.46-.02.18.05.37-.05.66z"/></svg>';
      } else if (platform.type === 'discord') {
          icon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.9999 5.00001C19.9999 5.00001 12.7145 0.589913 8.40005 5.00001C4.40005 5.00001 -1.00006 10 2.99998 17.7778C6.99998 25.5556 16.0952 22.5 17 21.75C17.9047 21 13.9999 19.75 13.4999 19.25C12.9999 18.75 17.9999 18.5 19.4999 14C20.9999 9.50001 19.9999 5.00001 19.9999 5.00001ZM9.38932 15.301C8.58709 15.301 7.93599 14.5979 7.93599 13.741C7.93599 12.8842 8.58709 12.1811 9.38932 12.1811C10.1916 12.1811 10.8427 12.8842 10.8427 13.741C10.8427 14.5979 10.1916 15.301 9.38932 15.301ZM14.9001 15.301C14.0979 15.301 13.4468 14.5979 13.4468 13.741C13.4468 12.8842 14.0979 12.1811 14.9001 12.1811C15.7023 12.1811 16.3534 12.8842 16.3534 13.741C16.3534 14.5979 15.7023 15.301 14.9001 15.301Z"/></svg>';
      }
      
      // Set position
      icon.style.left = platform.position.left;
      icon.style.top = platform.position.top;
      
      // Animation path - make each icon follow a different path
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
      
      // Set animations
      icon.style.animationDuration = platform.type === 'x' ? '18s' : 
                                    platform.type === 'telegram' ? '20s' : '15s';
      icon.style.animationDelay = platform.type === 'x' ? '-2s' : 
                                 platform.type === 'telegram' ? '-5s' : '0s';
      
      // Set size and opacity
      const size = 45; // Larger, uniform size
      icon.style.width = `${size}px`;
      icon.style.height = `${size}px`;
      icon.style.opacity = '0.5'; // More visible
      
      floatingIconsContainer.appendChild(icon);
  });
});