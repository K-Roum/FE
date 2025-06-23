// /pages/MyPage/MyPageLayout.jsx
import React from 'react';
import Sidebar from '../../components/ui/myPage/Sidebar';

export default function MyPageLayout({ children }) {
    return (
      <div className="flex w-full min-h-screen mt-20 font-lg-pc">
        {/* Sidebar (고정) */}
        <aside className="w-96 bg-gray-100 p-8 py-30 self-start ml-8">
          <Sidebar />
        </aside>
  
        {/* 페이지 별 내용 */}
        <main className="flex-grow p-8 space-y-12">
          {children}
        </main>
      </div>
    );
}