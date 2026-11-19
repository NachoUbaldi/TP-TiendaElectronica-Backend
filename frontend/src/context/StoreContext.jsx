import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getInfoComercio, updateInfoComercio } from '../services/api';
import { INITIAL_INFO } from '../services/fallbackData';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [info, setInfo] = useState(INITIAL_INFO);
  const [loadingInfo, setLoadingInfo] = useState(true);

  const refreshInfo = useCallback(async () => {
    setLoadingInfo(true);
    try {
      const data = await getInfoComercio();
      if (data) setInfo(data);
    } catch {
      // Keep fallback info if 404 on empty DB
    } finally {
      setLoadingInfo(false);
    }
  }, []);

  useEffect(() => {
    refreshInfo();
  }, [refreshInfo]);

  const saveInfo = async (payload) => {
    const updated = await updateInfoComercio(payload);
    setInfo(updated);
    return updated;
  };

  return (
    <StoreContext.Provider value={{ info, loadingInfo, refreshInfo, saveInfo }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

