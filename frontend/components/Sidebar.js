'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ onSelectSymbol, selectedSymbol }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stocks`);
        setCompanies(res.data);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <nav className="w-full md:w-64 flex-shrink-0 bg-gray-800 p-4 md:overflow-y-auto overflow-x-auto shadow-xl border-b md:border-r border-gray-700">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2 border-gray-700 text-gray-100 hidden md:block">Companies</h2>
      <ul className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          companies.map((company) => (
            <li
              key={company.symbol}
              className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 text-sm md:text-base whitespace-nowrap ${
                selectedSymbol === company.symbol
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-700'
              }`}
              onClick={() => onSelectSymbol(company.symbol)}
            >
              {company.name} ({company.symbol})
            </li>
          ))
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;