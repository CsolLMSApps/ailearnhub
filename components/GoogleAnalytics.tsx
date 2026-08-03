"use client"

import Script from 'next/script'

export default function GoogleAnalytics() {
  return (
    <>
      {/* Consent defaults must be set BEFORE the GA4 script loads */}
      <Script id="google-analytics-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          // Check if user has already consented
          var consent = typeof localStorage !== 'undefined' ? localStorage.getItem('cookieConsent') : null;

          gtag('consent', 'default', {
            analytics_storage: consent === 'accepted' ? 'granted' : 'denied',
            ad_storage: 'denied',
            wait_for_update: 500
          });
        `}
      </Script>

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-BRP7N4DX9C"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BRP7N4DX9C');
        `}
      </Script>
    </>
  )
}
