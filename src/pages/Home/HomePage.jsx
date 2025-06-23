import React, { useEffect, useState } from 'react';
import SearchSection from '../../components/ui/homePage/SearchSection.tsx';
import TrendingHashtags from '../../components/ui/homePage/TrendingHashtags.tsx';
import FeaturedContent from '../../components/ui/homePage/FeaturedContent';
import i18n from '../../i18n';

const HomePage = () => {
  const [imagePreviewData, setImagePreviewData] = useState(null);
  const currentLang = i18n.language.toLowerCase();
  useEffect(() => {
    const fetchImagePreview = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/places/search/image-preview?languageCode=${currentLang}`,
          { credentials: 'include' }
        );
        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }
        const data = await response.json();
        setImagePreviewData(data);
      } catch (error) {
        console.error('이미지 프리뷰 불러오기 실패:', error);
      }
    };
    fetchImagePreview();
  }, [currentLang]); 

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-20 flex flex-col gap-4 justify-start">
        <SearchSection />
        <TrendingHashtags />
        <FeaturedContent data={imagePreviewData} />
      </main>
    </div>
  );
};

export default HomePage;

