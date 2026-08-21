/**
 * Gmail REST API Service (Google Workspace Integration)
 * Calls Gmail v1 endpoints using the Google OAuth Access Token.
 */

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

// Base64 URL safe decoder for Gmail message payloads
const decodeBase64Url = (base64UrlStr) => {
  if (!base64UrlStr) return '';
  try {
    const base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return decoded;
  } catch (e) {
    try {
      return atob(base64UrlStr.replace(/-/g, '+').replace(/_/g, '/'));
    } catch (err) {
      return '';
    }
  }
};

/**
 * Helper to extract detailed error messages from Google API responses
 */
const parseGoogleApiError = async (response) => {
  let errorMsg = `Gmail API error (${response.status}): ${response.statusText}`;
  let errorDetail = null;

  try {
    const errorJson = await response.json();
    if (errorJson?.error?.message) {
      errorMsg = errorJson.error.message;
      errorDetail = errorJson.error;
    }
  } catch (e) {
    // Ignore json parse error
  }

  return {
    status: response.status,
    message: errorMsg,
    detail: errorDetail,
    is403: response.status === 403,
    is401: response.status === 401
  };
};

/**
 * Fetch all Gmail labels for the authenticated user
 */
export const fetchGmailLabels = async (accessToken) => {
  if (!accessToken) {
    return { labels: getMockGmailLabels(), isMock: true, error: null };
  }

  try {
    const response = await fetch(`${GMAIL_API_BASE}/labels`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const err = await parseGoogleApiError(response);
      return {
        labels: getMockGmailLabels(),
        isMock: true,
        error: err.message,
        errorInfo: err
      };
    }

    const data = await response.json();
    return { labels: data.labels || [], isMock: false, error: null };
  } catch (error) {
    console.warn('Live Gmail labels fetch failed:', error.message);
    return {
      labels: getMockGmailLabels(),
      error: error.message,
      isMock: true
    };
  }
};

/**
 * Fetch list of Gmail threads matching label and optional search query
 */
