// lib/services/appwriteClient.ts

"use server";

import { Client, Account, Databases, Users, Query } from "node-appwrite";
import { cookies } from "next/headers";

// The createSessionClient function
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = cookies().get("appwrite-session");
  console.log("Session:", session);

  if (!session || !session.value) {
    console.error("No session found");
    throw new Error("No session");
  }

  client.setSession(session.value);
  console.log("Client session set successfully");

  return {
    get account() {
      return new Account(client);
    },
  };
}

// The createAdminClient function
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  console.log("Admin Client Configured:", {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
    key: process.env.NEXT_APPWRITE_KEY ? 'Key is set' : 'Key is missing'
  });

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
        throw new Error("Account ID is undefined or null.");
      }

      try {
        const response = await databases.listDocuments(
          'your-database-id', // Replace with your actual database ID
          'your-collection-id', // Replace with your actual collection ID
          [
            Query.equal("$id", accountId)
          ]
        );

        return response.documents;
      } catch (error) {
        console.error("An error occurred while getting the transaction history:", error);
        throw error;
      }
    }
  };
}

