import { Client, Account, Databases, Storage, Permission, Role } from 'appwrite';

export { Permission, Role };

export const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = '69f4af3c003df9004ab9';
export const DATABASE_ID = '69f4b4650016cddc01d3';

export const COLLECTION_IDS = {
  transactions: "69f4b467003790fede5a",
  budgets: "69f4b46e0038f1fd5966",
  recurring: "69f4b473000c148e7eb3",
  notifications: "69f5112be4d55549cc6a",
  userSettings: "69f511324515433bcda2",
};

export const BUCKET_IDS = {
  avatars: "69f511bc4c92c7b0eaed",
  receipts: "69f4b4770020f9f6d662"
};

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export default client;
