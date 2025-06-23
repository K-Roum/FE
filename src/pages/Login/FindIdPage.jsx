import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { findUserIdByEmail } from '../../components/ui/loginPage/findIdApi.ts';
import { useNavigate } from 'react-router-dom';
import { getLoginLogoPath } from '../../utils/languageUtils';

export default function FindIdPage() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [foundId, setFoundId] = useState('');
  const navigate = useNavigate();

  const handleFindId = async () => {
    if (!email) {
      setErrorMessage(t('findId.errorEmpty'));
      setSuccessMessage('');
      setFoundId('');
      return;
    }
  
    try {
      const loginId = await findUserIdByEmail(email);
      if (loginId) {

        setFoundId(loginId);
        setErrorMessage('');
      } else {
        setErrorMessage(t('findId.errorNotFound'));
        setSuccessMessage('');
        setFoundId('');
      }
    } catch (error) {
      setErrorMessage(t('findId.errorServer'));
      setSuccessMessage('');
      setFoundId('');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 좌측 로고 영역 */}
      <div className="w-[48%] flex flex-col items-center justify-center -mr-6">
        <img 
          src={getLoginLogoPath(i18n.language)} 
          alt={t('common.logo')} 
          className="w-72 h-80 mb-4" 
        />
      </div>

      {/* 우측 입력 영역 */}
      <div className="w-[52%] flex justify-center items-center -ml-6">
        <div className="w-full max-w-2xl bg-white p-14 rounded-3xl shadow-lg mx-8">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('findId.title')}</h2>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleFindId();
                }}
            >
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('findId.emailPlaceholder')}
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-md mb-4 placeholder-gray-400 focus:outline-none" 
                />

                <button type="submit" className="w-full py-3 bg-gray-500 text-white rounded-md font-semibold">
                    {t('findId.findButton')}
                </button>
            </form>

            {foundId && (
                <>
                    <div className="text-center mt-6 text-black-700 font-bold text-xl">
                        {t('findId.foundId', { id: foundId })}
                    </div>
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-3 bg-gray-700 text-white rounded-md font-semibold hover:bg-gray-800"
                        >
                            {t('findId.goLogin')}
                        </button>
                    </div>
                </>
            )}

            {errorMessage && (
                <div className="text-center mt-4 text-red-500 text-sm">
                    {errorMessage}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
