export const VisualTestConfig = {
    // Viewport configurations for responsive testing
    viewports: {
        mobile: { width: 375, height: 667 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1920, height: 1080 },
        laptop: { width: 1366, height: 768 },
    },

    // Elements to mask in screenshots (dynamic content)
    maskSelectors: [
        '.carousel-indicators',
        '.carousel-control-prev',
        '.carousel-control-next',
    ],
} as const;