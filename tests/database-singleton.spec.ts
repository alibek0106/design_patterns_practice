import { test, expect } from '@playwright/test';
import { MockDatabase } from '../patterns/singleton/MockDatabase';
import { UserBuilder } from '../patterns/builder/UserBuilder';

test.describe('Singleton Pattern & NoSQL Simulation', () => {
    const db1 = MockDatabase.getInstance();
    const db2 = MockDatabase.getInstance();

    test.beforeAll(async () => {
        await db1.connect();
    });

    test.afterAll(async () => {
        await db1.disconnect();
    });

    test('Verify Singleton Identity', async () => {
        // Are those two variables pointing to the exact same memory address?
        expect.soft(db1).toBe(db2);
    });

    test('Verify Data Persistence across Instances', async () => {
        // Create a random user
        const newUser = UserBuilder.generateRandom();
        const collection = 'users';

        // Insert using db1
        await db1.insertOne(collection, {
            username: newUser.username,
            role: 'admin',
            isActive: true
        });

        // Retrieve using db2
        const result = await db2.findOne(collection, 'username', newUser.username);

        expect.soft(result).not.toBeNull();
        expect.soft(result.username).toBe(newUser.username);
        expect.soft(result.role).toBe('admin');
    });

    test('Verify NoSQL functionality', async () => {
        await db1.insertOne('products', { id: 101, name: 'Monitor' });
        await db1.insertOne('products', { id: 102, name: 'Keyboard' });

        const count = await db2.count('products');
        expect(count).toBeGreaterThanOrEqual(2);

    });
});