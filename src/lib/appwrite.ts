import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('69f4af3c003df9004ab9');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export default client;
