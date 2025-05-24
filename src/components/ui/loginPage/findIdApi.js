export async function findUserIdByEmail(email) {
    try {
      const response = await fetch('http://localhost:8080/users/find-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({ email }),
      });
  
      return response.ok; // 성공 여부만 반환
    } catch (err) {
      throw new Error('API error');
    }
  }
  