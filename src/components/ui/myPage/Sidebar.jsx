// /components/ui/myPage/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="text-xl text-gray-800 space-y-20">
      {/* 마이 페이지 제목 */}
      <div>
        <h2
            className="text-2xl font-bold mb-8 cursor-pointer hover:underline"
            onClick={() => navigate('/mypage')}
        >
            마이 페이지
        </h2>
      </div>

      {/* 내 카테고리 */}
      <div>
        <h3 className="font-semibold mb-4 text-2xl">내 카테고리</h3>
        <ul className="space-y-4 pl-4">
          <li className="cursor-pointer hover:underline" onClick={() => navigate('/mypage/wishlist')}>찜 목록</li>
          <li className="cursor-pointer hover:underline" onClick={() => navigate('/mypage/review-list')}>리뷰 목록</li>
        </ul>
      </div>

      {/* 계정관리 */}
      <div>
        <h3 className="font-semibold mb-4 text-2xl">계정관리</h3>
        <ul className="space-y-4 pl-4">
          <li className="cursor-pointer hover:underline" onClick={() => navigate('/mypage/profile-edit')}>프로필 편집</li>
        </ul>
      </div>
    </div>
  );
}
