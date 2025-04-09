import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import Providers from "./providers";
import { getBlockerScript } from "@/utils/bitdefenderBlocker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CAD File Block Viewer",
  description: "View and interact with blocks from CAD files (DWG/DXF).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical script to block BitDefender that must run before anything else */}
        <script
          dangerouslySetInnerHTML={{ __html: getBlockerScript() }}
          id="bitdefender-blocker"
          key="bitdefender-blocker"
        />

        {/* CSP meta tag to block extension scripts */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'none'; frame-ancestors 'self'"
        />

        <Script id="suppress-hydration-warnings" strategy="beforeInteractive">
          {`
            // Patch console.error to suppress hydration warnings caused by browser extensions
            (function() {
              if (typeof window !== 'undefined') {
                const originalConsoleError = console.error;
                console.error = function(...args) {
                  const message = args[0] && typeof args[0] === 'string' ? args[0] : '';
                  if (message.includes('Hydration failed') || 
                      message.includes('hydrated but some attributes') ||
                      message.includes('bis_') ||
                      message.includes('extension')) {
                    // Suppress hydration warnings caused by browser extensions
                    return;
                  }
                  return originalConsoleError.apply(this, args);
                };
              }
            })();
          `}
        </Script>
        <Script id="remove-extension-attrs" strategy="beforeInteractive">
          {`
            (function() {
              if (typeof window !== 'undefined') {
                // Function to clean BitDefender attributes
                const cleanBitDefenderAttributes = () => {
                  const allElements = document.querySelectorAll('*');
                  allElements.forEach(el => {
                    // Remove BitDefender and other extension attributes
                    if (el.hasAttribute('bis_skin_checked')) el.removeAttribute('bis_skin_checked');
                    if (el.hasAttribute('bis_register')) el.removeAttribute('bis_register');
                    if (el.hasAttribute('__processed_6734fd27-b6e1-4fc0-a400-6eb255225108__')) {
                      el.removeAttribute('__processed_6734fd27-b6e1-4fc0-a400-6eb255225108__');
                    }
                    
                    // Remove other dynamic attributes with pattern matching
                    Array.from(el.attributes).forEach(attr => {
                      if (attr.name.startsWith('__processed_') || 
                          attr.name.startsWith('bis_') ||
                          attr.name.includes('extension')) {
                        el.removeAttribute(attr.name);
                      }
                    });
                  });
                };
                
                // Run immediately
                cleanBitDefenderAttributes();
                
                // Run when DOM is loaded
                document.addEventListener('DOMContentLoaded', cleanBitDefenderAttributes);
                
                // Set up a MutationObserver to continuously monitor for BitDefender attributes
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && 
                        (mutation.attributeName?.startsWith('bis_') || 
                         mutation.attributeName?.startsWith('__processed_'))) {
                      // If BitDefender adds an attribute, remove it immediately
                      if (mutation.target instanceof Element) {
                        mutation.target.removeAttribute(mutation.attributeName);
                      }
                    }
                    
                    // Periodically clean all elements
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                      cleanBitDefenderAttributes();
                    }
                  });
                });
                
                // Start observing the document with configured parameters
                observer.observe(document.documentElement, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['bis_skin_checked', 'bis_register', '__processed_6734fd27-b6e1-4fc0-a400-6eb255225108__']
                });
                
                // Also set a periodic cleaning every second as a fallback
                setInterval(cleanBitDefenderAttributes, 1000);
              }
            })();
          `}
        </Script>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
