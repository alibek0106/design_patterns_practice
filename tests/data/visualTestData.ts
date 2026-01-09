export const ScreenshotNames = {
    // Homepage screenshots
    homepage: {
        full: 'homepage-full.png',
        navbar: 'homepage-navbar.png',
        categories: 'homepage-categories.png',
        productCard: 'homepage-product-card.png',
    },

    // Modals
    modals: {
        login: 'modal-login.png',
        signUp: 'modal-signup.png',
        placeOrder: 'modal-place-order.png',
    },

    // Product page screenshots
    productPage: {
        full: 'product-page-full.png',
        details: 'product-details.png',
        image: 'product-image.png',
        addToCartButton: 'product-add-to-cart-button.png',
        monitorLayout: 'product-monitor-layout.png',
        laptopLayout: 'product-laptop-layout.png',
        phoneLayout: 'product-phone-layout.png',
    },

    // Cart page screenshots
    cartPage: {
        empty: 'cart-empty.png',
        singleItem: 'cart-single-item.png',
        multipleItems: 'cart-multiple-items.png',
        table: 'cart-table.png',
        totalPrice: 'cart-total-price.png',
    },

    // Category views
    categories: {
        monitors: 'category-monitors.png',
        laptops: 'category-laptops.png',
        phones: 'category-phones.png',
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