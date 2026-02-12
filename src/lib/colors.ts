/**
 * Generates a dynamic accent color based on a numeric order (1-200+).
 * Uses HSL with the Golden Ratio to ensure diverse, distinct colors.
 */
export function getDomainAccentColor(order: number): string {
    // 60 degrees ensures a clean rotation through the primary and secondary colors
    const hue = (order * 60) % 360;
    return `hsl(${hue}, 80%, 65%)`;
}
