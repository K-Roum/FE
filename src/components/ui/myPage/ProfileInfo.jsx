import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import config from '../../../config';
export default function ProfileInfo() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState({ email: '', nickname: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${config.apiBaseUrl}/users/profile`, {
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
          <h3 className="text-xl font-semibold">{t('profileEdit.myInfo') || t('내 정보')}</h3>
          <button
            onClick={() => navigate('/mypage/profile-edit')}
            className="text-sm text-blue-600 hover:underline"
          >
            {t('profileEdit.edit') || t('편집')}
          </button>
        </div>
        <div className="border-b-2 border-black mb-6" />
      </div>

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <div className="border rounded-xl p-4 space-y-2 shadow-sm mt-10">
          <p>
            <span className="font-medium">{t('profileEdit.email') || t('이메일')}:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">{t('profileEdit.nickname') || t('닉네임')}:</span> {user.nickname}
          </p>
        </div>
      )}
    </section>
  );
}
