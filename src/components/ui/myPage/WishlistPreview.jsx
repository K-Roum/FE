// components/ui/myPage/WishlistPreview.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WishlistPreview({ bookmarks = [], isFull = false }) {
  const navigate = useNavigate();

  const displayList = isFull ? bookmarks : bookmarks.slice(0, 4);

  return (
    <section className="mb-12 pb-8">
      {!isFull && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">찜 목록</h3>
            <button
              onClick={() => navigate('/mypage/wishlist')}
              className="text-sm text-blue-600 hover:underline"
            >
              전체 보기 &gt;
            </button>
          </div>
          <div className="border-b-2 border-black mb-6" />
        </div>
      )}

      {bookmarks.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">찜 한 곳이 없어요.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayList.map((item, index) => (
            <div key={index} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              {item.firstImageUrl && (
                <img
                  src={item.firstImageUrl}
                  alt={item.placeName}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <p className="font-medium">{item.placeName}</p>
              <p className="text-sm text-gray-500">{item.createdAt}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
