import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SearchResultModel } from '../../../model/SearchResultModel'; 

const SearchSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      alert(t('searchPrompt'));
      return;
    }

    const currentLang = i18n.language.toLowerCase(); 

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

      const data: SearchResultModel[] = await response.json(); 

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#919191"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
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
