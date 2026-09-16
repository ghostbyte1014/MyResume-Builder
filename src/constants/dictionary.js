export const STRONG_VERBS = [
  "led", "built", "launched", "drove", "designed", "reduced", "increased", "managed", "created",
  "delivered", "implemented", "optimized", "negotiated", "architected", "scaled", "automated",
  "spearheaded", "improved", "generated", "cut", "saved", "grew", "developed", "coordinated",
  "directed", "established", "streamlined", "achieved", "resolved", "mentored"
];

export const WEAK_VERB_MAP = {
  "worked on": ["spearheaded", "engineered", "executed", "architected"],
  "worked": ["collaborated", "contributed", "drove"],
  "helped": ["facilitated", "championed", "supported", "bolstered"],
  "responsible for": ["managed", "over-saw", "directed", "steered"],
  "assisted": ["partnered", "supported", "co-managed"],
  "handled": ["resolved", "orchestrated", "navigated"],
  "did": ["performed", "completed", "executed"],
  "made": ["produced", "fashioned", "devised"],
  "looked after": ["supervised", "maintained", "guarded"]
};

export const VERB_LIKE = new Set([
  ...STRONG_VERBS,
  "work", "working", "help", "helping", "support", "supporting", "provide", "providing",
  "ensure", "ensuring", "maintain", "maintaining", "assist", "assisting", "collaborate",
  "collaborating", "perform", "performing", "handle", "handling", "include", "including",
  "develop", "developing", "manage", "managing", "create", "creating", "build", "building",
  "drive", "driving", "join", "joining", "apply", "applying", "seek", "seeking", "looking",
  "want", "wanted", "required", "preferred", "responsible", "responsibilities", "duties",
]);

export function keywordWeight(token) {
  return VERB_LIKE.has(token) ? 0.5 : 1;
}

export const STOPWORDS = new Set(
  "a about above after again against all am an and any are aren't as at be because been before being below between both but by can't cannot could couldn't did didn't do does doesn't doing don't down during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself let's me more most mustn't my myself no nor not of off on once only or other ought our ours ourselves out over own same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them themselves then there there's these they they'd they'll they're they've this those through to too under until up very was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while who who's whom why why's with won't would wouldn't you you'd you'll you're you've your yours yourself yourselves with within experience years work team strong ability using etc".split(" ")
);
