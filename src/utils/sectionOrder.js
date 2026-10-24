export const DEFAULT_SECTION_ORDER = [
  "summary", "experience", "projects", "education", "skills",
  "certifications", "publications", "languages", "references"
];

const LAYOUT_SECTION_ORDERS = {
  portfolio: [
    "summary", "projects", "skills", "experience", "education",
    "certifications", "publications", "languages", "references"
  ],
  academic: [
    "summary", "education", "experience", "publications", "projects",
    "skills", "certifications", "languages", "references"
  ]
};

export function getEffectiveSectionOrder(savedOrder, layoutId) {
  const order = Array.isArray(savedOrder) && savedOrder.length ? savedOrder : DEFAULT_SECTION_ORDER;
  const isDefaultOrder = order.join("|") === DEFAULT_SECTION_ORDER.join("|");
  return isDefaultOrder && LAYOUT_SECTION_ORDERS[layoutId]
    ? [...LAYOUT_SECTION_ORDERS[layoutId]]
    : [...order];
}
