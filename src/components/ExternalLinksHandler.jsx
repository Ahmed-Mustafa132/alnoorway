import { useEffect } from 'react';

/**
 * ExternalLinksHandler Component
 * 
 * Purpose: Ensures all external links open in the default browser (Safari)
 * instead of inside the WebView - required for Apple App Store compliance
 * 
 * This component:
 * 1. Intercepts clicks on all <a> tags
 * 2. Checks if the link is external (different domain)
 * 3. Opens external links in the default browser
 * 4. Allows internal navigation to work normally
 */
export default function ExternalLinksHandler() {
  useEffect(() => {
    // Detect if running in iOS WebView
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent) ||
                      /TariqAlNoorApp\/iOS/.test(navigator.userAgent);

    // Only activate this handler in iOS WebView
    if (!isIOS || !isWebView) {
      return;
    }

    const handleClick = (e) => {
      const target = e.target.closest('a');
      
      if (!target) return;

      const href = target.getAttribute('href');
      
      // Skip if no href or it's a special protocol
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
        return;
      }

      // Check if it's an external link
      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      const isCurrentDomain = href.includes(window.location.hostname);

      // If external and not current domain, open in default browser
      if (isExternal && !isCurrentDomain) {
        e.preventDefault();
        
        // Use window.open with _system to open in Safari (iOS)
        window.open(href, '_system');
        
        console.log('External link opened in default browser:', href);
      }
    };

    // Add click listener to document
    document.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}