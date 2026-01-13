/**
 * API Endpoints for Demoblaze
 * Used for network assertions in visual tests
 */
export const ApiEndpoints = {
    baseUrl: process.env.API_BASE_URL || 'https://api.demoblaze.com',
    product: {
        view: '/view',
        addToCart: '/addtocart'
    },
    cart: {
        viewCart: '/viewcart',
        deleteItem: '/deleteitem'
    }
} as const;
