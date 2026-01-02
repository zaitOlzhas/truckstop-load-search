'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { TruckStopConfig } from '@/types/api';

interface ConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: TruckStopConfig) => void;
  initialConfig?: TruckStopConfig | null;
}

export default function ConfigDialog({
  open,
  onClose,
  onSave,
  initialConfig,
}: ConfigDialogProps) {
  const [integrationId, setIntegrationId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    if (initialConfig) {
      setIntegrationId(initialConfig.integrationId);
      setUserName(initialConfig.userName);
      setPassword(initialConfig.password);
    }
  }, [initialConfig]);

  const handleSave = () => {
    const config: TruckStopConfig = {
      integrationId,
      userName,
      password,
    };
    onSave(config);
    onClose();
  };

  const isValid = integrationId && userName && password;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>TruckStop API Configuration</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Integration ID"
            type="text"
            value={integrationId}
            onChange={(e) => setIntegrationId(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!isValid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
