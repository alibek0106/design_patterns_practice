import { Browser, chromium, BrowserContext, Page } from '@playwright/test';

export class BrowserSingleton {
    private static instance: BrowserSingleton;
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;

    private constructor() { }

    public static getInstance(): BrowserSingleton {
        if (!BrowserSingleton.instance) {
            BrowserSingleton.instance = new BrowserSingleton();
        }
        return BrowserSingleton.instance;
    }

    public async init(): Promise<void> {
        if (!this.browser) {
            this.browser = await chromium.launch({ headless: false });
            this.context = await this.browser.newContext();
        }
    }

    public async getPage(): Promise<Page> {
        if (!this.context) {
            throw new Error('Browser not initialized. Call init() first.');
        }
        return await this.context.newPage();
    }

    public async close(): Promise<void> {
        await this.browser?.close();
        this.browser = null;
        this.context = null;
    }
}