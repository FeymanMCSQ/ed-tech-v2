/**
 * Generates a dynamic accent color based on a numeric order (1-200+).
 * Uses HSL with the Golden Ratio to ensure diverse, distinct colors.
 */
export function getDomainAccentColor(order: number): string {
    // 137.5 is the golden angle in degrees
    const hue = (order * 137.5) % 360;
    return `hsl(${hue}, 80%, 65%)`;
}
