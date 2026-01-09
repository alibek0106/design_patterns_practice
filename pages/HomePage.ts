import { BasePage } from './BasePage';
import { Page, Locator } from '@playwright/test';

export class HomePage extends BasePage {
    protected readonly pageUrl = '/index.html';

    // Group related locators with comments
    // Navigation Links
    private readonly signUpLink: Locator;
    private readonly loginLink: Locator;
    private readonly monitorsLink: Locator;
    private readonly laptopsLink: Locator;
    private readonly phonesLink: Locator;

    // Sign Up Modal
    private readonly signUpModal: Locator;
    private readonly signUpUsernameInput: Locator;
    private readonly signUpPasswordInput: Locator;
    private readonly signUpButton: Locator;
    private readonly signUpCloseButton: Locator;

    // Login Modal
    private readonly loginModal: Locator;
    private readonly loginUsernameInput: Locator;
    private readonly loginPasswordInput: Locator;
    private readonly loginButton: Locator;
    private readonly loginCloseButton: Locator;

    // User State
    private readonly welcomeMessage: Locator;
    private readonly logoutLink: Locator;

    // Product Catalog
    private readonly productCards: Locator;
    private readonly categoryList: Locator;

    constructor(page: Page) {
        super(page);

        // Navigation
        this.signUpLink = page.getByRole('link', { name: 'Sign up' });
        this.loginLink = page.getByRole('link', { name: 'Log in' });
        this.monitorsLink = page.getByRole('link', { name: 'Monitors' });
        this.laptopsLink = page.getByRole('link', { name: 'Laptops' });
        this.phonesLink = page.getByRole('link', { name: 'Phones' });

        // Sign Up Modal
        this.signUpModal = page.locator('#signInModal');
        this.signUpUsernameInput = page.locator('#sign-username');
        this.signUpPasswordInput = page.locator('#sign-password');
        this.signUpButton = page.getByRole('button', { name: 'Sign up' });
        this.signUpCloseButton = this.signUpModal.getByRole('button', { name: 'Close' });

        // Login Modal
        this.loginModal = page.locator('#logInModal');
        this.loginUsernameInput = page.locator('#loginusername');
        this.loginPasswordInput = page.locator('#loginpassword');
        this.loginButton = page.getByRole('button', { name: 'Log in' });
        this.loginCloseButton = this.loginModal.getByRole('button', { name: 'Close' });

        // User State
        this.welcomeMessage = page.locator('#nameofuser');
        this.logoutLink = page.getByRole('link', { name: 'Log out' });

        // Product Catalog
        this.productCards = page.locator('.card');
        this.categoryList = page.locator('#cat');
    }

    // Fluent API pattern - return 'this' for chaining
    async navigate(): Promise<this> {
        await super.navigate();
        await this.waitForPageLoad();
        return this;
    }

    private async waitForPageLoad(): Promise<void> {
        // Wait for at least one product card to ensure page is loaded
        await this.productCards.first().waitFor({ state: 'visible' });
    }

    // Builder pattern - separate concerns
    async signUp(username: string, password: string): Promise<void> {
        await this.openSignUpModal();
        await this.fillSignUpForm(username, password);
        await this.submitSignUp();
    }

    private async openSignUpModal(): Promise<void> {
        await this.signUpLink.click();
        await this.waitForVisible(this.signUpModal);
    }

    private async fillSignUpForm(username: string, password: string): Promise<void> {
        await this.signUpUsernameInput.fill(username);
        await this.signUpPasswordInput.fill(password);
    }

    private async submitSignUp(): Promise<void> {
        await this.handleDialog(async () => {
            await this.signUpButton.click();
        });
        await this.waitForHidden(this.signUpModal);
    }

    async login(username: string, password: string): Promise<void> {
        await this.openLoginModal();
        await this.fillLoginForm(username, password);
        await this.submitLogin();
    }

    private async openLoginModal(): Promise<void> {
        await this.loginLink.click();
        await this.waitForVisible(this.loginModal);
    }

    private async fillLoginForm(username: string, password: string): Promise<void> {
        await this.loginUsernameInput.fill(username);
        await this.loginPasswordInput.fill(password);
    }

    private async submitLogin(): Promise<void> {
        await this.loginButton.click();
        await this.waitForHidden(this.loginModal);
    }

    async logout(): Promise<void> {
        await this.logoutLink.click();
    }

    async verifyUserLoggedIn(username: string): Promise<void> {
        await this.welcomeMessage
            .filter({ hasText: `Welcome ${username}` })
            .waitFor({ state: 'visible' });
    }

    async isUserLoggedIn(): Promise<boolean> {
        return await this.welcomeMessage.isVisible();
    }

    // Category navigation - Strategy Pattern potential
    async goToCategory(category: 'Monitors' | 'Laptops' | 'Phones'): Promise<void> {
        const categoryMap = {
            'Monitors': this.monitorsLink,
            'Laptops': this.laptopsLink,
            'Phones': this.phonesLink
        };
        await categoryMap[category].click();
        await this.waitForPageLoad();
    }

    async selectProduct(productName: string, category?: 'Monitors' | 'Laptops' | 'Phones'): Promise<void> {
        // Product to category mapping for auto-detection
        const productCategoryMap: Record<string, 'Monitors' | 'Laptops' | 'Phones'> = {
            // Monitors
            'Apple monitor 24': 'Monitors',
            'ASUS Full HD': 'Monitors',
            // Laptops
            'Sony vaio i5': 'Laptops',
            'Sony vaio i7': 'Laptops',
            'MacBook air': 'Laptops',
            'Dell i7 8gb': 'Laptops',
            '2017 Dell 15.6 Inch': 'Laptops',
            'MacBook Pro': 'Laptops',
            // Phones
            'Samsung galaxy s6': 'Phones',
            'Nokia lumia 1520': 'Phones',
            'Nexus 6': 'Phones',
            'Samsung galaxy s7': 'Phones',
            'Iphone 6 32gb': 'Phones',
            'Sony xperia z5': 'Phones',
            'HTC One M9': 'Phones',
        };

        const targetCategory = category || productCategoryMap[productName];

        if (targetCategory) {
            await this.goToCategory(targetCategory);
        }

        await this.page.getByRole('link', { name: productName }).click();
    }

    async getProductCardCount(): Promise<number> {
        return await this.productCards.count();
    }

    // Public accessors for visual testing (avoid breaking encapsulation)
    getNavbar(): Locator {
        return this.page.locator('#navbarExample');
    }

    async showLoginModal(): Promise<Locator> {
        await this.loginLink.click();
        await this.waitForVisible(this.loginModal);
        return this.loginModal;
    }

    getLoginModal(): Locator {
        return this.loginModal;
    }

    async showSignUpModal(): Promise<Locator> {
        await this.signUpLink.click();
        await this.waitForVisible(this.signUpModal);
        return this.signUpModal;
    }

    getSignUpModal(): Locator {
        return this.signUpModal;
    }

    getFirstProductCard(): Locator {
        return this.productCards.first();
    }

    // Visual Testing Methods
    async verifyHomePageVisual(screenshotName: string): Promise<void> {
        await this.verifyVisualBaseline(screenshotName);
    }

    async verifyCategoryListVisual(screenshotName: string): Promise<void> {
        await this.verifyElementVisual(this.categoryList, screenshotName);
    }

    async verifyProductCardsVisual(screenshotName: string): Promise<void> {
        await this.verifyElementVisual(this.productCards.first(), screenshotName);
    }
}