// /components/ui/myPage/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="text-xl text-gray-800 space-y-20">
      {/* 마이 페이지 제목 */}
      <div>
        <h2
            className="text-2xl font-bold mb-8 cursor-pointer hover:underline"
            onClick={() => navigate('/mypage')}
        >
            {t('sidebar.myPageTitle')}
        </h2>
      </div>

      {/* 내 카테고리 */}
      <div>
        <h3 className="font-semibold mb-4 text-2xl">{t('sidebar.myCategoryTitle')}</h3>
        <ul className="space-y-4 pl-4">
          <li className="cursor-pointer hover:underline" onClick={() => navigate('/mypage/wishlist')}>{t('sidebar.wishlist')}</li>
          <li className="cursor-pointer hover:underline" onClick={() => navigate('/mypage/review-list')}>{t('sidebar.reviewList')}</li>
        </ul>
      </div>

      {/* 계정관리 */}
      <div>
        <h3 className="font-semibold mb-4 text-2xl">{t('sidebar.accountManagementTitle')}</h3>
        <ul className="space-y-4 pl-4">
          <li className="cursor-pointer hover:underline" onClick={() => navigate('/mypage/profile-edit')}>{t('sidebar.profileEdit')}</li>
        </ul>
      </div>
    </div>
  );
}
