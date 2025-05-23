import { useLocation } from 'react-router-dom';
import SearchResultCard from '../../components/ui/SearchResultCard';

const SearchPage = () => {
  const location = useLocation();
  const { query, results } = location.state || {};
  
  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-100">
        {/* 왼쪽 패널 내용 */}
      </div>

      <div className="w-1/2 p-8 overflow-y-auto">
        {/* <h1 className="text-2xl font-bold mb-4">"{query}"에 대한 검색 결과</h1> */}
        {results && results.length > 0 ? (
          <ul className="space-y-6">
            {results.map((item, index) => (
              <li key={index}>
                <SearchResultCard item={item} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;