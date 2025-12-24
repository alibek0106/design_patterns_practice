import { Page } from '@playwright/test';
import { UserData } from '../builder/UserBuilder';

export abstract class AbstractTestFlow {
    protected page: Page;
    protected user: UserData;

    constructor(page: Page, user: UserData) {
        this.page = page;
        this.user = user;
    }

    // The template method - Final 
    public async executeFlow(): Promise<void> {
        await this.setup();
        await this.performActions();
        await this.verifyResults();
        await this.teardown();
    }

    protected abstract setup(): Promise<void>;
    protected abstract performActions(): Promise<void>;
    protected abstract verifyResults(): Promise<void>;
    protected async teardown(): Promise<void> { }
}