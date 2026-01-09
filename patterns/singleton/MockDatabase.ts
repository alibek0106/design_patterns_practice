export class MockDatabase {
    private static instance: MockDatabase;

    private collections: Record<string, any[]> = {};

    private isConnected: boolean = false;

    private constructor() {
        this.collections = {};
    }

    public static getInstance(): MockDatabase {
        if (!MockDatabase.instance) {
            MockDatabase.instance = new MockDatabase();
        }
        return MockDatabase.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) return;

        console.log('[MockDB] Connecting to DB cluster...');
        await new Promise(resolve => setTimeout(resolve, 300)); //fake latency
        this.isConnected = true;
        console.log('[MockDB] Connected');
    }

    public async disconnect(): Promise<void> {
        console.log('[MockDB] Disconnecting...');
        this.isConnected = false;
    }

    public async insertOne(collectionName: string, document: any): Promise<void> {
        this.checkConnection();

        if (!this.collections[collectionName]) {
            this.collections[collectionName] = [];
        }

        console.log(`[MockDB] Inserting into '${collectionName}':`, document);
        this.collections[collectionName].push(document);
    }

    public async findOne(collectionName: string, queryKey: string, queryValue: any): Promise<any | null> {
        this.checkConnection();

        const collection = this.collections[collectionName];
        if (!collection) return null;

        console.log(`[MockDB] Searching '${collectionName}' for ${queryKey}=${queryValue}`);
        return collection.find(doc => doc[queryKey] === queryValue);
    }

    public async count(collectionName: string): Promise<number> {
        return this.collections[collectionName]?.length || 0;
    }

    private checkConnection() {
        if (!this.isConnected) {
            throw new Error('[MockDB] Error: Database is not connected!');
        }
    }
}