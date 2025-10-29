import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch debe ser usado dentro de un SearchProvider');
    }
    return context;
};

export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const updateSearchTerm = (term) => {
        setSearchTerm(term);
    };

    return (
        <SearchContext.Provider value={{ searchTerm, updateSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};

