export const VisualTestConfig = {
    // Screenshot options
    screenshots: {
        maxDiffPixels: 150, // Increased tolerance for dynamic content
        threshold: 0.3, // Increased threshold
        animations: 'disabled' as const,
        fullPage: false,
        timeout: 10000, // Increased timeout for stability
    },

    // Viewport configurations
    viewports: {
        mobile: { width: 375, height: 667 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1920, height: 1080 },
        laptop: { width: 1366, height: 768 },
    },

    // Timeout configurations
    timeouts: {
        screenshot: 10000,
        elementVisible: 5000,
        pageLoad: 30000,
        stability: 2000, // Wait time for element stability
    },

    // Elements to mask in screenshots (dynamic content)
    maskSelectors: {
        carousel: ['.carousel-indicators', '.carousel-control-prev', '.carousel-control-next'],
        timestamps: ['.timestamp', '[data-timestamp]'],
        ads: ['#advertisement', '.ad-container'],
    },
} as const;