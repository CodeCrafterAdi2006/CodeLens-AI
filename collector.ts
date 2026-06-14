import url from 'url';

export interface WebSignals {
  url: string;
  domain: string;
  statusCode: number;
  headers: Record<string, string>;
  htmlSize: number;
  detectedMetaTags: Record<string, string>;
  scriptSrcs: string[];
  linkHrefs: string[];
  detectedPatterns: string[];
}

export async function collectSignals(targetUrl: string): Promise<WebSignals> {
  // Add protocol if missing
  let formattedUrl = targetUrl.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }

  let parsedUrl: url.UrlWithStringQuery;
  try {
    parsedUrl = url.parse(formattedUrl);
  } catch (e) {
    throw new Error('Invalid URL format');
  }

  const domain = parsedUrl.hostname || '';

  // Setup AbortController for a 10 second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(formattedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok && response.status !== 404 && response.status !== 403) {
      throw new Error(`Failed to retrieve page: HTTP ${response.status}`);
    }

    const headers: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      headers[key] = val;
    });

    const bodyText = await response.text();
    const htmlSize = bodyText.length;

    // Signal extraction lists
    const scriptSrcs: string[] = [];
    const linkHrefs: string[] = [];
    const detectedMetaTags: Record<string, string> = {};
    const detectedPatterns: string[] = [];

    // Extract meta tags: <meta name="..." content="..." /> or <meta property="..." content="..." />
    const metaRegex = /<meta\s+[^>]*?(name|property)=["']([^"']+)["'][^>]*?content=["']([^"']*)["']/gi;
    let metaMatch;
    while ((metaMatch = metaRegex.exec(bodyText)) !== null) {
      const name = metaMatch[2].toLowerCase();
      const content = metaMatch[3];
      detectedMetaTags[name] = content;
    }

    // Extract script tags: <script src="..."
    const scriptRegex = /<script\s+[^>]*?src=["']([^"']+)["']/gi;
    let scriptMatch;
    while ((scriptMatch = scriptRegex.exec(bodyText)) !== null) {
      scriptSrcs.push(scriptMatch[1]);
    }

    // Extract link tags: <link href="..."
    const linkRegex = /<link\s+[^>]*?href=["']([^"']+)["']/gi;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(bodyText)) !== null) {
      linkHrefs.push(linkMatch[1]);
    }

    // Pattern Detection
    if (bodyText.includes('__NEXT_DATA__') || bodyText.includes('/_next/static')) {
      detectedPatterns.push('Next.js');
    }
    if (bodyText.includes('react-root') || bodyText.includes('_reactListen') || bodyText.includes('react-hydration')) {
      detectedPatterns.push('React');
    }
    if (bodyText.includes('vue-container') || bodyText.includes('__vue__') || bodyText.includes('data-v-')) {
      detectedPatterns.push('Vue.js');
    }
    if (bodyText.includes('ng-version') || bodyText.includes('ng-app') || bodyText.includes('ng-controller')) {
      detectedPatterns.push('Angular');
    }
    if (bodyText.includes('wp-content') || bodyText.includes('wp-includes')) {
      detectedPatterns.push('WordPress');
    }
    if (bodyText.includes('cdn.shopify.com') || bodyText.includes('Shopify.shop')) {
      detectedPatterns.push('Shopify');
    }
    if (bodyText.includes('tailwindcss') || bodyText.includes('tailwind.css') || bodyText.includes('tw-')) {
      detectedPatterns.push('TailwindCSS');
    }
    if (bodyText.includes('bootstrap.css') || bodyText.includes('bootstrap.min.css') || bodyText.includes('class="row"') || bodyText.includes('class="col-')) {
      detectedPatterns.push('Bootstrap');
    }
    if (bodyText.includes('gtag(') || bodyText.includes('google-analytics.com') || bodyText.includes('googletagmanager.com/gtm.js')) {
      detectedPatterns.push('Google Analytics');
    }
    if (bodyText.includes('js.stripe.com')) {
      detectedPatterns.push('Stripe Checkout');
    }
    if (bodyText.includes('cloudflare')) {
      detectedPatterns.push('Cloudflare');
    }

    // Check Headers for additional markers
    const serverHeader = (headers['server'] || '').toLowerCase();
    const poweredBy = (headers['x-powered-by'] || '').toLowerCase();

    if (serverHeader.includes('cloudflare')) detectedPatterns.push('Cloudflare CDN');
    if (serverHeader.includes('nginx')) detectedPatterns.push('Nginx');
    if (serverHeader.includes('apache')) detectedPatterns.push('Apache');
    if (serverHeader.includes('vercel')) detectedPatterns.push('Vercel hosting');
    if (poweredBy.includes('express')) detectedPatterns.push('Express.js');
    if (poweredBy.includes('next.js')) detectedPatterns.push('Next.js');
    if (headers['x-nextjs-cache']) detectedPatterns.push('Next.js Cache');

    return {
      url: formattedUrl,
      domain,
      statusCode: response.status,
      headers,
      htmlSize,
      detectedMetaTags,
      scriptSrcs: scriptSrcs.slice(0, 30), // Limit arrays to save space
      linkHrefs: linkHrefs.slice(0, 30),
      detectedPatterns: Array.from(new Set(detectedPatterns))
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out after 10 seconds');
    }
    throw new Error(`Scraper Error: ${err.message}`);
  }
}
