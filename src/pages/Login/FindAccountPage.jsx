import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function FindAccountPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 좌측 로고 영역 */}
      <div className="w-[48%] flex flex-col items-center justify-center -mr-6">
        <img
          src="/assets/kroumLoginLogo.png"
          alt="K로움 로고"
          className="w-72 h-80 mb-4"
        />
      </div>

      {/* 우측 콘텐츠 영역 */}
      <div className="w-[52%] flex justify-center items-center -ml-6">
        <div className="w-full max-w-2xl bg-white p-14 rounded-3xl shadow-lg mx-8">
          <h2 className="text-2xl font-bold mb-10 text-center">{t('findAccount.title')}</h2>

          <div className="grid gap-8">
            {/* 아이디 찾기 */}
            <div className="border rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">{t('findAccount.idTitle')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('findAccount.idDesc')}</p>
              <a href="/find-id">
                <button
                    onClick={() => navigate('/find-id')}
                    className="w-full py-3 bg-blue-500 text-white rounded-md font-semibold"
                    >
                    {t('findAccount.idButton')}
                </button>
              </a>
            </div>

            {/* 비밀번호 재설정 */}
            <div className="border rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">{t('findAccount.pwTitle')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('findAccount.pwDesc')}</p>
              <a href="/reset-password">
                <button className="w-full py-3 bg-red-500 text-white rounded-md font-semibold">
                  {t('findAccount.pwButton')}
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
