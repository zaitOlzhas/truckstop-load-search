'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ConfigDialog from '@/components/ConfigDialog';
import SearchCriteria from '@/components/SearchCriteria';
import LoadsTable from '@/components/LoadsTable';
import { TruckStopConfig, SearchCriteria as SearchCriteriaType, Load } from '@/types/api';
import { TruckStopApiService } from '@/services/api';
import { loadConfig, saveConfig } from '@/utils/storage';

export default function Home() {
  const [config, setConfig] = useState<TruckStopConfig | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [criteria, setCriteria] = useState<SearchCriteriaType>({
    originCountry: 'USA',
    destinationCountry: 'USA',
    equipmentType: 'ANY',
    loadType: 'All',
    hoursOld: 0,
    pageNumber: 1,
    pageSize: 50,
    sortBy: 'Age',
    sortDescending: false,
  });
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Auto-refresh state
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5); // seconds
  const autoRefreshRef = useRef(false);

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = loadConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    } else {
      setConfigDialogOpen(true);
    }
  }, []);

  // Search function
  const handleSearch = useCallback(async (isAutoRefresh = false) => {
    if (!config) {
      setError('Please configure your API credentials first');
      setConfigDialogOpen(true);
      return;
    }

    // Only show full loader for manual searches, not auto-refresh
    if (isAutoRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await TruckStopApiService.searchLoads({
        integrationId: config.integrationId,
        userName: config.userName,
        password: config.password,
        criteria,
      });

      setLoads(response.loads);
      setTotalResults(response.totalResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search loads';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [config, criteria]);

  // Auto-refresh effect
  useEffect(() => {
    autoRefreshRef.current = autoRefresh;
  }, [autoRefresh]);

  useEffect(() => {
    if (!autoRefresh || !config) {
      return;
    }

    const intervalId = setInterval(() => {
      if (autoRefreshRef.current) {
        handleSearch(true);
      }
    }, refreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, config, handleSearch]);

  const handleConfigSave = (newConfig: TruckStopConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handlePageChange = (newPage: number) => {
    setCriteria(prev => ({ ...prev, pageNumber: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setCriteria(prev => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }));
  };

  // Trigger search when pagination changes
  useEffect(() => {
    if (config && loads.length > 0) {
      handleSearch(false);
    }
  }, [criteria.pageNumber, criteria.pageSize]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Image
              src="/logo.svg"
              alt="TruckStop"
              width={150}
              height={40}
              priority
              style={{ objectFit: 'contain' }}
            />
          </Box>
          <IconButton
            color="inherit"
            onClick={() => setConfigDialogOpen(true)}
            title="Configuration"
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 1.5, width: '100%' }}>
        <SearchCriteria
          criteria={criteria}
          onCriteriaChange={setCriteria}
          onSearch={() => handleSearch(false)}
          autoRefresh={autoRefresh}
          refreshInterval={refreshInterval}
          onAutoRefreshChange={setAutoRefresh}
          onRefreshIntervalChange={setRefreshInterval}
          refreshing={refreshing}
        />

        <LoadsTable
          loads={loads}
          loading={loading}
          totalResults={totalResults}
          page={criteria.pageNumber || 1}
          pageSize={criteria.pageSize || 50}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </Box>

      <ConfigDialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        onSave={handleConfigSave}
        initialConfig={config}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
