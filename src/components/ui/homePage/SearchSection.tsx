import React, { useState, useEffect, FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SearchResultModel } from "../../../model/SearchResultModel";
import { motion, AnimatePresence } from "framer-motion";
import config from "../../../config";
import {
  fetchRecentSearches,
  performSearch,
} from "../../../services/SearchApi.ts";

const SearchSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<
    { searchText: string; createdAt: string }[]
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      setRecentSearches(await fetchRecentSearches());
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      alert(t("searchPrompt"));
      return;
    }
    executeSearch(searchQuery);
  };
  const executeSearch = async (query: string) => {
    const currentLang = i18n.language.toLowerCase();
    const data = await performSearch(query, currentLang);
    navigate(`/searchPage?query=${encodeURIComponent(query)}`, {
      state: { results: data },
    });
  };

  const handleRecentSearchClick = (text: string) => {
    setSearchQuery(text);
    setIsDropdownOpen(false);
    executeSearch(text);
  };

  return (
    <div className="flex justify-center mt-8 mb-8">
      <div className="relative w-full max-w-[824px]" ref={containerRef}>
        <form onSubmit={handleSearch} className="w-full">
          <div
            className="flex items-center h-[80px] w-full bg-white rounded-[15px] shadow-[0px_4px_30px_rgba(0,0,0,0.25)]"
            onMouseEnter={() => setIsDropdownOpen(true)}
          >
            <input
              type="text"
              placeholder={t("searchPrompt")}
              className="h-full flex-grow px-4 pl-8 text-[28px] text-[#919191] font-['LG_PC'] focus:outline-none rounded-[40px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="flex items-center ml-auto pr-6">
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
            </button>
          </div>
        </form>

        <AnimatePresence>
          {isDropdownOpen && recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full bg-white rounded-b-[20px] shadow-lg max-h-60 overflow-y-auto"
            >
              <ul>
                {recentSearches.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 pl-8 py-2 cursor-pointer hover:bg-gray-100 text-gray-700 text-xl font-['LG_PC']"
                    onMouseDown={() => handleRecentSearchClick(item.searchText)}
                  >
                    {item.searchText}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchSection;
