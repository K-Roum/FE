import React from 'react';

const FeaturedContent = () => {
  const featuredItems = [
    {
      id: 1,
      image: '/images/rectangle_1.jpg',
      alt: 'Korean Tteokbokki dish with eggs',
    },
    {
      id: 2,
      image: '/images/rectangle_2.jpg',
      alt: 'Lotte World Tower in Seoul',
    },
    {
      id: 3,
      image: '/images/rectangle_3.jpg',
      alt: 'Gangmun Beach',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {featuredItems.map((item) => (
        <div key={item.id} className="cursor-pointer transform transition-transform hover:scale-105">
          <img 
            src={item.image} 
            alt={item.alt} 
            className="w-full h-[363px] object-cover rounded-[30px]"
          />
          <div className="mt-2 text-center">
            <h3 className="text-xl font-medium">{item.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedContent;