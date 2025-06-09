import React from 'react';

const FeaturedContent = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        추천 이미지를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {data.map((item, idx) => (
        <div key={item.id || idx} className="cursor-pointer transform transition-transform hover:scale-105">
          <img
            src={item.image || item.imageUrl}
            alt={item.alt || item.title || '추천 이미지'}
            className="w-full h-[363px] object-cover rounded-[30px]"
          />
          <div className="mt-2 text-center">
            <h3 className="text-xl font-medium">{item.title || ''}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedContent;