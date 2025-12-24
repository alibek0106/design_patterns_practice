import { BasePage } from './BasePage';
import { LogAction } from '../patterns/decorator/PageDecorator';
import { Page, Locator } from '@playwright/test';

export class HomePage extends BasePage {
    // 1. Define properties for Locators
    private readonly signUpLink: Locator;
    private readonly loginLink: Locator;
    private readonly monitorsLink: Locator;

    // Sign Up Modal Elements
    private readonly signUpModal: Locator;
    private readonly signUpUsernameInput: Locator;
    private readonly signUpPasswordInput: Locator;
    private readonly signUpButton: Locator;

    // Login Modal Elements
    private readonly loginModal: Locator;
    private readonly loginUsernameInput: Locator;
    private readonly loginPasswordInput: Locator;
    private readonly loginButton: Locator;

    // Welcome Message
    private readonly welcomeMessage: Locator;

    constructor(page: Page) {
        super(page);

        // 2. Initialize Locators in Constructor
        // Priority 1: getByRole (User facing)
        this.signUpLink = page.getByRole('link', { name: 'Sign up' });
        this.loginLink = page.getByRole('link', { name: 'Log in' });
        this.monitorsLink = page.getByRole('link', { name: 'Monitors' });

        // Modals (DemoBlaze uses IDs heavily, so we wrap them cleanly)
        this.signUpModal = page.locator('#signInModal');
        this.loginModal = page.locator('#logInModal');

        // Inputs
        // Ideally we use getByLabel('Username'), but DemoBlaze lacks <label> tags.
        // So we stick to ID, BUT we hide it here in the constructor.
        this.signUpUsernameInput = page.locator('#sign-username');
        this.signUpPasswordInput = page.locator('#sign-password');

        // Buttons: Use getByRole to ensure it's actually a button
        this.signUpButton = page.getByRole('button', { name: 'Sign up' });

        this.loginUsernameInput = page.locator('#loginusername');
        this.loginPasswordInput = page.locator('#loginpassword');
        this.loginButton = page.getByRole('button', { name: 'Log in' });

        this.welcomeMessage = page.locator('#nameofuser');
    }

    async navigate() {
        await this.page.goto(process.env.BASE_URL!);
    }

    async signUp(username: string, pass: string) {
        await this.signUpLink.click();

        // Using the property, not a string selector
        await this.signUpModal.waitFor({ state: 'visible' });

        await this.signUpUsernameInput.fill(username);
        await this.signUpPasswordInput.fill(pass);

        this.page.once('dialog', async dialog => await dialog.accept());
        await this.signUpButton.click();

        await this.signUpModal.waitFor({ state: 'hidden' });
    }

    async login(username: string, pass: string) {
        await this.loginLink.click();
        await this.loginModal.waitFor({ state: 'visible' });

        await this.loginUsernameInput.fill(username);
        await this.loginPasswordInput.fill(pass);
        await this.loginButton.click();
    }

    async verifyUserLoggedIn(username: string) {
        // Combining locators for specific text check
        await this.welcomeMessage.filter({ hasText: `Welcome ${username}` }).waitFor();
    }

    async goToMonitors() {
        await this.monitorsLink.click();
    }

    async selectProduct(productName: string) {
        // Dynamic locator based on text (Valid use case for inline creation or a helper method)
        await this.page.getByRole('link', { name: productName }).click();
    }
}