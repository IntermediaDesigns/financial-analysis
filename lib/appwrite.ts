// lib/appwrite.ts
import { Client, Account, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
export const account = new Account(client);
export const databases = new Databases(client);

// Database and Collection IDs
export const DATABASES = {
  MAIN: "main_database",
};

export const COLLECTIONS = {
  WATCHLIST: "watchlist",
  ALERTS: "alerts",
  NEWS: "news",
};

// Helper functions for authentication
export const createUserAccount = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const response = await account.create(ID.unique(), email, password, name);

    if (response) {
      // Login user after successful account creation
      return await loginUser(email, password);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    return await account.createEmailSession(email, password);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const logout = async () => {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    console.error(error);
  }
};
