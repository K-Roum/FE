export async function resetPasswordRequest({ loginId, email }) {
    try {
      const response = await fetch('http://localhost:8080/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({ loginId, email }),
      });
  
      return response.ok;
    } catch (error) {
      throw new Error('API error');
    }
  }
  