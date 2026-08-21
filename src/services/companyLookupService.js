/**
 * Company Autocomplete & Auto-fill Lookup Service
 * Combines curated company datasets with live Wikipedia Infobox vCard parsing.
 * Extracts accurate, up-to-date employee counts and dynamically generates custom fields
 * based on all vCard table rows.
 */

import { fetchCompanyWikipediaDetails, searchWikipediaCompanies } from './wikipediaService';

// Curated database of top global companies, tech giants, startups, unicorns & enterprises
export const POPULAR_COMPANIES = [
  {
    name: 'Google',
    aliases: ['Alphabet', 'Google LLC'],
    domain: 'google.com',
    companySize: '180,000+ employees (Big Tech)',
    location: 'Mountain View, CA / Global',
    jobLink: 'https://careers.google.com',
    tags: ['Big Tech', 'Search', 'Cloud', 'AI', 'Core Systems'],
    overview: 'Multinational technology company specializing in search engine technology, online advertising, cloud computing, software, and AI.'
  },
  {
    name: 'Microsoft',
    aliases: ['MSFT'],
    domain: 'microsoft.com',
    companySize: '220,000+ employees (Big Tech)',
    location: 'Redmond, WA / Remote',
    jobLink: 'https://careers.microsoft.com',
    tags: ['Big Tech', 'Azure Cloud', 'Enterprise Software', 'AI'],
    overview: 'Global tech leader developing operating systems, Azure cloud platforms, developer tools, AI, and productivity software.'
  },
  {
    name: 'Amazon',
    aliases: ['AWS', 'Amazon.com'],
    domain: 'amazon.com',
    companySize: '1,500,000+ employees (Enterprise)',
    location: 'Seattle, WA / Arlington, VA',
    jobLink: 'https://amazon.jobs',
    tags: ['Big Tech', 'AWS', 'E-Commerce', 'Cloud Architecture'],
    overview: 'Leader in cloud computing (AWS), e-commerce, digital streaming, logistics, and artificial intelligence.'
  },
  {
    name: 'Apple',
    aliases: ['Apple Inc'],
    domain: 'apple.com',
    companySize: '160,000+ employees (Big Tech)',
    location: 'Cupertino, CA / Hybrid',
    jobLink: 'https://jobs.apple.com',
    tags: ['Big Tech', 'Hardware', 'iOS', 'Silicon', 'Consumer Tech'],
    overview: 'World leader in consumer electronics, iOS platforms, Apple Silicon hardware, and digital services.'
  },
  {
    name: 'Meta',
    aliases: ['Facebook', 'Instagram', 'WhatsApp'],
    domain: 'meta.com',
    companySize: '67,000+ employees (Big Tech)',
    location: 'Menlo Park, CA / Remote',
    jobLink: 'https://metacareers.com',
    tags: ['Big Tech', 'Social Media', 'AI / PyTorch', 'Distributed Systems'],
    overview: 'Technology conglomerate operating Facebook, Instagram, WhatsApp, Messenger, and open-source AI infrastructure (Llama, PyTorch).'
  },
  {
    name: 'Netflix',
    aliases: ['Netflix Inc'],
    domain: 'netflix.com',
    companySize: '13,000+ employees (Scale-up)',
    location: 'Los Gatos, CA / Remote',
    jobLink: 'https://jobs.netflix.com',
    tags: ['Streaming', 'High Compensation', 'Distributed Systems', 'Chaos Engineering'],
    overview: 'Global entertainment streaming leader known for high-concurrency video delivery networks and top-tier engineering culture.'
  },
  {
    name: 'Stripe',
    aliases: ['Stripe Payments'],
    domain: 'stripe.com',
    companySize: '8,000+ employees (Unicorn / Enterprise)',
    location: 'San Francisco, CA / Dublin / Remote',
    jobLink: 'https://stripe.com/jobs',
    tags: ['Fintech', 'Payments', 'Developer Tools', 'High Scale'],
    overview: 'Financial infrastructure platform for the internet, powering payment APIs, billing, and transactional ledger systems globally.'
  },
  {
    name: 'Uber',
    aliases: ['Uber Technologies'],
    domain: 'uber.com',
    companySize: '30,000+ employees (Enterprise)',
    location: 'San Francisco, CA / Global',
    jobLink: 'https://uber.com/careers',
    tags: ['Mobility', 'Logistics', 'Real-time Systems', 'Microservices'],
    overview: 'Global mobility-as-a-service provider operating real-time ride-hailing, food delivery (Uber Eats), and freight transportation.'
  },
  {
    name: 'Airbnb',
    aliases: ['Airbnb Inc'],
    domain: 'airbnb.com',
    companySize: '6,800+ employees',
    location: 'San Francisco, CA / Remote (Live Anywhere)',
    jobLink: 'https://careers.airbnb.com',
    tags: ['Travel', 'Marketplace', 'Design Systems', 'Remote-First'],
    overview: 'Online marketplace for short-term stays and experiences, famed for exemplary design systems and remote work flexibility.'
  },
  {
    name: 'OpenAI',
    aliases: ['ChatGPT'],
    domain: 'openai.com',
    companySize: '1,500+ employees (AI Frontier)',
    location: 'San Francisco, CA',
    jobLink: 'https://openai.com/careers',
    tags: ['Generative AI', 'LLMs', 'Research', 'High Comp'],
    overview: 'AI research and deployment company behind GPT-4, ChatGPT, DALL-E, and Sora.'
  },
  {
    name: 'Anthropic',
    aliases: ['Claude'],
    domain: 'anthropic.com',
    companySize: '600+ employees (AI Frontier)',
    location: 'San Francisco, CA',
    jobLink: 'https://anthropic.com/careers',
    tags: ['AI Safety', 'LLMs', 'Claude', 'High Comp'],
    overview: 'AI safety and research company focused on building steerable, interpretable AI systems including Claude.'
  },
  {
    name: 'Datadog',
    aliases: ['DatadogHQ'],
    domain: 'datadoghq.com',
    companySize: '6,000+ employees',
    location: 'New York, NY / Remote',
    jobLink: 'https://careers.datadoghq.com',
    tags: ['Observability', 'Cloud Monitoring', 'Go / TS', 'Telemetry'],
    overview: 'Leading observability and cloud telemetry platform monitoring servers, databases, and microservices in real-time.'
  },
  {
    name: 'Snowflake',
    aliases: ['Snowflake Computing'],
    domain: 'snowflake.com',
    companySize: '7,000+ employees',
    location: 'Bozeman, MT / San Mateo, CA / Remote',
    jobLink: 'https://careers.snowflake.com',
    tags: ['Data Cloud', 'Data Warehousing', 'Distributed SQL', 'High Scale'],
    overview: 'Cloud-based data storage and analytics service provider offering high-concurrency data warehousing platforms.'
  },
  {
    name: 'Coinbase',
    aliases: ['Coinbase Global'],
    domain: 'coinbase.com',
    companySize: '3,800+ employees',
    location: 'Remote-First (US / Global)',
    jobLink: 'https://coinbase.com/careers',
    tags: ['Crypto', 'Web3', 'Fintech', 'Remote-First'],
    overview: 'Secure online cryptocurrency exchange platform enabling individuals and institutions to trade digital assets.'
  },
  {
    name: 'Adobe',
    aliases: ['Adobe Inc', 'Adobe Systems'],
    domain: 'adobe.com',
    companySize: '30,000+ employees (Enterprise)',
    location: 'San Jose, CA / Remote',
    jobLink: 'https://careers.adobe.com',
    tags: ['Creative Software', 'Photoshop', 'SaaS', 'Digital Media'],
    overview: 'Multinational computer software company known for Photoshop, Illustrator, Premiere, Acrobat, and Adobe Creative Cloud.'
  },
  {
    name: 'Salesforce',
    aliases: ['Salesforce.com'],
    domain: 'salesforce.com',
    companySize: '72,000+ employees (Enterprise)',
    location: 'San Francisco, CA / Remote',
    jobLink: 'https://salesforce.com/company/careers',
    tags: ['CRM', 'Enterprise SaaS', 'Cloud Platform'],
    overview: 'Global cloud-based customer relationship management (CRM) software and enterprise application provider.'
  },
  {
    name: 'Spotify',
    aliases: ['Spotify AB'],
    domain: 'spotify.com',
    companySize: '9,000+ employees',
    location: 'Stockholm, Sweden / New York, NY / Remote',
    jobLink: 'https://spotifyjobs.com',
    tags: ['Music Streaming', 'Audio Tech', 'Recommendation Systems'],
    overview: 'Audio streaming and media services provider offering digital music and podcast content to over 600M users.'
  },
  {
    name: 'Shopify',
    aliases: ['Shopify Inc'],
    domain: 'shopify.com',
    companySize: '8,500+ employees',
    location: 'Ottawa, Canada / Digital by Default (Remote)',
    jobLink: 'https://shopify.com/careers',
    tags: ['E-Commerce', 'Ruby on Rails', 'React / GraphQL', 'Merchant Solutions'],
    overview: 'Global commerce platform powering online stores, checkout infrastructure, and retail point-of-sale for millions of businesses.'
  },
  {
    name: 'Atlassian',
    aliases: ['Jira', 'Confluence', 'Trello'],
    domain: 'atlassian.com',
    companySize: '12,000+ employees',
    location: 'Sydney, Australia / San Francisco / Remote (TEAM Anywhere)',
    jobLink: 'https://atlassian.com/company/careers',
    tags: ['Developer Tools', 'Jira', 'Team Collaboration', 'Remote-First'],
    overview: 'Provider of collaboration and developer software including Jira, Confluence, Trello, and Bitbucket.'
  },
  {
    name: 'NVIDIA',
    aliases: ['Nvidia Corp'],
    domain: 'nvidia.com',
    companySize: '42,000+ employees (FY26 Wikipedia)',
    location: 'Santa Clara, CA / Hybrid',
    jobLink: 'https://nvidia.com/en-us/about-nvidia/careers',
    tags: ['Semiconductors', 'GPUs', 'CUDA', 'AI Hardware', 'High Market Cap'],
    overview: 'Global leader in accelerated computing, GPUs, CUDA parallel architecture, AI data center hardware, and autonomous systems.'
  },
  {
    name: 'ByteDance',
    aliases: ['TikTok'],
    domain: 'bytedance.com',
    companySize: '150,000+ employees',
    location: 'Singapore / San Jose / Beijing / London',
    jobLink: 'https://jobs.bytedance.com',
    tags: ['Short Video', 'TikTok', 'Recommendation Algorithms', 'High Scale'],
    overview: 'Technology company operating content platforms such as TikTok, Douyin, and Toutiao powered by recommendation algorithms.'
  },
  {
    name: 'GitHub',
    aliases: ['GitHub Inc'],
    domain: 'github.com',
    companySize: '3,000+ employees (Subsidiary of Microsoft)',
    location: 'Remote-First (Global)',
    jobLink: 'https://github.com/about/careers',
    tags: ['Developer Platform', 'Git', 'Copilot', 'Open Source'],
    overview: 'World’s leading developer platform for hosting software code, version control with Git, and AI programming (GitHub Copilot).'
  },
  {
    name: 'Oracle',
    aliases: ['Oracle Corporation'],
    domain: 'oracle.com',
    companySize: '160,000+ employees (Enterprise)',
    location: 'Austin, TX / Redwood City, CA',
    jobLink: 'https://oracle.com/careers',
    tags: ['Relational Databases', 'OCI Cloud', 'Java', 'Enterprise Software'],
    overview: 'Enterprise software and database giant providing OCI cloud infrastructure, Java platform, and database management systems.'
  },
  {
    name: 'Palantir',
    aliases: ['Palantir Technologies'],
    domain: 'palantir.com',
    companySize: '4,000+ employees',
    location: 'Denver, CO / New York / London',
    jobLink: 'https://palantir.com/careers',
    tags: ['Big Data', 'Foundry', 'Gotham', 'Defense & Enterprise Analytics'],
    overview: 'Specializes in big data analytics platforms (Gotham, Foundry, AIP) for enterprise intelligence and defense organizations.'
  },
  {
    name: 'Cisco',
    aliases: ['Cisco Systems'],
    domain: 'cisco.com',
    companySize: '84,000+ employees (Networking & Security)',
    location: 'San Jose, CA / Remote',
    jobLink: 'https://cisco.com/careers',
    tags: ['Networking', 'Cybersecurity', 'Cloud Infrastructure'],
    overview: 'Worldwide leader in networking hardware, software, telecommunications equipment, and cybersecurity solutions.'
  },
  {
    name: 'Intel',
    aliases: ['Intel Corporation'],
    domain: 'intel.com',
    companySize: '124,000+ employees',
    location: 'Santa Clara, CA / Hillsboro, OR',
    jobLink: 'https://jobs.intel.com',
    tags: ['Semiconductors', 'x86 Processors', 'Foundry'],
    overview: 'World’s largest semiconductor chip manufacturer by revenue and developer of x86 microprocessor architecture.'
  },
  {
    name: 'Goldman Sachs',
    aliases: ['GS'],
    domain: 'goldmansachs.com',
    companySize: '45,000+ employees (Investment Banking)',
    location: 'New York, NY / London / Bengaluru',
    jobLink: 'https://goldmansachs.com/careers',
    tags: ['Investment Banking', 'High Frequency Trading', 'Fintech', 'Java / Slang'],
    overview: 'Global investment banking, securities, and investment management firm with extensive electronic trading infrastructure.'
  },
  {
    name: 'JPMorgan Chase',
    aliases: ['JPMC'],
    domain: 'jpmorganchase.com',
    companySize: '300,000+ employees (Financial Services)',
    location: 'New York, NY / Global',
    jobLink: 'https://careers.jpmorgan.com',
    tags: ['Banking', 'Fintech', 'Enterprise Cloud', 'Security'],
    overview: 'Largest bank in the United States providing commercial banking, investment banking, asset management, and payment processing.'
  },
  {
    name: 'Razorpay',
    aliases: ['Razorpay Software'],
    domain: 'razorpay.com',
    companySize: '3,500+ employees (Fintech Unicorn)',
    location: 'Bengaluru, India',
    jobLink: 'https://razorpay.com/jobs',
    tags: ['Fintech', 'India Unicorn', 'Payment Gateway', 'Banking APIs'],
    overview: 'Indian payment gateway and neo-banking platform powering digital payment processing for millions of merchants.'
  },
  {
    name: 'Swiggy',
    aliases: ['Swiggy Ltd'],
    domain: 'swiggy.com',
    companySize: '6,000+ employees',
    location: 'Bengaluru, India',
    jobLink: 'https://careers.swiggy.com',
    tags: ['Food Delivery', 'Quick Commerce', 'Instamart', 'Real-time Logistics'],
    overview: 'Online food ordering and quick-commerce delivery platform operating across 500+ Indian cities.'
  },
  {
    name: 'Zomato',
    aliases: ['Blinkit'],
    domain: 'zomato.com',
    companySize: '5,000+ employees',
    location: 'Gurugram, India',
    jobLink: 'https://zomato.com/careers',
    tags: ['Food Delivery', 'Quick Commerce', 'Blinkit', 'Hyperlocal'],
    overview: 'Multinational restaurant aggregator and food delivery company operating Zomato and Blinkit quick-commerce.'
  },
  {
    name: 'Flipkart',
    aliases: ['Flipkart Group'],
    domain: 'flipkart.com',
    companySize: '30,000+ employees (Walmart Subsidiary)',
    location: 'Bengaluru, India',
    jobLink: 'https://flipkartcareers.com',
    tags: ['E-Commerce', 'Supply Chain', 'High Scale', 'Big Billion Days'],
    overview: 'Leading Indian e-commerce marketplace offering millions of products, supply chain logistics, and fintech solutions.'
  },
  {
    name: 'Infosys',
    aliases: ['Infosys Ltd'],
    domain: 'infosys.com',
    companySize: '315,000+ employees (IT Consulting)',
    location: 'Bengaluru, India / Global',
    jobLink: 'https://infosys.com/careers',
    tags: ['IT Services', 'Cloud Consulting', 'Digital Transformation'],
    overview: 'Global leader in next-generation digital services and consulting, enabling clients across 56 countries to navigate digital transformation.'
  },
  {
    name: 'Tata Consultancy Services',
    aliases: ['TCS'],
    domain: 'tcs.com',
    companySize: '600,000+ employees (IT Giant)',
    location: 'Mumbai, India / Global',
    jobLink: 'https://tcs.com/careers',
    tags: ['IT Services', 'Enterprise Software', 'Global Consulting'],
    overview: 'Indian multinational information technology services and consulting company, flagship subsidiary of the Tata Group.'
  }
];

