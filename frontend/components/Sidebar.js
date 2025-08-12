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
    <nav className="w-64 flex-shrink-0 bg-gray-800 p-4 overflow-y-auto shadow-xl border-r border-gray-700">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2 border-gray-700 text-gray-100">Companies</h2>
      <ul>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          companies.map((company) => (
            <li
              key={company.symbol}
              className={`p-3 my-2 rounded-lg cursor-pointer transition-colors duration-200 ${
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