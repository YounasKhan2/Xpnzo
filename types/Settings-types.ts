export interface LocalUserSettings {
  localId?: number;
  name: string;
  email: string;
  phone?: string;
  currency: string;
  dateOfBirth?: string;
  avatar?: string;
  // Security preferences
  twoFactorAuth: boolean;
  biometricLogin: boolean;
  loginAlerts: boolean;
  // Notification preferences
  emailDigest: boolean;
  budgetAlerts: boolean;
  marketingEmails: boolean;
  updatedAt: number;
}

export const DEFAULT_SETTINGS: Omit<LocalUserSettings, 'localId'> = {
  name: '',
  email: '',
  phone: '',
  currency: 'USD',
  dateOfBirth: '',
  twoFactorAuth: false,
  biometricLogin: false,
  loginAlerts: true,
  emailDigest: true,
  budgetAlerts: true,
  marketingEmails: false,
  updatedAt: 0,
};