export const fetchGmailThreads = async (accessToken, { labelId = 'INBOX', query = '', maxResults = 12 } = {}) => {
  if (!accessToken) {
    return { threads: getMockGmailThreads(labelId, query), isMock: true, error: null };
  }

  try {
    let url = `${GMAIL_API_BASE}/threads?maxResults=${maxResults}`;
    if (labelId && labelId !== 'ALL') {
      url += `&labelIds=${encodeURIComponent(labelId)}`;
    }
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const err = await parseGoogleApiError(response);
      return {
        threads: getMockGmailThreads(labelId, query),
        isMock: true,
        error: err.message,
        errorInfo: err
      };
    }

    const data = await response.json();
    const threadList = data.threads || [];

    // Fetch summary for top threads
    const detailedThreads = await Promise.all(
      threadList.slice(0, 10).map(async (t) => {
        try {
          const detailRes = await fetch(`${GMAIL_API_BASE}/threads/${t.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            return parseThreadSummary(detailData);
          }
        } catch (e) {
          // fallback
        }
        return {
          id: t.id,
          snippet: t.snippet || 'No preview available',
          subject: 'Conversation thread',
          from: 'Recruiter / Sender',
          date: 'Recent',
          messageCount: 1
        };
      })
    );

    return { threads: detailedThreads, isMock: false, error: null };
  } catch (error) {
    console.warn('Live Gmail threads fetch failed:', error.message);
    return {
      threads: getMockGmailThreads(labelId, query),
      error: error.message,
      isMock: true
    };
  }
};

/**
 * Fetch full thread details with decoded messages
 */
export const fetchThreadDetails = async (accessToken, threadId) => {
  if (!accessToken || threadId.startsWith('mock_')) {
    const mock = getMockGmailThreads('INBOX', '').find((t) => t.id === threadId);
    return mock ? mock : getMockGmailThreads('INBOX', '')[0];
  }

  try {
    const response = await fetch(`${GMAIL_API_BASE}/threads/${threadId}?format=full`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch thread details: ${response.status}`);
    }

    const data = await response.json();
    return parseFullThread(data);
  } catch (error) {
    console.error('Error fetching full thread:', error);
    throw error;
  }
};

/**
 * Parse metadata headers from Gmail thread
 */
const parseThreadSummary = (threadData) => {
  const firstMsg = threadData.messages?.[0] || {};
  const headers = firstMsg.payload?.headers || [];
  
  const getHeader = (name) => headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  return {
    id: threadData.id,
    snippet: threadData.snippet || firstMsg.snippet || '',
    subject: getHeader('Subject') || '(No Subject)',
    from: getHeader('From') || 'Unknown Sender',
    date: getHeader('Date') ? new Date(getHeader('Date')).toLocaleDateString() : 'Recent',
    messageCount: threadData.messages?.length || 1,
    messages: (threadData.messages || []).map(parseMessage)
  };
};

/**
 * Parse single message payload
 */
const parseMessage = (msg) => {
  const headers = msg.payload?.headers || [];
  const getHeader = (name) => headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  let body = '';
  if (msg.payload?.body?.data) {
    body = decodeBase64Url(msg.payload.body.data);
  } else if (msg.payload?.parts) {
    const textPart = msg.payload.parts.find((p) => p.mimeType === 'text/plain') || msg.payload.parts.find((p) => p.mimeType === 'text/html');
    if (textPart?.body?.data) {
      body = decodeBase64Url(textPart.body.data);
    }
  }

  return {
    id: msg.id,
    snippet: msg.snippet,
    from: getHeader('From'),
    to: getHeader('To'),
    subject: getHeader('Subject'),
    date: getHeader('Date'),
    body: body || msg.snippet || 'No message content body.'
  };
};

const parseFullThread = (threadData) => {
  const summary = parseThreadSummary(threadData);
  return {
    ...summary,
    messages: (threadData.messages || []).map(parseMessage)
  };
};

// ==========================================
// Rich Mock Datasets for Fallback
// ==========================================

export const getMockGmailLabels = () => [
  { id: 'INBOX', name: 'INBOX', type: 'system', messagesTotal: 24 },
  { id: 'STARRED', name: 'STARRED', type: 'system', messagesTotal: 6 },
  { id: 'IMPORTANT', name: 'IMPORTANT', type: 'system', messagesTotal: 9 },
  { id: 'SENT', name: 'SENT', type: 'system', messagesTotal: 18 },
  { id: 'lbl_interviews', name: '💼 Interviews 2026', type: 'user', messagesTotal: 14 },
  { id: 'lbl_offers', name: '🎉 Job Offers', type: 'user', messagesTotal: 3 },
  { id: 'lbl_recruiters', name: '📩 Recruiter Outreach', type: 'user', messagesTotal: 19 }
];

export const getMockGmailThreads = (labelId = '', query = '') => {
  const allMock = [
    {
      id: 'mock_stripe_1',
      subject: 'Stripe — Invitation to Technical Architecture Discussion',
      from: 'Sarah Jenkins <sarah.j@stripe.example.com>',
      date: 'Aug 19, 2026',
      snippet: 'Hi there! The engineering team was very impressed with your background. We would love to schedule a 60-minute technical architecture round...',
      messageCount: 3,
      messages: [
        {
          id: 'msg_s1',
          from: 'Sarah Jenkins <sarah.j@stripe.example.com>',
          to: 'me',
          subject: 'Stripe — Invitation to Technical Architecture Discussion',
          date: 'Aug 19, 2026, 10:15 AM',
          body: `Hi there,\n\nThanks for your patience while our engineering team reviewed your portfolio. We are excited to invite you to the Technical Architecture and Distributed Systems round for the Senior Full Stack Engineer role.\n\nYou will be meeting with David Chen (Staff Platform Engineer).\n\nPlease select a convenient slot via our scheduling portal.\n\nBest regards,\nSarah Jenkins\nSenior Technical Recruiter | Stripe`
        }
      ]
    },
    {
      id: 'mock_google_1',
      subject: 'Google Careers: Next Steps for Staff Frontend Architect',
      from: 'Alex Rivera <alex.rivera@google.example.com>',
      date: 'Aug 18, 2026',
      snippet: 'Congratulations on clearing the preliminary coding screening! We are preparing the virtual on-site interview packet...',
      messageCount: 4,
      messages: [
        {
          id: 'msg_g1',
          from: 'Alex Rivera <alex.rivera@google.example.com>',
          to: 'me',
          subject: 'Google Careers: Next Steps for Staff Frontend Architect',
          date: 'Aug 18, 2026, 3:30 PM',
          body: `Hello,\n\nGreat news! Your interviewers from the preliminary round gave strong positive feedback regarding your system design depth and browser internals knowledge.\n\nWe would now like to move forward with the 4-round virtual on-site interview series.\n\nAttached is the interview preparation guide.\n\nCheers,\nAlex Rivera\nStaff Talent Partner, Google Chrome & Core Systems`
        }
      ]
    },
    {
      id: 'mock_datadog_1',
      subject: 'Offer Letter — Datadog Senior Software Engineer (Core Observability)',
      from: 'Marcus Vance <m.vance@datadog.example.com>',
      date: 'Aug 16, 2026',
      snippet: 'We are thrilled to extend an official offer to join Datadog! Please review the attached compensation breakdown and benefits package...',
      messageCount: 5,
      messages: [
        {
          id: 'msg_d1',
          from: 'Marcus Vance <m.vance@datadog.example.com>',
          to: 'me',
          subject: 'Offer Letter — Datadog Senior Software Engineer (Core Observability)',
          date: 'Aug 16, 2026, 5:45 PM',
          body: `Dear candidate,\n\nOn behalf of Datadog, it is my absolute pleasure to formally extend an offer of employment for the Senior Software Engineer role on the Core Observability team!\n\nBase Salary: $175,000\nEquity (RSUs): $120,000 / 4 yrs\nSign-on Bonus: $20,000\n\nPlease find the official docu-sign link attached.\n\nWarmly,\nMarcus Vance | Head of Talent, Datadog`
        }
      ]
    },
    {
      id: 'mock_netflix_1',
      subject: 'Netflix Interview Confirmation: Culture & Technical Deep Dive',
      from: 'Elena Rostova <erostova@netflix.example.com>',
      date: 'Aug 14, 2026',
      snippet: 'Your upcoming conversation with the UI Platform Engineering Director has been confirmed for Friday at 2:00 PM PST...',
      messageCount: 2,
      messages: [
        {
          id: 'msg_n1',
          from: 'Elena Rostova <erostova@netflix.example.com>',
          to: 'me',
          subject: 'Netflix Interview Confirmation: Culture & Technical Deep Dive',
          date: 'Aug 14, 2026, 11:00 AM',
          body: `Hi,\n\nConfirming your upcoming session for the Senior UI Engineer (Streaming Experience) role.\n\nInterviewer: Kenji Sato (Engineering Director)\nFocus: High throughput rendering, streaming state synchronization, and Netflix Culture memo discussion.\n\nBest,\nElena Rostova | Talent Acquisition`
        }
      ]
    }
  ];

  if (!query) return allMock;
  const q = query.toLowerCase();
  return allMock.filter(
    (t) =>
      t.subject.toLowerCase().includes(q) ||
      t.from.toLowerCase().includes(q) ||
      t.snippet.toLowerCase().includes(q)
  );
};
