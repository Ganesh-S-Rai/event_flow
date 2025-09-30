
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';

export type SenderProfile = {
  id: string;
  name: string;
  email: string;
};

export type AppConfig = {
  netcoreApiKey?: string;
  senderProfiles?: SenderProfile[];
  defaultSenderId?: string;
};

// The path to the config file
const configPath = path.join(process.cwd(), 'src', 'lib', 'config.json');

/**
 * Reads the current configuration from config.json.
 * If the file doesn't exist, it returns a default config.
 */
export async function getConfig(showPrivateKey: boolean = false): Promise<AppConfig> {
  noStore();
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    const currentConfig: AppConfig = JSON.parse(fileContent);

    // If not explicitly asked for, hide the private key.
    if (!showPrivateKey && currentConfig.netcoreApiKey) {
        currentConfig.netcoreApiKey = '********';
    }
    
    return currentConfig;

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default empty config
      return {};
    }
    console.error('Failed to read config file:', error);
    // On other errors, return empty config to avoid breaking the app
    return {};
  }
}

/**
 * Saves a new configuration to config.json.
 * It reads the existing config and merges the new data.
 */
export async function saveConfig(newConfig: Partial<AppConfig>): Promise<void> {
  let currentConfig: AppConfig = {};
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    currentConfig = JSON.parse(fileContent);
  } catch (error: any) {
    // If the file doesn't exist, we'll create it.
    if (error.code !== 'ENOENT') {
      throw new Error('Failed to read existing config file.');
    }
  }

  // Merge the new config.
  const updatedConfig: AppConfig = { ...currentConfig };

  // Only update API key if it's not the placeholder
  if (newConfig.netcoreApiKey && newConfig.netcoreApiKey !== '********') {
    updatedConfig.netcoreApiKey = newConfig.netcoreApiKey;
  }

  // Update sender profiles and default sender
  if (newConfig.senderProfiles) {
    updatedConfig.senderProfiles = newConfig.senderProfiles;
  }
  if (newConfig.defaultSenderId) {
    updatedConfig.defaultSenderId = newConfig.defaultSenderId;
  }
  
  try {
    await fs.writeFile(configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write config file:', error);
    throw new Error('Failed to save configuration file.');
  }
}
