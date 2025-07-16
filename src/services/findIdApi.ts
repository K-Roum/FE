import config from "../config";

export async function findUserIdByEmail(email: string): Promise<string | null> {
    try {
      const response = await fetch(`${config.apiBaseUrl}users/find-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.loginId || null;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
  