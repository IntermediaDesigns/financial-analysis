"use server";

import { Account, Client, Databases, ID, Models } from "node-appwrite";
import { cookies } from "next/headers";
import {
  DATABASE_ID,
  COLLECTIONS,
  Article,
  FinancialData,
  UserPreferences,
} from "./appwrite";

// Helper function to generate valid Appwrite user IDs
const generateValidUserId = (prefix: string = "user"): string => {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9]/g, "");
  const randomStr = Math.random().toString(36).substring(2, 8);
  const userId = `${cleanPrefix}${randomStr}`;
  return userId.substring(0, 36);
};

// Initialize the admin client for server-side operations
async function createAdminClient() {
  if (
    !process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    !process.env.NEXT_PUBLIC_APPWRITE_PROJECT ||
    !process.env.NEXT_APPWRITE_KEY
  ) {
    throw new Error("Missing Appwrite configuration");
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
    .setKey(process.env.NEXT_APPWRITE_KEY);

  return {
    account: new Account(client),
    databases: new Databases(client),
  };
}

// Initialize the session client for authenticated user operations
async function createSessionClient() {
  if (
    !process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
    !process.env.NEXT_PUBLIC_APPWRITE_PROJECT
  ) {
    throw new Error("Missing Appwrite configuration");
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(
    `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
  );

  if (!sessionCookie?.value) {
    throw new Error("No session found");
  }

  client.setSession(sessionCookie.value);

  return {
    account: new Account(client),
    databases: new Databases(client),
  };
}

// Authentication functions
export async function createUserAccount(
  email: string,
  password: string,
  name: string
): Promise<Models.User<Models.Preferences>> {
  try {
    const { account } = await createAdminClient();
    const validUserId = generateValidUserId(name.split(" ")[0].toLowerCase());
    return await account.create(validUserId, email, password, name);
  } catch (err) {
    console.error("Account creation error:", err);
    throw err;
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<Models.Session> {
  try {
    const { account } = await createAdminClient();
    return await account.createSession(email, password);
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

export async function getLoggedInUser(): Promise<Models.User<Models.Preferences> | null> {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (err) {
    console.error("Get user error:", err);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
  } catch (err) {
    console.error("Logout error:", err);
    throw err;
  }
}

// Database helper functions
export async function createArticle(
  article: Omit<Article, "$id" | "$createdAt">
): Promise<Models.Document> {
  const { databases } = await createSessionClient();
  return await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ARTICLES,
    ID.unique(),
    article
  );
}

export async function createFinancialData(
  data: Omit<FinancialData, "$id" | "$createdAt">
): Promise<Models.Document> {
  const { databases } = await createSessionClient();
  return await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.FINANCIAL_DATA,
    ID.unique(),
    data
  );
}

export async function updateUserPreferences(
  userId: string,
  preferences: Partial<Omit<UserPreferences, "$id" | "$createdAt" | "userId">>
): Promise<Models.Document> {
  const { databases } = await createSessionClient();
  return await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.USER_PREFERENCES,
    userId,
    preferences
  );
}
