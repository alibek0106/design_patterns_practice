import { expect } from '@playwright/test';

export interface VerificationStrategy {
    verify(actual: any, expected: any): Promise<void>;
}

export class NameVerificationStrategy implements VerificationStrategy {
    async verify(actual: string, expected: string): Promise<void> {
        expect(actual).toBe(expected);
    }
}

export class PriceVerificationStrategy implements VerificationStrategy {
    async verify(actual: string, expected: string): Promise<void> {
        expect(actual.trim()).toBe(expected);
    }
}

export class ProductVerifier {
    constructor(private strategy: VerificationStrategy) { }

    setStrategy(strategy: VerificationStrategy) {
        this.strategy = strategy;
    }

    async executeStrategy(actual: any, expected: any) {
        await this.strategy.verify(actual, expected);
    }
}