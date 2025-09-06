import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'JETUP - Private Flight Network | Luxury Private Jet Charter',
  description = 'JETUP connects premium customers with verified private jet operators worldwide. Book luxury private flights with 0% commission, 1000+ aircraft, and 24/7 support.',
  keywords = 'private jet charter, luxury flights, business aviation, private aircraft, jet rental, charter flights, premium travel, aviation network',
  image = '/JETUP-Photo-01.jpg',
  url,
  type = 'website',
  author = 'JETUP LTD (UK)',
  publishedTime,
  modifiedTime,
  noIndex = false,
  canonicalUrl
}) => {
  const baseUrl = 'https://jetup.aero';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const canonical = canonicalUrl || fullUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="JETUP Private Flight Network" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@jetupaero" />
      <meta name="twitter:creator" content="@jetupaero" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Article specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      <meta property="article:author" content={author} />

      {/* Additional SEO */}
      <meta name="theme-color" content="#0B1733" />
      <meta name="msapplication-TileColor" content="#0B1733" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="GB-LND" />
      <meta name="geo.placename" content="London" />
      <meta name="geo.position" content="51.5074;-0.1278" />
      <meta name="ICBM" content="51.5074, -0.1278" />

      {/* Business Info */}
      <meta name="contact" content="support@jetup.aero" />
      <meta name="copyright" content="© 2025 JETUP LTD (UK)" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "JETUP LTD",
          "alternateName": "JETUP Private Flight Network",
          "url": "https://jetup.aero",
          "logo": `${baseUrl}/Up-app-logo.png`,
          "description": description,
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
            "contactType": "customer service",
            "email": "support@jetup.aero",
            "availableLanguage": "English"
          },
          "sameAs": [
            "https://www.instagram.com/jetupaero/",
            "https://x.com/jetupaero/",
            "https://www.youtube.com/@jetupaero"
          ],
          "foundingDate": "2024",
          "numberOfEmployees": "10-50",
          "industry": "Aviation",
          "serviceArea": {
            "@type": "Place",
            "name": "Worldwide"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
