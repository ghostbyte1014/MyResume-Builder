import { FAQ_KNOWLEDGE_BASE } from "../constants/faqKnowledgeBase";

const SYNONYMS = {
  word: "docx",
  doc: "docx",
  download: "export",
  save: "export",
  print: "export",
  score: "ats",
  audit: "ats",
  check: "ats",
  upload: "import",
  paste: "import",
  pay: "activate",
  subscription: "activate",
  license: "activate",
  paid: "activate",
  drag: "reorder",
  move: "reorder",
  swap: "reorder",
  style: "template",
  theme: "template",
  color: "template",
  font: "template",
  overflow: "page",
  margin: "page"
};

export function matchFaqQuery(query, knowledgeBase = FAQ_KNOWLEDGE_BASE) {
  if (!query || !query.trim()) return null;

  const rawTokens = query
    .toLowerCase()
    .replace(/[^\w\s]/gi, " ")
    .split(/\s+/)
    .filter(t => t.length > 1);

  if (!rawTokens.length) return null;

  // Expand synonyms
  const expandedTokens = new Set();
  rawTokens.forEach(t => {
    expandedTokens.add(t);
    if (SYNONYMS[t]) expandedTokens.add(SYNONYMS[t]);
  });

  const searchTokens = Array.from(expandedTokens);

  let bestMatch = null;
  let highestScore = 0;

  for (const item of knowledgeBase) {
    let score = 0;
    const itemKeywords = item.keywords || [];
    const questionText = item.question.toLowerCase();
    const answerText = item.answer.toLowerCase();

    searchTokens.forEach(token => {
      // Keyword array match (high weight)
      if (itemKeywords.includes(token)) {
        score += 3;
      }
      // Question title match (medium weight)
      if (questionText.includes(token)) {
        score += 2;
      }
      // Answer body match (low weight)
      if (answerText.includes(token)) {
        score += 1;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  return highestScore > 0 ? bestMatch : null;
}
