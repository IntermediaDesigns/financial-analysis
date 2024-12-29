import { Account, Client, Databases, ID, Models } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Initialize services
const account = new Account(client);
const databases = new Databases(client);

// Collection and Database IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTIONS = {
    ARTICLES: 'articles',
    FINANCIAL_DATA: 'financial_data',
    USER_PREFERENCES: 'user_preferences'
} as const;

// Type definitions for our collections
export interface Article {
    $id?: string;
    $createdAt?: string;
    publisher: string;
    author: string;
    date: string;
    title: string;
    body: string;
    sector: string;
    sentiment?: number;
    processed: boolean;
}

export interface FinancialData {
    $id?: string;
    $createdAt?: string;
    symbol: string;
    dataType: string;
    value: number;
    timestamp: string;
    source: string;
}

export interface UserPreferences {
    $id?: string;
    $createdAt?: string;
    userId: string;
    sectors: string[];
    symbols: string[];
    notificationPreferences: {
        email: boolean;
        push: boolean;
    };
}

// Authentication functions
export const createUserAccount = async (
    email: string,
    password: string,
    name: string
): Promise<Models.User<Models.Preferences>> => {
    try {
        const user = await account.create(ID.unique(), email, password, name);
        await loginUser(email, password);
        return user;
    } catch (error) {
        console.error("Account creation error:", error);
        throw error;
    }
};

export const loginUser = async (
    email: string,
    password: string
): Promise<{ session: Models.Session; user: Models.User<Models.Preferences> }> => {
    try {
        const session = await account.createSession(email, password);
        const user = await account.get();
        return { session, user };
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const getCurrentUser = async (): Promise<Models.User<Models.Preferences>> => {
    try {
        return await account.get();
    } catch (error) {
        console.error("Get current user error:", error);
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};

// Database helper functions
export const createArticle = async (article: Omit<Article, '$id' | '$createdAt'>): Promise<Models.Document> => {
    return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ARTICLES,
        ID.unique(),
        article
    );
};

export const createFinancialData = async (data: Omit<FinancialData, '$id' | '$createdAt'>): Promise<Models.Document> => {
    return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.FINANCIAL_DATA,
        ID.unique(),
        data
    );
};

export const updateUserPreferences = async (
    userId: string,
    preferences: Partial<Omit<UserPreferences, '$id' | '$createdAt' | 'userId'>>
): Promise<Models.Document> => {
    return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USER_PREFERENCES,
        userId,
        preferences
    );
};

export { client, account, databases, ID };
