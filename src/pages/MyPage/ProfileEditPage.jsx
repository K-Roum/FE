// ✅ ProfileEditPage.jsx (UI 개선: 인풋 오른쪽 버튼 정렬 및 줄 정리)
import React, { useEffect, useState } from 'react';
import MyPageLayout from './MyPageLayout';
import { useNavigate } from 'react-router-dom';
import {
  checkEmail,
  checkNickname,
  sendEmailCode,
  verifyEmailCode,
} from '../../components/ui/signupPage/userCheckApi.ts';
import { useTranslation } from 'react-i18next';

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    loginId: '',
    email: '',
    nickname: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [passwordValidMessage, setPasswordValidMessage] = useState('');
  const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
  const [modalType, setModalType] = useState(null); // 'nickname' | 'password' | 'resign' | null

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('http://localhost:8080/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        credentials: 'include',
      });
      const data = await res.json();
      setForm(prev => ({
        ...prev,
        nickname: data.nickname,
        email: data.email,
        loginId: data.loginId,
      }));
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'newPassword') validatePassword(value);
    if (name === 'confirmPassword' || name === 'newPassword') {
      const match = name === 'confirmPassword' ? value === form.newPassword : form.confirmPassword === value;
      setPasswordMatchMessage(match ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.');
    }
  };

  const validatePassword = (pw) => {
    const valid = /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw) && /[!@^*]/.test(pw) && pw.length >= 8 && pw.length <= 20;
    setPasswordValidMessage(valid ? '안전한 비밀번호입니다.' : '비밀번호는 대/소문자, 숫자, 특수문자 포함 8~20자여야 합니다.');
  };

  const handleNicknameCheck = async () => {
    try {
      const available = await checkNickname(form.nickname);
      setIsNicknameChecked(available);
      setNicknameCheckMessage(
        available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'
      );
    } catch (err) {
      setIsNicknameChecked(false);
      setNicknameCheckMessage('이미 사용 중인 닉네임입니다.');
    }
  };

  const handleEmailCheck = async () => {
    try {
      const available = await checkEmail(form.email);
      setIsEmailChecked(available);
      setEmailCheckMessage(
        available ? '이메일 확인 완료' : '이미 가입된 이메일입니다.'
      );
    } catch (err) {
      setIsEmailChecked(false);
      setEmailCheckMessage('이미 가입된 이메일입니다.');
    }
  };

  const handleSendVerificationCode = async () => {
    const success = await sendEmailCode(form.email);
    if (success) alert('인증 코드가 전송되었습니다.');
  };

  const handleVerifyCode = async () => {
    const verified = await verifyEmailCode(form.email, verificationCode);
    setIsEmailVerified(verified);
    alert(verified ? '이메일 인증 성공!' : '인증 실패');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNicknameChecked || !isEmailChecked || !isEmailVerified) {
      alert('모든 중복확인과 인증을 완료해주세요.');
      return;
    }
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 닉네임/이메일 수정
      await fetch('http://localhost:8080/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        credentials: 'include',
        body: JSON.stringify({ nickname: form.nickname, email: form.email }),
      });

      // 비밀번호 변경
      if (form.newPassword) {
        await fetch('http://localhost:8080/users/change-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
            credentials: 'include'
          },
          credentials: 'include',
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        });
      }

      alert('수정이 완료되었습니다.');
      navigate('/mypage');
    } catch (err) {
      alert('오류 발생: ' + err.message);
    }
  };

  // 닉네임 변경 모달
  const NicknameModal = ({ t }) => {
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const handleCheck = async () => {
      try {
        const available = await checkNickname(nickname);
        setIsChecked(available);
        setMessage(available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.');
      } catch {
        setIsChecked(false);
        setMessage('닉네임 확인 중 오류 발생');
      }
    };
    const handleChange = async () => {
      if (!isChecked) {
        setMessage('닉네임 중복 확인을 해주세요.');
        return;
      }
      try {
        await fetch('http://localhost:8080/users/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', accept: '*/*' },
          credentials: 'include',
          body: JSON.stringify({ nickname }),
        });
        alert('닉네임이 변경되었습니다.');
        setModalType(null);
        window.location.reload();
      } catch {
        setMessage('닉네임 변경 실패');
      }
    };
    return (
      <Modal onClose={() => setModalType(null)} title={t('profileEdit.changeNickname')}>
        <input className="w-full border rounded px-3 py-2 mb-3" value={nickname} onChange={e => { setNickname(e.target.value); setIsChecked(false); setMessage(''); }} placeholder={t('profileEdit.nicknamePlaceholder')} />
        <button className="w-full py-2 mb-2 bg-gray-200 hover:bg-gray-400 text-gray-800 rounded" onClick={handleCheck}>{t('profileEdit.checkDuplicate')}</button>
        <button className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900" onClick={handleChange}>{t('profileEdit.changeNickname')}</button>
        {message && <div className="mt-3 text-center text-sm text-red-500">{t(`profileEdit.${message}`) || message}</div>}
      </Modal>
    );
  };
  // 비밀번호 변경 모달
  const PasswordModal = ({ t }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [passwordValidMessage, setPasswordValidMessage] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');

    // 비밀번호 유효성 검사
    const validatePassword = (pw) => {
      const valid = /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw) && /[!@^*]/.test(pw) && pw.length >= 8 && pw.length <= 20;
      setPasswordValidMessage(valid ? '안전한 비밀번호입니다.' : '비밀번호는 대/소문자, 숫자, 특수문자 포함 8~20자여야 합니다.');
    };

    // 입력 핸들러
    const handleNewPassword = (e) => {
      setNewPassword(e.target.value);
      validatePassword(e.target.value);
      setPasswordMatchMessage(e.target.value === confirmPassword ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.');
    };
    const handleConfirmPassword = (e) => {
      setConfirmPassword(e.target.value);
      setPasswordMatchMessage(newPassword === e.target.value ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.');
    };

    const handleChange = async () => {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setMessage('모든 항목을 입력해주세요.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      try {
        const res = await fetch('http://localhost:8080/users/change-password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', accept: '*/*' },
          credentials: 'include',
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setMessage('현재 비밀번호가 올바르지 않습니다.');
          } else {
            setMessage('비밀번호 변경 실패');
          }
          return;
        }
        alert('비밀번호가 변경되었습니다.');
        setModalType(null);
      } catch {
        setMessage('비밀번호 변경 실패');
      }
    };
    return (
      <Modal onClose={() => setModalType(null)} title={t('profileEdit.changePassword')}>
        <input className="w-full border rounded px-3 py-2 mb-3" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder={t('profileEdit.currentPassword')} />
        <input className="w-full border rounded px-3 py-2 mb-1" type="password" value={newPassword} onChange={handleNewPassword} placeholder={t('profileEdit.newPassword')} />
        {passwordValidMessage && (
          <p className={`text-sm mb-1 ${passwordValidMessage.includes('안전') ? 'text-blue-600' : 'text-red-500'}`}>{t(`profileEdit.${passwordValidMessage}`) || passwordValidMessage}</p>
        )}
        <input className="w-full border rounded px-3 py-2 mb-1" type="password" value={confirmPassword} onChange={handleConfirmPassword} placeholder={t('profileEdit.confirmPassword')} />
        {passwordMatchMessage && (
          <p className={`text-sm mb-2 ${passwordMatchMessage.includes('일치합니다') ? 'text-blue-600' : 'text-red-500'}`}>{t(`profileEdit.${passwordMatchMessage}`) || passwordMatchMessage}</p>
        )}
        <button className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900" onClick={handleChange}>{t('profileEdit.changePassword')}</button>
        {message && <div className="mt-3 text-center text-sm text-red-500">{t(`profileEdit.${message}`) || message}</div>}
      </Modal>
    );
  };
  // 회원 탈퇴 모달
  const ResignModal = ({ t }) => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const handleResign = async () => {
      if (!password) {
        setMessage('비밀번호를 입력해주세요.');
        return;
      }
      if (!window.confirm('정말로 회원 탈퇴하시겠습니까?')) return;
      try {
        await fetch('http://localhost:8080/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', accept: '*/*' },
          credentials: 'include',
        });
        alert('회원 탈퇴가 완료되었습니다.');
        setModalType(null);
        // 로그아웃 처리
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('nickname');
        localStorage.removeItem('languageCode');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('rememberMe');
        navigate('/');
      } catch {
        setMessage('회원 탈퇴 실패');
      }
    };
    return (
      <Modal onClose={() => setModalType(null)} title={t('profileEdit.resign')}>
        <input className="w-full border rounded px-3 py-2 mb-3" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('profileEdit.passwordPlaceholder')} />
        <button className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900" onClick={handleResign}>{t('profileEdit.resign')}</button>
        {message && <div className="mt-3 text-center text-sm text-red-500">{t(`profileEdit.${message}`) || message}</div>}
      </Modal>
    );
  };
  // 공통 모달 컴포넌트
  function Modal({ onClose, title, children }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold p-1 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-colors" aria-label="close">×</button>
          <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
          {children}
        </div>
      </div>
    );
  }

  return (
    <MyPageLayout>
      <div className="max-w-xl mx-auto flex flex-col items-center justify-start min-h-[60vh]">
        <h2 className="text-3xl font-bold text-center mb-8 mt-8">{t('profileEdit.title')}</h2>
        <div className="border-b-2 border-black mb-12 w-full" />
        <div className="flex flex-col gap-8 w-full">
          <button onClick={() => setModalType('nickname')} className="w-full py-8 rounded-2xl bg-gray-200 hover:bg-gray-400 text-gray-800 text-2xl font-bold shadow">{t('profileEdit.changeNickname')}</button>
          <button onClick={() => setModalType('password')} className="w-full py-8 rounded-2xl bg-gray-200 hover:bg-gray-400 text-gray-800 text-2xl font-bold shadow">{t('profileEdit.changePassword')}</button>
          <button onClick={() => setModalType('resign')} className="w-full py-8 rounded-2xl bg-gray-200 hover:bg-gray-400 text-gray-800 text-2xl font-bold shadow">{t('profileEdit.resign')}</button>
        </div>
        {modalType === 'nickname' && <NicknameModal t={t} />}
        {modalType === 'password' && <PasswordModal t={t} />}
        {modalType === 'resign' && <ResignModal t={t} />}
      </div>
    </MyPageLayout>
  );
}