/**
 * Live search helper: Matches local curated database first, and queries Wikipedia OpenSearch
 */
export const searchCompanies = async (query = '') => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const q = query.trim().toLowerCase();

  // 1. Search in local curated database
  const localMatches = POPULAR_COMPANIES.filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(q);
    const domainMatch = c.domain?.toLowerCase().includes(q);
    const aliasMatch = c.aliases?.some((a) => a.toLowerCase().includes(q));
    const tagMatch = c.tags?.some((t) => t.toLowerCase().includes(q));
    return nameMatch || domainMatch || aliasMatch || tagMatch;
  });

  // 2. Fetch live suggestions from Wikipedia API
  try {
    const wikiResults = await searchWikipediaCompanies(query);
    const formattedWiki = wikiResults
      .filter((w) => !localMatches.some((lm) => lm.name.toLowerCase() === w.title.toLowerCase()))
      .map((w) => {
        const cleanDomain = w.title.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
        return {
          name: w.title,
          domain: cleanDomain,
          companySize: 'Wikipedia vCard parsing active',
          location: 'Global',
          jobLink: `https://${cleanDomain}/careers`,
          tags: ['Company', 'Wikipedia'],
          overview: w.snippet || `Wikipedia article for ${w.title}`,
          isWikipediaLive: true
        };
      });

    return [...localMatches, ...formattedWiki].slice(0, 8);
  } catch (e) {
    return localMatches.slice(0, 8);
  }
};

/**
 * Fetch full Wikipedia Infobox vCard intelligence and generate custom fields based on vCard length
 */
export const getCompanyVCardIntelligence = async (companyName) => {
  if (!companyName) return null;
  const wikiData = await fetchCompanyWikipediaDetails(companyName);
  return wikiData;
};
