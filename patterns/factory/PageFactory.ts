import { Page } from '@playwright/test';
import { BasePage } from '../../pages/BasePage';

export class PageFactory {
    static create<T extends BasePage>(type: new (page: Page) => T, page: Page): T {
        return new type(page);
    }
}