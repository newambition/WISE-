// cn: Utility to merge class names (used by shadcn/ui components)
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
} 