import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      alert(t('searchPrompt'));
      return;
    }

    const currentLang = i18n.language.toLowerCase(); // ex) "ko" → "KO"

    try {
      const response = await fetch('http://localhost:8080/places/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({
          query: searchQuery,
          languageCode: currentLang,
        }),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();

      console.log('Response:', response);
      console.log('Data:', data);

      navigate('/searchPage', {
        state: { query: searchQuery, results: data },
      });
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      alert('검색에 실패했습니다.');
    }
  };

  return (
    <div className="flex justify-center mt-16 mb-8">
      <div className="relative w-full max-w-[609px]">
        <form onSubmit={handleSearch} className="w-full">
          <div className="flex items-center h-[80px] w-full bg-white rounded-[40px] shadow-[0px_4px_30px_rgba(0,0,0,0.25)]">
            <div className="flex items-center pl-6">
              {/* 돋보기 아이콘 여기에 넣기 */}
            </div>
            <input
              type="text"
              placeholder={t('searchPrompt')}
              className="h-full flex-grow px-4 text-[24px] text-[#919191] font-['LG_PC'] focus:outline-none rounded-[40px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchSection;
