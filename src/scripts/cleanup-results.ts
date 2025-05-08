/**
 * Cleanup Script for Expired Results
 * 
 * This script can be run periodically to clean up expired results.
 * It can be executed manually or set up as a cron job.
 */

import { cleanupExpiredResults } from '../lib/utils/results-manager';

async function main() {
  console.log('Starting cleanup of expired results...');
  
  try {
    const deletedCount = await cleanupExpiredResults();
    console.log(`Cleanup completed. Deleted ${deletedCount} expired results.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the main function
main();
