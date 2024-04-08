// Relevance Fallacies
const relevanceFallacies = [
  "Ad Hominem",
  "Strawman",
  "Red Herring",
  "Tu Quoque",
  "Appeal to Emotion",
];

const presumptionFallacies = [
  "False Dilemma",
  "False Cause",
  "Begging the Question",
];

// Causal Fallacies
const causalFallacies = [
  "Slippery Slope",
  "Post Hoc Ergo Propter Hoc",
  "Hasty Generalization",
];

// Appeal Fallacies
const appealFallacies = [
  "Appeal to Authority",
  "Appeal to Ignorance",
  "Appeal to Nature",
  "Appeal to Tradition",
];

// Structure Fallacies
const structureFallacies = [
  "Circular Reasoning",
  "Composition and Division",
  "Equivocation",
];

// Other Fallacies
const otherFallacies = [
  "No True Scotsman",
  "Genetic Fallacy",
  "Bandwagon Fallacy",
];

// Variant Returner
function variantReturner(fallacyName) {
  if (relevanceFallacies.includes(fallacyName)) {
    return "relevance";
  } else if (presumptionFallacies.includes(fallacyName)) {
    return "presumption";
  } else if (causalFallacies.includes(fallacyName)) {
    return "causal";
  } else if (appealFallacies.includes(fallacyName)) {
    return "appeal";
  } else if (structureFallacies.includes(fallacyName)) {
    return "structure";
  } else if (otherFallacies.includes(fallacyName)) {
    return "other";
  } else {
    return "unknown";
  }
}

const SELECT_KEYS = {
  newest: "newest",
  oldest: "oldest",
  highest_score: "highest_score",
  most_arguments: "most_arguments",
};

const FALLACIES = [
  { label: "Ad Hominem", value: "ad-hominem" },
  { label: "Strawman", value: "strawman" },
  { label: "False Dilemma", value: "false-dilemma" },
  { label: "Slippery Slope", value: "slippery-slope" },
  { label: "Appeal to Authority", value: "appeal-to-authority" },
  { label: "Appeal to Ignorance", value: "appeal-to-ignorance" },
  { label: "Circular Reasoning", value: "circular-reasoning" },
  { label: "Hasty Generalization", value: "hasty-generalization" },
  { label: "Post Hoc Ergo Propter Hoc", value: "post-hoc-ergo-propter-hoc" },
  { label: "Red Herring", value: "red-herring" },
  { label: "Appeal to Emotion", value: "appeal-to-emotion" },
  { label: "Tu Quoque", value: "tu-quoque" },
  { label: "False Cause", value: "false-cause" },
  { label: "Begging the Question", value: "begging-the-question" },
  { label: "Appeal to Nature", value: "appeal-to-nature" },
  { label: "Composition and Division", value: "composition-and-division" },
  { label: "No True Scotsman", value: "no-true-scotsman" },
  { label: "Genetic Fallacy", value: "genetic-fallacy" },
  { label: "Equivocation", value: "equivocation" },
  { label: "Appeal to Tradition", value: "appeal-to-tradition" },
  { label: "Bandwagon Fallacy", value: "bandwagon-fallacy" },
];

export {
  relevanceFallacies,
  presumptionFallacies,
  causalFallacies,
  appealFallacies,
  structureFallacies,
  otherFallacies,
  SELECT_KEYS,
  variantReturner,
  FALLACIES,
};
