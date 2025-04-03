/**
 * Utility function to combine class names
 */
export function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
} 