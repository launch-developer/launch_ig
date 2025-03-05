import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface StoreContextType {
  storeName: string;
  setStoreName: (name: string) => void;
  announcementText: string;
  setAnnouncementText: (text: string) => void;
}

const defaultContext: StoreContextType = {
  storeName: 'Minimal Store',
  setStoreName: () => {},
  announcementText: 'Winter sale | Extra 20% off further markdowns',
  setAnnouncementText: () => {},
};

const StoreContext = createContext<StoreContextType>(defaultContext);

export const useStore = () => useContext(StoreContext);

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [storeName, setStoreName] = useState(defaultContext.storeName);
  const [announcementText, setAnnouncementText] = useState(defaultContext.announcementText);
  
  // Load saved values from localStorage on component mount
  useEffect(() => {
    const savedStoreName = localStorage.getItem('storeName');
    const savedAnnouncementText = localStorage.getItem('announcementText');
    
    if (savedStoreName) setStoreName(savedStoreName);
    if (savedAnnouncementText) setAnnouncementText(savedAnnouncementText);
  }, []);
  
  // Save values to localStorage when they change
  useEffect(() => {
    localStorage.setItem('storeName', storeName);
  }, [storeName]);
  
  useEffect(() => {
    localStorage.setItem('announcementText', announcementText);
  }, [announcementText]);
  
  return (
    <StoreContext.Provider value={{ storeName, setStoreName, announcementText, setAnnouncementText }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext; 