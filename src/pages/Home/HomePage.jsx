import React from 'react';
import SearchSection from '../../components/ui/homePage/SearchSection.tsx';
import TrendingHashtags from '../../components/ui/homePage/TrendingHashtags';
import FeaturedContent from '../../components/ui/homePage/FeaturedContent';

const HomePage = () => {

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <SearchSection />
        <TrendingHashtags />
        <FeaturedContent />
      </main>
    </div>
  );
};

export default HomePage;