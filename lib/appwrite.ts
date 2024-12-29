"use client";

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
  emailNotifications: boolean;
  pushNotifications: boolean;
}

// Constants
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
export const COLLECTIONS = {
  ARTICLES: process.env.NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID!,
  FINANCIAL_DATA: process.env.NEXT_PUBLIC_APPWRITE_FINANCIAL_DATA_COLLECTION_ID!,
  USER_PREFERENCES: process.env.NEXT_PUBLIC_APPWRITE_USER_PREFERENCES_COLLECTION_ID!,
} as const;

// Client-side wrapper functions for server actions
export async function createUserAccount(email: string, password: string, name: string) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create account');
  }

  return response.json();
}
