import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'organization' | 'service' | 'article' | 'faq' | 'breadcrumb';
  data: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const baseUrl = 'https://jetup.aero';

  const generateStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "JETUP",
          "legalName": "JETUP LTD",
          "alternateName": ["JETUP Private Flight Network", "JETUP Aviation", "JETUP LTD (UK)"],
          "url": baseUrl,
          "logo": `${baseUrl}/Up-app-logo.png`,
          "description": "JETUP - Official global private flight network connecting premium customers with verified operators worldwide",
          "slogan": "JETUP - More Than Flight Experience",
          "brand": {
            "@type": "Brand",
            "name": "JETUP"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "27 Old Gloucester Street",
            "addressLocality": "London",
            "postalCode": "WC1N 3AX",
            "addressCountry": "GB"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-888-565-6090",
            "email": "support@jetup.aero",
            "contactType": "customer service",
            "availableLanguage": ["English"],
            "areaServed": "Worldwide"
          },
          "sameAs": [
            "https://www.instagram.com/jetupaero/",
            "https://x.com/jetupaero/",
            "https://www.youtube.com/@jetupaero"
          ],
          "foundingDate": "2024",
          "numberOfEmployees": "10-50",
          "industry": "Aviation",
          "keywords": "JETUP, private jets, luxury aviation, flight network",
          "serviceArea": {
            "@type": "Place",
            "name": "Worldwide"
          }
        };

      case 'service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "JETUP Private Jet Charter Booking",
          "description": "JETUP - Premium private jet charter booking platform connecting customers with verified operators worldwide",
          "provider": {
            "@type": "Organization",
            "name": "JETUP",
            "url": baseUrl
          },
          "serviceType": "JETUP Private Aviation Booking Platform",
          "areaServed": {
            "@type": "Place",
            "name": "Worldwide"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "JETUP Private Jet Charter Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "JETUP Light Jet Charter"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "JETUP Mid-Size Jet Charter"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "JETUP Heavy Jet Charter"
                }
              }
            ]
          }
        };

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "author": {
            "@type": "Organization",
            "name": "JETUP"
          },
          "publisher": {
            "@type": "Organization",
            "name": "JETUP",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/Up-app-logo.png`
            }
          },
          "datePublished": data.publishedTime || new Date().toISOString(),
          "dateModified": data.modifiedTime || new Date().toISOString(),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseUrl}${data.url}`
          }
        };

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.faqs?.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          })) || []
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.breadcrumbs?.map((crumb: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": `${baseUrl}${crumb.url}`
          })) || []
        };

      default:
        return {};
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
};

export default StructuredData;