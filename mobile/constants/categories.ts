export type CategorySlug =
  | 'waste_recycling'
  | 'upcycling_diy'
  | 'sustainable_living'
  | 'food_composting'
  | 'green_tech'
  | 'community_events';

export const CATEGORIES: { slug: CategorySlug; label: string }[] = [
  { slug: 'waste_recycling',    label: 'Waste & Recycling' },
  { slug: 'upcycling_diy',      label: 'Upcycling & DIY' },
  { slug: 'sustainable_living', label: 'Sustainable Living Tips' },
  { slug: 'food_composting',    label: 'Food & Composting' },
  { slug: 'green_tech',         label: 'Green Tech & Innovation' },
  { slug: 'community_events',   label: 'Community & Events' },
];