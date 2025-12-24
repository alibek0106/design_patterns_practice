import { Page, Locator } from '@playwright/test';

export interface Command {
    execute(): Promise<void>;
}

export class ClickCommand implements Command {
    constructor(private locator: Locator) { }

    async execute(): Promise<void> {
        await this.locator.click();
    }
}

export class TypeCommand implements Command {
    constructor(private locator: Locator, private value: string) { }

    async execute(): Promise<void> {
        await this.locator.fill(this.value);
    }
}

export class CommandInvoker {
    async executeCommand(command: Command): Promise<void> {
        try {
            await command.execute();
        } catch (error) {
            console.error(`[Command] Failed to execute command`);
            throw error;
        }
    }
}