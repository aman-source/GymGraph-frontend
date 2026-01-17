// OneSignal Push Notification Helper
// Documentation: https://documentation.onesignal.com/docs/web-sdk

const ONESIGNAL_APP_ID = import.meta.env.VITE_ONESIGNAL_APP_ID;

let isInitialized = false;

/**
 * Initialize OneSignal and optionally link to a user
 * @param {string} userId - The user's ID to link with OneSignal
 */
export const initOneSignal = async (userId) => {
  if (typeof window === 'undefined') return;
  if (isInitialized) {
    // If already initialized, just login the user
    if (userId) {
      await loginUser(userId);
    }
    return;
  }

  try {
    await window.OneSignalDeferred?.push(async (OneSignal) => {
      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: true, // Allow testing on localhost
        notifyButton: {
          enable: false, // We'll handle our own UI
        },
      });

      isInitialized = true;

      // Link OneSignal subscription to your user ID
      if (userId) {
        await OneSignal.login(userId);
      }
    });
  } catch (error) {
    console.error('OneSignal initialization failed:', error);
  }
};

/**
 * Login/link a user to their OneSignal subscription
 * @param {string} userId - The user's ID
 */
export const loginUser = async (userId) => {
  if (!userId) return;

  try {
    await window.OneSignalDeferred?.push(async (OneSignal) => {
      await OneSignal.login(userId);
    });
  } catch (error) {
    console.error('OneSignal login failed:', error);
  }
};

/**
 * Logout user from OneSignal (unlink subscription)
 */
export const logoutUser = async () => {
  try {
    await window.OneSignalDeferred?.push(async (OneSignal) => {
      await OneSignal.logout();
    });
  } catch (error) {
    console.error('OneSignal logout failed:', error);
  }
};

/**
 * Request notification permission from the user
 * @returns {Promise<boolean>} Whether permission was granted
 */
export const requestNotificationPermission = async () => {
  try {
    let granted = false;
    await window.OneSignalDeferred?.push(async (OneSignal) => {
      const permission = await OneSignal.Notifications.requestPermission();
      granted = permission;
    });
    return granted;
  } catch (error) {
    console.error('Permission request failed:', error);
    return false;
  }
};

/**
 * Check if notifications are enabled
 * @returns {Promise<boolean>}
 */
export const isNotificationsEnabled = async () => {
  try {
    let enabled = false;
    await window.OneSignalDeferred?.push(async (OneSignal) => {
      enabled = await OneSignal.Notifications.permission;
    });
    return enabled;
  } catch (error) {
    return false;
  }
};

/**
 * Add tags to the user for segmentation
 * @param {Object} tags - Key-value pairs of tags
 */
export const addTags = async (tags) => {
  try {
    await window.OneSignalDeferred?.push(async (OneSignal) => {
      await OneSignal.User.addTags(tags);
    });
  } catch (error) {
    console.error('Failed to add tags:', error);
  }
};
