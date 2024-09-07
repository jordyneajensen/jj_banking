"use server";

import { Client, Account, Databases, Users, Query } from "node-appwrite";
import { cookies } from "next/headers";

// Creates a session client using Appwrite's Client
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const sessionCookie = cookies().get("appwrite-session");
  if (!sessionCookie || !sessionCookie.value) {
    throw new Error("No session found");
  }

  client.setSession(sessionCookie.value);
  return {
    get account() {
      return new Account(client);
    },
  };
}

// Creates an admin client using Appwrite's Client
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  const databases = new Databases(client);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return databases;
    },
    get user() {
      return new Users(client);
    },
    async getTransactionHistory(accountId: string) {
      if (!accountId) {
        throw new Error("Account ID is required.");
      }

      try {
        const response = await databases.listDocuments(
          'your-database-id', // Replace with your actual database ID
          'your-collection-id', // Replace with your actual collection ID
          [Query.equal("$id", accountId)]
        );

        return response.documents;
      } catch (error) {
        console.error("Failed to fetch transaction history:", error);
        throw error;
      }
    }
  };
}
