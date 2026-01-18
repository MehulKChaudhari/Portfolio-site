import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = 'MehulKChaudhari';
const OUTPUT_FILE = path.join(__dirname, '../public/data/github-prs.json');
const CACHE_FILE = path.join(__dirname, '../.github-cache.json');
const FEATURED_CONFIG = path.join(__dirname, '../src/data/featured-prs.json');

const RATE_LIMIT_DELAY = 1100;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 403) {
        const resetTime = response.headers.get('x-ratelimit-reset');
        if (resetTime) {
          const waitTime = (parseInt(resetTime) * 1000 - Date.now()) + 5000;
          console.log(`Rate limit hit. Waiting ${Math.ceil(waitTime / 1000)}s...`);
          await sleep(waitTime);
          continue;
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await sleep(2000 * (i + 1));
    }
  }
}

function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch (error) {
    console.warn('Failed to load cache:', error.message);
  }
  return { prs: {}, lastFetch: null };
}

function loadFeaturedConfig() {
  try {
    if (fs.existsSync(FEATURED_CONFIG)) {
      const config = JSON.parse(fs.readFileSync(FEATURED_CONFIG, 'utf8'));
      const featuredMap = {};
      config.forEach(item => {
        featuredMap[item.id] = {
          featured: true,
          featured_order: item.featured_order
        };
      });
      return featuredMap;
    }
  } catch (error) {
    console.warn('Failed to load featured PRs config:', error.message);
  }
  return {};
}

function saveCache(cache) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Failed to save cache:', error.message);
  }
}

async function fetchAllPRs() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
  };

  let allPRs = [];
  let page = 1;
  let hasMore = true;

  console.log('Fetching PR list...');

  while (hasMore) {
    const url = `https://api.github.com/search/issues?q=type:pr+author:${GITHUB_USERNAME}&per_page=100&page=${page}`;
    const response = await fetchWithRetry(url, { headers });
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      allPRs = [...allPRs, ...data.items];
      console.log(`Fetched page ${page}: ${data.items.length} PRs (total: ${allPRs.length})`);
      page++;
      hasMore = data.items.length === 100;
      await sleep(RATE_LIMIT_DELAY);
    } else {
      hasMore = false;
    }
  }

  return allPRs;
}

async function fetchPRDetails(prUrl, headers) {
  const response = await fetchWithRetry(prUrl, { headers });
  return response.json();
}

async function main() {
  console.log('Starting GitHub PR data fetch...');
  
  if (!GITHUB_TOKEN) {
    console.warn('Warning: GITHUB_TOKEN not set. Rate limits will be strict (60 req/hour).');
  }

  const cache = loadCache();
  const featuredConfig = loadFeaturedConfig();
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
  };

  const allPRs = await fetchAllPRs();
  console.log(`\nTotal PRs found: ${allPRs.length}`);

  const detailedPRs = [];
  let fetchedCount = 0;
  let cachedCount = 0;

  for (const pr of allPRs) {
    const prNumber = pr.number;
    const repoName = pr.repository_url.split('/').slice(-1)[0];
    const repoFullName = pr.repository_url.split('/').slice(-2).join('/');
    const repoOwner = pr.repository_url.split('/').slice(-2)[0];
    const cacheKey = `${repoName}#${prNumber}`;
    
    // Skip PRs to own repositories
    if (repoOwner.toLowerCase() === GITHUB_USERNAME.toLowerCase()) {
      continue;
    }
    
    if (cache.prs[cacheKey] && cache.prs[cacheKey].updated_at === pr.updated_at) {
      const cachedPR = { ...cache.prs[cacheKey] };
      const featuredInfo = featuredConfig[pr.id];
      if (featuredInfo) {
        cachedPR.featured = featuredInfo.featured;
        cachedPR.featured_order = featuredInfo.featured_order;
      } else {
        cachedPR.featured = false;
        cachedPR.featured_order = undefined;
      }
      detailedPRs.push(cachedPR);
      cachedCount++;
      continue;
    }

    console.log(`Fetching details for ${cacheKey}...`);
    
    try {
      const details = await fetchPRDetails(pr.pull_request.url, headers);
      
      const prData = {
        id: pr.id,
        number: prNumber,
        title: details.title,
        description: details.body?.trim() || '',
        repository: repoName,
        repository_full_name: repoFullName,
        repository_owner: repoOwner,
        html_url: details.html_url,
        state: details.state,
        merged: details.merged_at ? true : false,
        created_at: details.created_at,
        updated_at: details.updated_at,
        closed_at: details.closed_at,
        merged_at: details.merged_at,
        additions: details.additions || 0,
        deletions: details.deletions || 0,
        changed_files: details.changed_files || 0,
        commits: details.commits || 0,
        comments: details.comments || 0,
        labels: details.labels?.map(l => l.name) || [],
        user: {
          login: details.user?.login,
          avatar_url: details.user?.avatar_url
        },
        featured: featuredConfig[pr.id]?.featured || false,
        featured_order: featuredConfig[pr.id]?.featured_order
      };

      detailedPRs.push(prData);
      cache.prs[cacheKey] = prData;
      fetchedCount++;
      
      await sleep(RATE_LIMIT_DELAY);
    } catch (error) {
      console.error(`Failed to fetch ${cacheKey}:`, error.message);
      if (cache.prs[cacheKey]) {
        const cachedPR = { ...cache.prs[cacheKey] };
        const featuredInfo = featuredConfig[pr.id];
        if (featuredInfo) {
          cachedPR.featured = featuredInfo.featured;
          cachedPR.featured_order = featuredInfo.featured_order;
        } else {
          cachedPR.featured = false;
          cachedPR.featured_order = undefined;
        }
        detailedPRs.push(cachedPR);
      }
    }
  }

  console.log(`\nFetched: ${fetchedCount} new/updated PRs`);
  console.log(`Cached: ${cachedCount} PRs`);

  detailedPRs.sort((a, b) => new Date(b.merged_at) - new Date(a.merged_at));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(detailedPRs, null, 2));

  cache.lastFetch = new Date().toISOString();
  saveCache(cache);

  console.log(`\n✓ Saved ${detailedPRs.length} PRs to ${OUTPUT_FILE}`);
  console.log(`✓ Cache updated at ${cache.lastFetch}`);
  console.log(`\nTo feature PRs on home page, edit src/data/featured-prs.json`);
}

main().catch(console.error);

