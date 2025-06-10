// components/ui/myPage/WishlistPreview.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function WishlistPreview({ bookmarks = [], isFull = false, onItemClick }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayList = isFull ? bookmarks : bookmarks.slice(0, 5);

  return (
    <section className="mb-12 pb-8">
      {!isFull && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{t('wishlistPreview.title')}</h3>
            <button
              onClick={() => navigate('/mypage/wishlist')}
              className="text-sm text-blue-600 hover:underline"
            >
              {t('common.viewAll')}
            </button>
          </div>
          <div className="border-b-2 border-black mb-6" />
        </div>
      )}

      {bookmarks.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">{t('wishlistPreview.noWishlist')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayList.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center border rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onItemClick && onItemClick(item)}
            >
              <div className="w-full h-40 rounded-t-xl overflow-hidden">
                {item.firstImageUrl ? (
                  <img
                    src={item.firstImageUrl}
                    alt={item.placeName}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-image.png'; }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-xl text-gray-400">
                    <span>{t('common.noImage')}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center w-full p-4">
                <p className="font-medium text-left flex-1 truncate text-lg">{item.placeName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
