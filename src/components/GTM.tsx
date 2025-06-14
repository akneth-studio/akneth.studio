'use client';
import { useEffect } from 'react';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function GoogleTagManager() {
  useEffect(() => {
    if (!GTM_ID) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    script.async = true;
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.appendChild(noscript);

    return () => {
      // Cleanup GTM script and noscript elements
      document.head.removeChild(script);
      document.body.removeChild(noscript);
    };
  }, []);

  return null;
}
