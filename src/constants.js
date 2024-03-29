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

export {
  relevanceFallacies,
  presumptionFallacies,
  causalFallacies,
  appealFallacies,
  structureFallacies,
  otherFallacies,
  variantReturner,
};
