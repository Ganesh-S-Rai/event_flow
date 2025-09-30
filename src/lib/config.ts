
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { unstable_noStore as noStore } from 'next/cache';

export type AppConfig = {
  netcoreApiKey?: string;
};

// The path to the config file
const configPath = path.join(process.cwd(), 'src', 'lib', 'config.json');

/**
 * Reads the current configuration from config.json.
 * If the file doesn't exist, it returns a default config.
 */
export async function getConfig(): Promise<AppConfig> {
  noStore();
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    const currentConfig = JSON.parse(fileContent);

    // Only return non-sensitive parts or indicators that a key exists
    return {
      netcoreApiKey: currentConfig.netcoreApiKey ? '********' : '',
    };

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

  // Merge the new config. If a value is an empty string, don't update it.
  const updatedConfig = { ...currentConfig };
  if (newConfig.netcoreApiKey) {
    updatedConfig.netcoreApiKey = newConfig.netcoreApiKey;
  }
  
  try {
    await fs.writeFile(configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write config file:', error);
    throw new Error('Failed to save configuration file.');
  }
}
