// lib/data-service.ts
import { ID, Query } from 'appwrite';
import { databases, DATABASES, COLLECTIONS } from './appwrite';

export interface WatchlistItem {
    symbol: string;
    name: string;
    userId: string;
}

export interface Alert {
    type: string;
    title: string;
    description: string;
    userId: string;
    active: boolean;
}

export const watchlistService = {
    async addToWatchlist(symbol: string, name: string, userId: string) {
        try {
            return await databases.createDocument(
                DATABASES.MAIN,
                COLLECTIONS.WATCHLIST,
                ID.unique(),
                {
                    symbol,
                    name,
                    userId
                }
            );
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            throw error;
        }
    },

    async getWatchlist(userId: string) {
        try {
            const response = await databases.listDocuments(
                DATABASES.MAIN,
                COLLECTIONS.WATCHLIST,
                [
                    Query.equal('userId', userId)
                ]
            );
            return response.documents;
        } catch (error) {
            console.error('Error getting watchlist:', error);
            throw error;
        }
    },

    async removeFromWatchlist(documentId: string) {
        try {
            await databases.deleteDocument(
                DATABASES.MAIN,
                COLLECTIONS.WATCHLIST,
                documentId
            );
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            throw error;
        }
    }
};

export const alertService = {
    async createAlert(alert: Omit<Alert, 'id'>) {
        try {
            return await databases.createDocument(
                DATABASES.MAIN,
                COLLECTIONS.ALERTS,
                ID.unique(),
                alert
            );
        } catch (error) {
            console.error('Error creating alert:', error);
            throw error;
        }
    },

    async getAlerts(userId: string) {
        try {
            const response = await databases.listDocuments(
                DATABASES.MAIN,
                COLLECTIONS.ALERTS,
                [
                    Query.equal('userId', userId),
                    Query.equal('active', true)
                ]
            );
            return response.documents;
        } catch (error) {
            console.error('Error getting alerts:', error);
            throw error;
        }
    },

    async updateAlert(documentId: string, data: Partial<Alert>) {
        try {
            return await databases.updateDocument(
                DATABASES.MAIN,
                COLLECTIONS.ALERTS,
                documentId,
                data
            );
        } catch (error) {
            console.error('Error updating alert:', error);
            throw error;
        }
    },

    async deleteAlert(documentId: string) {
        try {
            await databases.deleteDocument(
                DATABASES.MAIN,
                COLLECTIONS.ALERTS,
                documentId
            );
        } catch (error) {
            console.error('Error deleting alert:', error);
            throw error;
        }
    }
};