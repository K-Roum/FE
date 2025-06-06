import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', nickname: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:8080/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
          },
          credentials: 'include',
        });

        if (!res.ok) throw new Error('프로필 조회 실패');

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <section className="mb-12 pb-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">내 정보</h3>
          <button
            onClick={() => navigate('/mypage/profile-edit')}
            className="text-sm text-blue-600 hover:underline"
          >
            편집 &gt;
          </button>
        </div>
        <div className="border-b-2 border-black mb-6" />
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <div className="border rounded-xl p-4 space-y-2 shadow-sm mt-10">
          <p>
            <span className="font-medium">이메일:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">닉네임:</span> {user.nickname}
          </p>
        </div>
      )}
    </section>
  );
}
