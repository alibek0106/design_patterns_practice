import { Page } from '@playwright/test';

export function LogAction(originalMethod: any, context: any) {
    return async function (this: any, ...args: any[]) {
        const methodName = String(context.name);
        console.log(`[Decorator] Starting action: ${methodName}`);
        const result = await originalMethod.apply(this, args);

        return result;
    };
}