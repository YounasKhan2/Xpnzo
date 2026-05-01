import { ID } from 'appwrite';
import { storage } from '../lib/appwrite';

const BUCKET_ID = '69f4b4770020f9f6d662'; // Receipts Bucket ID

export const storageService = {
  // Upload receipt image
  uploadReceipt: async (file: File) => {
    try {
      return await storage.createFile(BUCKET_ID, ID.unique(), file);
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  },

  // Get receipt preview URL
  getReceiptPreview: (fileId: string) => {
    return storage.getFilePreview(BUCKET_ID, fileId);
  },

  // Delete receipt
  deleteReceipt: async (fileId: string) => {
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
    } catch (error) {
      console.error('File deletion failed:', error);
    }
  }
};
