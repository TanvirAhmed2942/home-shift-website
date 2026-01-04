/**
 * SEO Manager
 * Dynamic meta tags, Open Graph, structured data, and SEO optimizations
 */

// ==================== TYPES ====================
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// ==================== SEO MANAGER ====================
class SEOManager {
  private defaultMeta: PageMeta = {
    title: 'ShiftMyHome - Professional Moving & Logistics Services',
    description: 'Professional moving and logistics services with live tracking, instant quotes, and verified drivers. House removals, furniture delivery, man with van services across the UK.',
    keywords: 'moving services, house removals, man and van, furniture delivery, logistics, live tracking',
    ogImage: 'https://shiftmyhome.com/og-image.png',
    ogType: 'website',
    canonicalUrl: 'https://shiftmyhome.com/'
  };

  /**
   * Update page meta tags
   */
  updatePageMeta(meta: Partial<PageMeta>): void {
    const fullMeta = { ...this.defaultMeta, ...meta };

    // Update title
    document.title = fullMeta.title;

    // Update meta tags
    this.updateMetaTag('description', fullMeta.description);
    if (fullMeta.keywords) {
      this.updateMetaTag('keywords', fullMeta.keywords);
    }

    // Update robots meta
    const robotsContent = [
      fullMeta.noindex ? 'noindex' : 'index',
      fullMeta.nofollow ? 'nofollow' : 'follow'
    ].join(', ');
    this.updateMetaTag('robots', robotsContent);

    // Update Open Graph tags
    this.updateMetaTag('og:title', fullMeta.title, 'property');
    this.updateMetaTag('og:description', fullMeta.description, 'property');
    if (fullMeta.ogImage) {
      this.updateMetaTag('og:image', fullMeta.ogImage, 'property');
    }
    if (fullMeta.ogType) {
      this.updateMetaTag('og:type', fullMeta.ogType, 'property');
    }
    this.updateMetaTag('og:url', fullMeta.canonicalUrl || window.location.href, 'property');

    // Update Twitter Card tags
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:title', fullMeta.title);
    this.updateMetaTag('twitter:description', fullMeta.description);
    if (fullMeta.ogImage) {
      this.updateMetaTag('twitter:image', fullMeta.ogImage);
    }

    // Update canonical URL
    if (fullMeta.canonicalUrl) {
      this.updateCanonicalUrl(fullMeta.canonicalUrl);
    }
  }

  /**
   * Update meta tag
   */
  private updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  }

  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url: string): void {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    
    link.href = url;
  }

  /**
   * Add structured data (JSON-LD)
   */
  addStructuredData(data: Record<string, any>): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = `structured-data-${Date.now()}`;
    document.head.appendChild(script);
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  }

  /**
   * Generate service structured data
   */
  generateServiceSchema(service: {
    name: string;
    description: string;
    provider: string;
    areaServed?: string;
  }): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'Organization',
        name: service.provider
      },
      areaServed: service.areaServed || 'United Kingdom'
    };
  }

  /**
   * Generate FAQ structured data
   */
  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  /**
   * Generate review aggregate structured data
   */
  generateReviewSchema(reviews: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  }): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'ShiftMyHome',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviews.ratingValue,
        reviewCount: reviews.reviewCount,
        bestRating: reviews.bestRating || 5,
        worstRating: reviews.worstRating || 1
      }
    };
  }

  /**
   * Preload critical resources
   */
  preloadResource(url: string, as: 'script' | 'style' | 'image' | 'font'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    
    if (as === 'font') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  }

  /**
   * Prefetch next page
   */
  prefetchPage(url: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  /**
   * Preconnect to domain
   */
  preconnectDomain(domain: string): void {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  }
}

// ==================== SITEMAP GENERATOR ====================
class SitemapGenerator {
  private pages: Array<{
    url: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }> = [];

  /**
   * Add page to sitemap
   */
  addPage(
    url: string,
    options?: {
      lastmod?: string;
      changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
      priority?: number;
    }
  ): void {
    this.pages.push({ url, ...options });
  }

  /**
   * Generate sitemap XML
   */
  generateXML(): string {
    const urls = this.pages
      .map(page => {
        let xml = `  <url>\n    <loc>${page.url}</loc>\n`;
        
        if (page.lastmod) {
          xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
        }
        
        if (page.changefreq) {
          xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        }
        
        if (page.priority !== undefined) {
          xml += `    <priority>${page.priority}</priority>\n`;
        }
        
        xml += `  </url>`;
        return xml;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  /**
   * Initialize with default pages
   */
  initializeDefaults(baseUrl: string = 'https://shiftmyhome.com'): void {
    this.addPage(baseUrl, { changefreq: 'daily', priority: 1.0 });
    this.addPage(`${baseUrl}/contact`, { changefreq: 'monthly', priority: 0.7 });
    this.addPage(`${baseUrl}/faq`, { changefreq: 'monthly', priority: 0.6 });
    this.addPage(`${baseUrl}/blog`, { changefreq: 'weekly', priority: 0.6 });
  }
}

// ==================== ROBOTS.TXT GENERATOR ====================
class RobotsTxtGenerator {
  /**
   * Generate robots.txt content
   */
  generate(baseUrl: string = 'https://shiftmyhome.com'): string {
    return `# ShiftMyHome Robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /driver-dashboard
Disallow: /customer-dashboard
Disallow: /api/
Disallow: /*.json$

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay (optional)
Crawl-delay: 1

# Specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /
`;
  }
}

// ==================== EXPORTS ====================
export const seoManager = new SEOManager();
export const sitemapGenerator = new SitemapGenerator();
export const robotsTxtGenerator = new RobotsTxtGenerator();

// ==================== PAGE META PRESETS ====================
export const PAGE_META: Record<string, PageMeta> = {
  home: {
    title: 'ShiftMyHome - Professional Moving & Logistics Services | Instant Quote',
    description: 'Professional moving and logistics services with live tracking, instant quotes, and verified drivers. House removals, furniture delivery, man with van services across the UK.',
    keywords: 'moving services, house removals, man and van, furniture delivery, logistics, live tracking, instant quote, professional movers',
    ogType: 'website'
  },
  
  about: {
    title: 'About Us - ShiftMyHome | Professional Moving Experts',
    description: 'Learn about ShiftMyHome, our mission to revolutionize the moving industry with technology, and our team of verified professional drivers.',
    keywords: 'about shiftmyhome, company info, moving experts, professional movers',
    ogType: 'website'
  },
  
  contact: {
    title: 'Contact Us - ShiftMyHome | Get in Touch',
    description: 'Get in touch with ShiftMyHome. Call us, email us, or use our live chat for instant support. We\'re here to help with your move.',
    keywords: 'contact shiftmyhome, customer support, moving help',
    ogType: 'website'
  },
  
  faq: {
    title: 'FAQs - ShiftMyHome | Common Questions Answered',
    description: 'Find answers to frequently asked questions about our moving services, pricing, booking process, and more.',
    keywords: 'moving faq, removal questions, moving help',
    ogType: 'website'
  }
};

// ==================== INITIALIZATION ====================
/**
 * Initialize SEO features
 */
export function initializeSEO(): void {
  console.log('🔍 Initializing SEO features...');

  // Initialize sitemap
  sitemapGenerator.initializeDefaults();

  // Preconnect to external domains
  seoManager.preconnectDomain('https://fonts.googleapis.com');
  seoManager.preconnectDomain('https://fonts.gstatic.com');
  seoManager.preconnectDomain('https://maps.googleapis.com');

  console.log('✅ SEO initialized');
}
