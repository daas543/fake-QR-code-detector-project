const shortenerDomains = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "cutt.ly"];
const suspiciousWords = ["login", "verify", "secure", "pay", "payment", "account", "urgent"];
const suspiciousExtensions = [".xyz", ".info", ".top", ".click"];
const brandWords = ["paypal", "google", "facebook", "microsoft", "bank", "university"];

const isIpAddress = (hostname) => {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;

  if (!ipv4Pattern.test(hostname)) {
    return false;
  }

  return hostname.split(".").every((part) => {
    const number = Number(part);
    return number >= 0 && number <= 255;
  });
};

const hasTooManyNumbersOrHyphens = (domain) => {
  const numbers = (domain.match(/\d/g) || []).length;
  const hyphens = (domain.match(/-/g) || []).length;

  return numbers >= 4 || hyphens >= 3;
};

const getRiskLevel = (score) => {
  if (score <= 30) {
    return "Low Risk";
  }

  if (score <= 60) {
    return "Medium Risk";
  }

  return "High Risk";
};

const getRecommendation = (level) => {
  if (level === "Low Risk") {
    return "This link looks relatively safe, but always confirm the website before entering personal information.";
  }

  if (level === "Medium Risk") {
    return "Be careful. Verify the sender and website before opening this link or entering sensitive information.";
  }

  return "Do not open this link or enter personal or banking information.";
};

const analyzeUrlRisk = (rawUrl) => {
  let parsedUrl;

  try {
    parsedUrl = new URL(rawUrl.trim());
  } catch (error) {
    const validationError = new Error("Invalid URL. Please provide a complete URL such as https://example.com.");
    validationError.statusCode = 400;
    throw validationError;
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    const validationError = new Error("Invalid URL. Only HTTP and HTTPS links can be analyzed.");
    validationError.statusCode = 400;
    throw validationError;
  }

  const normalizedUrl = parsedUrl.href;
  const hostname = parsedUrl.hostname.toLowerCase();
  const fullUrl = normalizedUrl.toLowerCase();
  const domainWithoutWww = hostname.replace(/^www\./, "");

  let score = 0;
  const issues = [];

  if (parsedUrl.protocol !== "https:") {
    score += 20;
    issues.push("The URL does not use HTTPS.");
  }

  if (shortenerDomains.includes(domainWithoutWww)) {
    score += 20;
    issues.push("The URL uses a known link shortener, which can hide the final destination.");
  }

  const foundSuspiciousWords = suspiciousWords.filter((word) => fullUrl.includes(word));
  if (foundSuspiciousWords.length > 0) {
    score += 15;
    issues.push("The URL contains suspicious words such as login, verify, payment, account, or urgent.");
  }

  if (hostname.length > 40) {
    score += 10;
    issues.push("The domain name is unusually long.");
  }

  if (suspiciousExtensions.some((extension) => hostname.endsWith(extension))) {
    score += 15;
    issues.push("The URL uses a suspicious domain extension.");
  }

  if (isIpAddress(hostname)) {
    score += 25;
    issues.push("The URL uses an IP address instead of a domain name.");
  }

  if (hasTooManyNumbersOrHyphens(hostname)) {
    score += 10;
    issues.push("The domain contains too many numbers or hyphens.");
  }

  const hasBrandWord = brandWords.some((word) => fullUrl.includes(word));
  const hasSuspiciousTerm = suspiciousWords.some((word) => fullUrl.includes(word));
  if (hasBrandWord && hasSuspiciousTerm) {
    score += 25;
    issues.push("The URL may be impersonating a trusted brand while using suspicious wording.");
  }

  const finalScore = Math.min(score, 100);
  const level = getRiskLevel(finalScore);

  if (issues.length === 0) {
    issues.push("No major suspicious URL patterns were detected.");
  }

  return {
    url: normalizedUrl,
    score: finalScore,
    level,
    issues,
    recommendation: getRecommendation(level)
  };
};

module.exports = {
  analyzeUrlRisk
};
