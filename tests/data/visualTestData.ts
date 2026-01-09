export const ScreenshotNames = {
    // Homepage screenshots
    homepage: {
        full: 'homepage-full.png',
        mobile: 'homepage-mobile.png',
        tablet: 'homepage-tablet.png',
        navbar: 'homepage-navbar.png',
        categories: 'homepage-categories.png',
        productCard: 'homepage-product-card.png',
        carousel: 'homepage-carousel.png',
        footer: 'homepage-footer.png',
    },

    // Modals
    modals: {
        login: 'modal-login.png',
        loginMobile: 'modal-login-mobile.png',
        signUp: 'modal-signup.png',
        signUpMobile: 'modal-signup-mobile.png',
        placeOrder: 'modal-place-order.png',
    },

    // Product page screenshots
    productPage: {
        full: 'product-page-full.png',
        mobile: 'product-page-mobile.png',
        details: 'product-details.png',
        image: 'product-image.png',
        description: 'product-description.png',
        addToCartButton: 'product-add-to-cart-button.png',
    },

    // Cart page screenshots
    cartPage: {
        full: 'cart-page-full.png',
        mobile: 'cart-page-mobile.png',
        empty: 'cart-empty.png',
        withItems: 'cart-with-items.png',
        table: 'cart-table.png',
        totalPrice: 'cart-total-price.png',
        singleItem: 'cart-single-item.png',
        multipleItems: 'cart-multiple-items.png',
    },

    // Category views
    categories: {
        monitors: 'category-monitors.png',
        laptops: 'category-laptops.png',
        phones: 'category-phones.png',
    },

    // User states
    userStates: {
        loggedIn: 'state-logged-in.png',
        loggedOut: 'state-logged-out.png',
        welcomeMessage: 'state-welcome-message.png',
    },
} as const;

export const TestUsers = {
    visual: {
        username: 'visualtest_user',
        password: 'Test@1234',
    },
    existing: {
        username: 'testuser123',
        password: 'password123',
    },
} as const;

export const TestProducts = {
    monitors: {
        appleMonitor: 'Apple monitor 24',
        asusMonitor: 'ASUS Full HD',
    },
    laptops: {
        sonyVaio: 'Sony vaio i5',
        sonyVaio7: 'Sony vaio i7',
        macBookAir: 'MacBook air',
        dellI7: 'Dell i7 8gb',
        dell2017: '2017 Dell 15.6 Inch',
        macBookPro: 'MacBook Pro',
    },
    phones: {
        samsungGalaxyS6: 'Samsung galaxy s6',
        nokiaLumia: 'Nokia lumia 1520',
        nexus6: 'Nexus 6',
        samsungGalaxyS7: 'Samsung galaxy s7',
        iphone6: 'Iphone 6 32gb',
        sonyXperiaZ5: 'Sony xperia z5',
        htcOneM9: 'HTC One M9',
    },
} as const;

export const OrderDetails = {
    default: {
        name: 'John Doe',
        country: 'USA',
        city: 'New York',
        card: '4111111111111111',
        month: '12',
        year: '2025',
    },
    alternative: {
        name: 'Jane Smith',
        country: 'Canada',
        city: 'Toronto',
        card: '5555555555554444',
        month: '06',
        year: '2026',
    },
} as const;