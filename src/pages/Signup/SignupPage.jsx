import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    checkLoginId,
    checkEmail,
    checkNickname,
    sendEmailCode,
    verifyEmailCode,
    signupUser,
  } from '../../services/userCheckApi.ts';
  
  export default function SignupForm() {
    const { t } = useTranslation();
    const [form, setForm] = useState({
      loginId: '',
      email: '',
      password: '',
      confirmPassword: '',
      nickname: ''
    });
  
    const navigate = useNavigate();
  
    const [idCheckMessage, setIdCheckMessage] = useState('');
    const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');
    const [emailCheckMessage, setEmailCheckMessage] = useState('');
  
    const [isIdChecked, setIsIdChecked] = useState(null);
    const [isNicknameChecked, setIsNicknameChecked] = useState(null);
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
  
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
    const [isPasswordMatched, setIsPasswordMatched] = useState(null);
  
    const [passwordValidMessage, setPasswordValidMessage] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(null);
  
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verifyMessage, setVerifyMessage] = useState('');
  
    // 언어 선택 상태 추가
    const LANGUAGES = [
      { code: 'ko', label: '한국어' },
      { code: 'en', label: 'English' },
      { code: 'zh', label: '中文' },
      { code: 'ja', label: '日本語' },
      { code: 'fr', label: 'Français' },
      { code: 'de', label: 'Deutsch' },
      { code: 'es', label: 'Español' },
      { code: 'ru', label: 'Русский' },
    ];
    const [selectedLang, setSelectedLang] = useState('ko');
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'loginId' || name === 'nickname') {
        setForm(prev => ({
          ...prev,
          [name]: value.replace(/\s/g, '')
        }));
      } else {
        setForm(prev => ({
          ...prev,
          [name]: value
        }));
      }

      if (name === 'password') validatePassword(value);

      // 비밀번호/비밀번호 확인 필드가 변경될 때만 일치 여부 갱신
      if (name === 'password' || name === 'confirmPassword') {
        const pw = name === 'password' ? value : form.password;
        const confirmPw = name === 'confirmPassword' ? value : form.confirmPassword;
        if (pw !== '' && confirmPw !== '') {
          const matched = pw === confirmPw;
          setIsPasswordMatched(matched);
          setPasswordMatchMessage(matched ? t('signupPage.passwordValidation.match') : t('signupPage.passwordValidation.mismatch'));
        } else {
          setIsPasswordMatched(null);
          setPasswordMatchMessage('');
        }
      }

      if (name === 'loginId') setIsIdChecked(null);
      if (name === 'email') {
        setIsEmailChecked(false);
        setIsEmailVerified(false);
      }
      if (name === 'nickname') setIsNicknameChecked(null);
    };
  
    const handleIdCheck = async () => {
      if (!form.loginId.trim()) {
        alert(t('signupPage.errorEmpty.id'));
        return;
      }
      if (form.loginId.includes(' ')) {
        alert(t('signupPage.errorInvalid.id'));
        return;
      }

      try {
        const result = await checkLoginId(form.loginId);
        if (result) {
          setIsIdChecked(true);
          setIdCheckMessage(t('signupPage.success.id'));
        } else {
          setIsIdChecked(false);
          setIdCheckMessage(t('signupPage.errorDuplicate.id'));
        }
      } catch (error) {
        console.error('ID check error:', error);
        setIdCheckMessage(error.message || t('errorServer'));
        setIsIdChecked(false);
      }
    };
  
    const handleEmailCheck = async () => {
      if (!form.email.trim()) {
        alert(t('signupPage.errorEmpty.email'));
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(form.email)) {
        alert(t('signupPage.errorInvalid.email'));
        return;
      }

      try {
        const result = await checkEmail(form.email);
        if (result) {
          setIsEmailChecked(true);
          setEmailCheckMessage(t('signupPage.success.email'));
        } else {
          setIsEmailChecked(false);
          setEmailCheckMessage(t('signupPage.errorDuplicate.email'));
        }
      } catch (error) {
        console.error('Email check error:', error);
        setEmailCheckMessage(error.message || t('errorServer'));
        setIsEmailChecked(false);
      }
    };
  
    const handleSendVerificationCode = async () => {
        const success = await sendEmailCode(form.email);
        if (success) {
          alert(t('signupPage.verification.sendSuccess'));
          setShowVerificationModal(true);
        } else {
          alert(t('signupPage.verification.sendError'));
        }
      };     
  
    const handleVerifyCode = async () => {
      try {
        const verified = await verifyEmailCode(form.email, verificationCode);
        if (verified) {
        setIsEmailVerified(true);
        setShowVerificationModal(false);
        setVerifyMessage(t('signupPage.success.emailVerification'));
        setEmailCheckMessage(t('signupPage.success.emailVerification'));
        alert(t('signupPage.success.emailVerification'));
      }  else {
          setVerifyMessage(t('signupPage.verification.invalidCode'));
          setIsEmailVerified(false);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerifyMessage(t('signupPage.verification.error'));
        setIsEmailVerified(false);
      }
    };
  
    const handleNicknameCheck = async () => {
      if (!form.nickname.trim()) {
        alert(t('signupPage.errorEmpty.nickname'));
        return;
      }
      if (form.nickname.includes(' ')) {
        alert(t('signupPage.errorInvalid.nickname'));
        return;
      }

      try {
        const result = await checkNickname(form.nickname);
        if (result) {
          setIsNicknameChecked(true);
          setNicknameCheckMessage(t('signupPage.success.nickname'));
        } else {
          setIsNicknameChecked(false);
          setNicknameCheckMessage(t('signupPage.errorDuplicate.nickname'));
        }
      } catch (error) {
        console.error('Nickname check error:', error);
        setNicknameCheckMessage(error.message || t('errorServer'));
        setIsNicknameChecked(false);
      }
    };
  
    const validatePassword = (pw) => {
      const hasEnglish = /[a-zA-Z]/.test(pw);
      const hasUpper = /[A-Z]/.test(pw);
      const hasNumber = /\d/.test(pw);
      const hasSpecial = /[!@^*]/.test(pw);
      const isProperLength = pw.length >= 8 && pw.length <= 20;
      const hasNoSpace = !/\s/.test(pw);
      const hasNoKorean = !/[ㄱ-ㅎ가-힣]/.test(pw);
  
      const isValid = hasEnglish && hasUpper && hasNumber && hasSpecial && isProperLength && hasNoSpace && hasNoKorean;
      setIsPasswordValid(isValid);
      setPasswordValidMessage(isValid ? t('signupPage.passwordValidation.valid') : t('signupPage.passwordValidation.invalid'));
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();

      const missingItems = [];
      if (!isIdChecked) missingItems.push(t('signupPage.submit.idCheck'));
      if (!isEmailChecked) missingItems.push(t('signupPage.submit.emailCheck'));
      if (!isEmailVerified) missingItems.push(t('signupPage.submit.emailVerification'));
      if (!isPasswordValid) missingItems.push(t('signupPage.submit.passwordCheck'));
      if (!isPasswordMatched) missingItems.push(t('signupPage.submit.passwordMatch'));
      if (!isNicknameChecked) missingItems.push(t('signupPage.submit.nicknameCheck'));

      if (missingItems.length > 0) {
        alert(`${t('signupPage.submit.missingItems')}\n\n${missingItems.join('\n')}`);
        return;
      }

      try {
        await signupUser({
          loginId: form.loginId,
          password: form.password,
          email: form.email,
          nickname: form.nickname
        });
        // 회원가입 시 선택한 언어 저장
        localStorage.setItem('lang', selectedLang);
        alert(t('signupPage.submit.success'));
        navigate('/signup-complete');
      } catch (err) {
        console.error('Signup submission error:', err);
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert(t('signupPage.submit.error'));
        }
      }
    };

  return (
    <div className="w-2/5 min-w-[400px] max-w-[700px] mx-auto my-12">
      <div className="w-full bg-white rounded-2xl shadow-xl p-12">
        <h2 className="text-4xl font-bold text-center mb-8 border-b pb-6">{t('signupPage.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 아이디 */}
          <div className="h-[85px]">
            <label className="font-bold text-lg">{t('signupPage.id')}</label>
            <div className="flex justify-between items-center border-b border-gray-300">
              <input
                type="text"
                name="loginId"
                placeholder={t('signupPage.idPlaceholder')}
                value={form.loginId}
                onChange={(e) => {
                  handleChange(e);
                  setIsIdChecked(null);
                  setIdCheckMessage('');
                }}
                className="w-full py-3 text-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={handleIdCheck}
                className="text-base text-gray-500 whitespace-nowrap ml-2 hover:text-blue-600"
              >
                {t('signupPage.checkDuplicate')}
              </button>
            </div>
            {idCheckMessage && (
              <p className={`text-sm mt-1 ${isIdChecked ? 'text-green-600' : 'text-red-500'}`}>
                {idCheckMessage}
              </p>
            )}
          </div>
          

          {/* 비밀번호 */}
          <div className="mb-4">
            <label className="font-bold text-lg">{t('signupPage.password')}</label>
            <div className="border-b border-gray-300">
              <input
                type="password"
                name="password"
                placeholder={t('signupPage.passwordPlaceholder')}
                value={form.password}
                onChange={handleChange}
                className="w-full py-3 text-lg focus:outline-none"
              />
            </div>
            {passwordValidMessage && (
              <p className={`text-sm mt-1 ${isPasswordValid ? 'text-green-600' : 'text-red-500'}`}>
                {passwordValidMessage}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="mb-4">
            <label className="font-bold text-lg">{t('signupPage.confirmPassword')}</label>
            <div className="border-b border-gray-300">
              <input
                type="password"
                name="confirmPassword"
                placeholder={t('signupPage.confirmPasswordPlaceholder')}
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full py-3 text-lg focus:outline-none"
              />
            </div>
            {passwordMatchMessage && (
              <p className={`text-sm mt-1 ${isPasswordMatched ? 'text-green-600' : 'text-red-500'}`}>
                {passwordMatchMessage}
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div className="mb-4">
            <label className="font-bold text-lg">{t('signupPage.nickname')}</label>
            <div className="flex justify-between items-center border-b border-gray-300">
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={(e) => {
                  handleChange(e);
                  setIsNicknameChecked(null);
                  setNicknameCheckMessage('');
                }}
                placeholder={t('signupPage.nicknamePlaceholder')}
                className="w-full py-3 text-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                className="text-base text-gray-500 whitespace-nowrap ml-2 hover:text-blue-600"
              >
                {t('signupPage.checkDuplicate')}
              </button>
            </div>
            {nicknameCheckMessage && (
              <p className={`text-sm mt-1 ${isNicknameChecked ? 'text-green-600' : 'text-red-500'}`}>
                {nicknameCheckMessage}
              </p>
            )}
          </div>

{/* 이메일 */}
<div className="h-[85px]">
            <label className="font-bold text-lg">{t('signupPage.email')}</label>
            <div className="flex justify-between items-center border-b border-gray-300">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => {
                  handleChange(e);
                  setIsEmailChecked(false);
                  setEmailCheckMessage('');
                }}
                placeholder={t('signupPage.emailPlaceholder')}
                className="w-full py-3 text-lg focus:outline-none"
              />
              {!isEmailChecked ? (
                <button
                  type="button"
                  onClick={handleEmailCheck}
                  className="text-base text-gray-500 whitespace-nowrap ml-2 hover:text-blue-600"
                >
                  {t('signupPage.checkDuplicate')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  className="text-base text-blue-600 whitespace-nowrap ml-2 hover:underline"
                >
                  {t('signupPage.getVerificationCode')}
                </button>
              )}
            </div>
            {emailCheckMessage && (
              <p className={`text-sm mt-1 ${isEmailChecked ? 'text-green-600' : 'text-red-500'}`}>
                {emailCheckMessage}
              </p>
            )}
          </div>

          {showVerificationModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4">{t('signupPage.verifyEmail')}</h3>
                <p className="mb-2">{t('signupPage.verifyEmailDesc')}</p>
                <input
                    type="text"
                    placeholder={t('signupPage.verificationCodePlaceholder')}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full border px-3 py-2 mb-4"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleVerifyCode();
                      }
                    }}
                />
                {verifyMessage && <p className="text-sm text-red-500 mb-2">{verifyMessage}</p>}
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowVerificationModal(false)} className="px-4 py-2 text-gray-600 hover:underline">
                    {t('signupPage.cancel')}
                    </button>
                    <button
                      type="button"  // ✅ 핵심: submit 차단!
                      onClick={handleVerifyCode}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {t('signupPage.confirm')}
                    </button>
                </div>
                </div>
            </div>
          )}

          {/* 언어 선택 */}
          <div className="h-[85px]">
            <label className="font-bold text-lg">{t('language.select')}</label>
            <select
              className="w-full py-3 text-lg border-b border-gray-300 focus:outline-none"
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* 가입 버튼 */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 rounded-md font-semibold text-lg bg-gray-800 text-white hover:bg-gray-700"
            >
              {t('signupPage.signupButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
