/**
 * Simple Company Name Search / Suggestion Service
 * Finds matching company names as the user types (like Google Search autocomplete).
 * Only returns company name strings without auto-filling other fields.
 */

// Comprehensive list of popular global companies & startups for instant suggestions
export const POPULAR_COMPANY_NAMES = [
  'Google',
  'Google Cloud',
  'Google DeepMind',
  'Microsoft',
  'Amazon',
  'Amazon Web Services (AWS)',
  'Apple',
  'Meta',
  'Netflix',
  'Stripe',
  'Uber',
  'Airbnb',
  'OpenAI',
  'Anthropic',
  'Datadog',
  'Snowflake',
  'Coinbase',
  'Adobe',
  'Salesforce',
  'Spotify',
  'Shopify',
  'Atlassian',
  'Nvidia',
  'ByteDance (TikTok)',
  'GitHub',
  'Oracle',
  'Palantir Technologies',
  'Cisco Systems',
  'Intel',
  'AMD',
  'Qualcomm',
  'IBM',
  'Twitter / X',
  'LinkedIn',
  'Pinterest',
  'Snapchat (Snap Inc.)',
  'Reddit',
  'Discord',
  'Figma',
  'Canva',
  'Notion',
  'Slack',
  'Zoom',
  'Dropbox',
  'Box',
  'Twilio',
  'Cloudflare',
  'Fastly',
  'Vercel',
  'Supabase',
  'MongoDB',
  'Elastic',
  'Redis',
  'Confluent',
  'HashiCorp',
  'GitLab',
  'Docker',
  'Postman',
  'Palo Alto Networks',
  'CrowdStrike',
  'Okta',
  'Zscaler',
  'Splunk',
  'HubSpot',
  'Workday',
  'ServiceNow',
  'Intuit',
  'Square (Block)',
  'PayPal',
  'Robinhood',
  'Plaid',
  'Brex',
  'Ramp',
  'Affirm',
  'Klarna',
  'Revolut',
  'Monzo',
  'Wise',
  'Goldman Sachs',
  'Morgan Stanley',
  'JPMorgan Chase',
  'BlackRock',
  'Citadel',
  'Two Sigma',
  'Jane Street',
  'Hudson River Trading',
  'DoorDash',
  'Instacart',
  'Lyft',
  'Grab',
  'Deliveroo',
  'Swiggy',
  'Zomato',
  'Blinkit',
  'Zepto',
  'Flipkart',
  'Razorpay',
  'CRED',
  'PhonePe',
  'Paytm',
  'Groww',
  'Zerodha',
  'Meesho',
  'Urban Company',
  'Ola',
  'Tata Consultancy Services (TCS)',
  'Infosys',
  'Wipro',
  'HCL Technologies',
  'Tech Mahindra',
  'L&T Technology Services',
  'Cognizant',
  'Accenture',
  'Capgemini',
  'Deloitte',
  'PwC',
  'EY',
  'KPMG',
  'McKinsey & Company',
  'Boston Consulting Group (BCG)',
  'Bain & Company',
  'Sony',
  'Samsung',
  'Siemens',
  'Bosch',
  'Tesla',
  'SpaceX',
  'Rivian',
  'Waymo',
  'Cruise'
];

/**
 * Search company names with debounce
 * Matches curated names first, then queries Wikipedia/Google OpenSearch for any other query
 */
export const searchCompanyNames = async (query = '') => {
  if (!query || !query.trim()) return [];

  const q = query.trim().toLowerCase();

  // 1. Local filter
  const localMatches = POPULAR_COMPANY_NAMES.filter((name) =>
    name.toLowerCase().includes(q)
  );

  if (localMatches.length >= 5) {
    return localMatches.slice(0, 8);
  }

  // 2. Fetch live suggestions from Wikipedia OpenSearch (public CORS enabled)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
      query.trim()
    )}&limit=8&namespace=0&format=json&origin=*`;

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const titles = data[1] || [];

      const combined = [
        ...localMatches,
        ...titles.filter(
          (t) => !localMatches.some((lm) => lm.toLowerCase() === t.toLowerCase())
        )
      ];

      return combined.slice(0, 8);
    }
  } catch (err) {
    // Return local matches if remote network fails
  }

  return localMatches.slice(0, 8);
};
