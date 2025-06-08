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

export default function ProfileEditPage() {
  const navigate = useNavigate();
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

  return (
    <MyPageLayout>
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">프로필 변경</h2>
        <div className="border-b-2 border-black mb-8" />
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 닉네임 */}
          <div className="mb-4 flex flex-col">
            <label className="mb-1 text-gray-500">닉네임</label>
            <div className="relative">
              <input
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 pr-24"
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
              >
                중복 확인
              </button>
            </div>
            {nicknameCheckMessage && (
              <p className={`mt-1 text-sm ${isNicknameChecked ? 'text-blue-600' : 'text-red-500'}`}>{nicknameCheckMessage}</p>
            )}
          </div>

          {/* 이메일 */}
          <div className="mb-4 flex flex-col">
            <label className="mb-1 text-gray-500">이메일</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 pr-20"
                />
                <button
                  type="button"
                  onClick={handleEmailCheck}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                >
                  중복 확인
                </button>
              </div>
              <button
                type="button"
                onClick={handleSendVerificationCode}
                className="text-sm text-blue-600 whitespace-nowrap"
              >
                인증 코드 받기
              </button>
            </div>
            {emailCheckMessage && (
              <p className={`mt-1 text-sm ${isEmailChecked ? 'text-blue-600' : 'text-red-500'}`}>{emailCheckMessage}</p>
            )}
          </div>

          {/* 인증 코드 입력 */}
          <div className="mb-4 flex flex-col">
            <label className="mb-1 text-gray-500"> </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="인증 코드 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-grow border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                className="text-sm text-blue-600 whitespace-nowrap"
              >
                코드 확인
              </button>
              {isEmailVerified && <span className="ml-2 text-xs text-green-600">인증 완료</span>}
            </div>
          </div>

          {/* 아이디 (수정 불가) */}
          <div className="mb-4 flex flex-col">
            <label className="mb-1 text-gray-500">아이디</label>
            <input type="text" value={form.loginId} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
          </div>

          {/* 현재 비밀번호 */}
          <div className="mb-4 flex flex-col">
            <label className="mb-1 text-gray-500">현재 비밀번호</label>
            <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} placeholder="현재 비밀번호를 입력하세요" className="w-full border rounded px-3 py-2" />
          </div>

          {/* 새 비밀번호 */}
          <div className="mb-4 flex flex-col">
            <label className="mb-1 text-gray-500">새 비밀번호</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="새 비밀번호를 입력하세요"
              className="w-full border rounded px-3 py-2"
            />
            {passwordValidMessage && (
              <p className={`mt-1 text-sm ${passwordValidMessage.includes('안전') ? 'text-blue-600' : 'text-red-500'}`}>{passwordValidMessage}</p>
            )}
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="mb-4 flex flex-col">
            <label className="mb-1 text-gray-500">새 비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="새 비밀번호를 한 번 더 입력하세요"
              className="w-full border rounded px-3 py-2"
            />
            {passwordMatchMessage && (
              <p className={`mt-1 text-sm ${passwordMatchMessage.includes('일치합니다') ? 'text-blue-600' : 'text-red-500'}`}>{passwordMatchMessage}</p>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-center pt-4">
            <button type="submit" className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800">수정 완료</button>
          </div>
        </form>
      </div>
    </MyPageLayout>
  );
}