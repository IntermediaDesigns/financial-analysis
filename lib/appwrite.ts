// lib/appwrite.ts
import {
  Client,
  Account,
  Databases
} from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Initialize services
const account = new Account(client);
const databases = new Databases(client);

const createUserAccount = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    await account.create(
      "unique()", // This will generate a unique ID
      email,
      password,
      name
    );
    // After creating account, login the user
    const loginResponse = await loginUser(email, password);
    if (!loginResponse) {
      throw new Error('Failed to login after account creation');
    }
    return loginResponse.user;
  } catch (error) {
    console.error("Account creation error:", error);
    throw error;
  }
};

const loginUser = async (email: string, password: string) => {
  try {
    const session = await account.createSession(email, password);
    const user = await account.get();
    return { session, user };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const getCurrentUser = async () => {
  try {
    // First check if we have an active session
    const session = await account.getSession('current');
    if (!session) {
      throw new Error('No active session');
    }
    return await account.get();
  } catch (error) {
    console.error("Get current user error:", error);
    throw error; // Propagate error to be handled by auth context
  }
};

// Logout helper function
const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export {
  client,
  account,
  databases,
  createUserAccount,
  loginUser,
  getCurrentUser,
  logout,
};
