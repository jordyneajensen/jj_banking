"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";

// The createSessionClient function
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = cookies().get("appwrite-session");
  console.log("Session:", session); // Log the session

  if (!session || !session.value) {
    console.error("No session found"); // Log an error if the session is missing
    throw new Error("No session");
  }

  client.setSession(session.value);
  console.log("Client session set successfully"); // Confirm the session is set

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
  }); // Log the admin client configuration

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get user() {
      return new Users(client);
    }
  };
}
