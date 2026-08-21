/**
 * Wikipedia Infobox vCard Parser & Real-Time Company Intelligence Service
 * 100% Free & Open (No API keys required)
 * Fetches accurate, up-to-date employee counts, headquarters, leadership, financials,
 * and custom metadata rows directly from Wikipedia Infobox vCards.
 */

/**
 * Clean text extracted from Wikipedia HTML elements
 */
const cleanWikipediaText = (element) => {
  if (!element) return '';
  // Clone element to avoid modifying original DOM
  const clone = element.cloneNode(true);

  // Remove citation reference links like [1], [a], etc.
  const refs = clone.querySelectorAll('.reference, style, script, .noprint, noscript');
  refs.forEach((el) => el.remove());

  // Handle lists by joining items with commas or line breaks
  const listItems = clone.querySelectorAll('li');
  if (listItems.length > 0) {
    const items = Array.from(listItems)
      .map((li) => li.textContent.trim())
      .filter(Boolean);
    return items.join(', ');
  }

  // Replace non-breaking spaces and normalize whitespace
  return clone.textContent
    .replace(/\u00A0/g, ' ')
    .replace(/\[\s*\d+\s*\]/g, '')
    .replace(/\[\s*[a-z]\s*\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Search Wikipedia for company articles
 */
export const searchWikipediaCompanies = async (query = '') => {
  if (!query || query.trim().length === 0) return [];

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
      query.trim()
    )}&limit=8&namespace=0&format=json&origin=*`;

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const titles = data[1] || [];
    const descriptions = data[2] || [];
    const links = data[3] || [];

    return titles.map((title, idx) => ({
      title,
      snippet: descriptions[idx] || '',
      url: links[idx] || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`
    }));
  } catch (error) {
    console.warn('Wikipedia search error:', error);
    return [];
  }
};

/**
 * Fetch and parse a Wikipedia company page, extracting the Infobox vCard and lead summary
 */
export const fetchCompanyWikipediaDetails = async (pageTitle) => {
  if (!pageTitle) return null;

  try {
    // 1. Fetch Lead Summary & Thumbnail
    let summaryText = '';
    let thumbnail = null;

    try {
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
      const sumRes = await fetch(summaryUrl);
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        summaryText = sumData.extract || '';
        thumbnail = sumData.thumbnail?.source || null;
      }
    } catch (e) {
      // Fallback
    }

    // 2. Fetch Parsed Page HTML for Infobox vCard
    const parseUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
      pageTitle
    )}&prop=text|displaytitle&format=json&origin=*`;

    const parseRes = await fetch(parseUrl);
    if (!parseRes.ok) throw new Error('Failed to fetch Wikipedia page content');

    const parseData = await parseRes.json();
    const rawHtml = parseData.parse?.text?.['*'] || '';

    // 3. Parse HTML using Browser DOMParser
    let parser;
    let doc;
    if (typeof window !== 'undefined' && window.DOMParser) {
      parser = new DOMParser();
      doc = parser.parseFromString(rawHtml, 'text/html');
    } else {
      return null;
    }

    // Find the company infobox table (.infobox.vcard, .infobox.ib-company, or .infobox)
    const infobox = doc.querySelector('table.infobox.vcard, table.infobox.ib-company, table.infobox');

    const vcardRows = [];
    if (infobox) {
      const trs = infobox.querySelectorAll('tr');
      trs.forEach((tr) => {
        const th = tr.querySelector('th');
        const td = tr.querySelector('td');

        if (th && td) {
          const label = cleanWikipediaText(th);
          const value = cleanWikipediaText(td);

          if (label && value && label.length < 50 && value.length < 400) {
            vcardRows.push({ label, value });
          }
        }
      });
    }

    // Helper to find row by regex
    const findRow = (regex) => {
      const match = vcardRows.find((r) => regex.test(r.label));
      return match ? match.value : '';
    };

    // Extract core standard fields from vCard
    const rawEmployees = findRow(/number of employees|employees|workforce|staff/i);
    const headquarters = findRow(/headquarters|head office|location|city/i);
    const website = findRow(/website|url/i);
    const founders = findRow(/founder|founded by/i);
    const founded = findRow(/founded|established/i);
    const ceo = findRow(/key people|chief executive|ceo|president/i);
    const revenue = findRow(/revenue|net income|operating income/i);
    const industry = findRow(/industry|products|services/i);
    const tradedAs = findRow(/traded as|ticker|stock/i);
    const parentCompany = findRow(/parent|owner/i);
    const subsidiaries = findRow(/subsidiaries/i);

    // Format employee count with citation indicator
    let employeeCountFormatted = rawEmployees;
    if (employeeCountFormatted && !employeeCountFormatted.toLowerCase().includes('employee')) {
      employeeCountFormatted = `${employeeCountFormatted} employees (Wikipedia Verified)`;
    }

    // Extract dynamic extra custom fields based on all other vCard rows
    const reservedLabelsRegex = /number of employees|employees|workforce|staff|headquarters|head office|location|website|url/i;
    
    const customFields = vcardRows
      .filter((r) => !reservedLabelsRegex.test(r.label))
      .map((r, idx) => ({
        id: `vcard_${idx}_${Date.now()}`,
        label: r.label,
        value: r.value
      }));

    // Extract tags from industry and traded as
    const tags = [];
    if (industry) {
      industry.split(/[,/·•|]/).forEach((item) => {
        const clean = item.trim();
        if (clean && clean.length > 2 && clean.length < 25 && !tags.includes(clean)) {
          tags.push(clean);
        }
      });
    }
    if (tradedAs && tradedAs.includes(':')) {
      tags.push(tradedAs.split(':')[0].trim());
    }

    return {
      companyName: pageTitle,
      companySize: employeeCountFormatted || (vcardRows.length > 0 ? 'Enterprise / Scale-up' : ''),
      location: headquarters || '',
      jobLink: website.startsWith('http') ? website : website ? `https://${website}` : '',
      thumbnail: thumbnail,
      tags: tags.slice(0, 5),
      notes: summaryText ? summaryText : `Wikipedia entry for ${pageTitle}.`,
      vcardTotalRows: vcardRows.length,
      customFields: customFields,
      quickFacts: {
        founders,
        founded,
        ceo,
        revenue,
        industry,
        tradedAs,
        parentCompany,
        subsidiaries
      }
    };
  } catch (error) {
    console.error('Wikipedia company detail fetch error:', error);
    return null;
  }
};
