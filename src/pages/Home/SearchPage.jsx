import { useLocation } from 'react-router-dom';
import { useState } from 'react'; 
import SearchResultCard from '../../components/ui/searchPage/SearchResultCard';
import DetailModal from '../../components/ui/searchPage/DetailModal';
const SearchPage = () => {
  const location = useLocation();
  const { query, results } = location.state || {};
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-100">
        {/* 왼쪽 패널 내용 */}
      </div>
      
      <div className="w-1/2 p-8 overflow-y-auto">
        {results && results.length > 0 ? (
          <ul className="space-y-6">
            {results.map((item, index) => (
              <li key={index}>
                <SearchResultCard 
                  item={item} 
                  onCardClick={handleCardClick}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">결과가 없습니다.</p>
          </div>
        )}
      </div>
      <DetailModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SearchPage;