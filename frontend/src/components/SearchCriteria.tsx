'use client';

import React, { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  MenuItem,
  Button,
  Collapse,
  IconButton,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Divider,
  Autocomplete,
  Chip,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { SearchCriteria as SearchCriteriaType } from '@/types/api';
import { Country, EquipmentType, LoadType, SortBy, getStateProvinceOptions } from '@/types/enums';

interface SearchCriteriaProps {
  criteria: SearchCriteriaType;
  onCriteriaChange: (criteria: SearchCriteriaType) => void;
  onSearch: () => void;
  autoRefresh: boolean;
  refreshInterval: number;
  onAutoRefreshChange: (enabled: boolean) => void;
  onRefreshIntervalChange: (interval: number) => void;
  refreshing?: boolean;
}

export default function SearchCriteria({
  criteria,
  onCriteriaChange,
  onSearch,
  autoRefresh,
  refreshInterval,
  onAutoRefreshChange,
  onRefreshIntervalChange,
  refreshing = false,
}: SearchCriteriaProps) {
  const [expanded, setExpanded] = useState(true);

  const handleChange = (field: keyof SearchCriteriaType, value: any) => {
    onCriteriaChange({ ...criteria, [field]: value });
  };

  const getSummary = () => {
    const parts: string[] = [];
    const originStates = Array.isArray(criteria.originState) ? criteria.originState.join(', ') : criteria.originState;
    const destStates = Array.isArray(criteria.destinationState) ? criteria.destinationState.join(', ') : criteria.destinationState;
    if (criteria.originCity) parts.push(`From: ${criteria.originCity}, ${originStates}`);
    if (criteria.destinationCity) parts.push(`To: ${criteria.destinationCity}, ${destStates}`);
    if (criteria.equipmentType) {
      const types = Array.isArray(criteria.equipmentType)
        ? criteria.equipmentType.join(', ')
        : criteria.equipmentType;
      parts.push(`Equipment: ${types}`);
    }
    return parts.join(' | ') || 'No criteria set';
  };

  const originStateOptions = getStateProvinceOptions(criteria.originCountry);
  const destinationStateOptions = getStateProvinceOptions(criteria.destinationCountry);

  // Get equipment type options as array
  const equipmentTypeOptions = Object.entries(EquipmentType).map(([key, value]) => ({
    label: key.replace(/_/g, ' '),
    value: value,
  }));

  // Convert equipmentType to array for multi-select
  const selectedEquipmentTypes = criteria.equipmentType
    ? (Array.isArray(criteria.equipmentType) ? criteria.equipmentType : [criteria.equipmentType])
    : [];

  // Convert states to arrays for multi-select
  const selectedOriginStates = criteria.originState
    ? (Array.isArray(criteria.originState) ? criteria.originState : [criteria.originState])
    : [];
  const selectedDestinationStates = criteria.destinationState
    ? (Array.isArray(criteria.destinationState) ? criteria.destinationState : [criteria.destinationState])
    : [];

  return (
    <Paper elevation={3} sx={{ p: 1.5, mb: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: expanded ? 1 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            Search Criteria
          </Typography>
          {!expanded && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {getSummary()}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={autoRefresh}
                onChange={(e) => onAutoRefreshChange(e.target.checked)}
                size="small"
              />
            }
            label="Auto-Refresh"
            sx={{ m: 0 }}
          />
          {autoRefresh && (
            <TextField
              label="Interval (sec)"
              type="number"
              size="small"
              value={refreshInterval}
              onChange={(e) => onRefreshIntervalChange(Math.max(2, Number(e.target.value)))}
              inputProps={{ min: 2 }}
              sx={{ width: 100 }}
            />
          )}
          <Button
            variant="contained"
            startIcon={refreshing ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
            onClick={onSearch}
            size={expanded ? 'medium' : 'small'}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Search'}
          </Button>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>
            Origin
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Country"
                select
                value={criteria.originCountry || ''}
                onChange={(e) => {
                  handleChange('originCountry', e.target.value);
                  handleChange('originState', ''); // Reset state when country changes
                }}
                fullWidth
              >
                {Object.entries(Country).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Autocomplete
                multiple
                freeSolo
                options={originStateOptions}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                value={selectedOriginStates}
                onChange={(e, newValue) => {
                  const codes = newValue.map(v => typeof v === 'string' ? v : v.code);
                  handleChange('originState', codes.length > 0 ? codes : '');
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={typeof option === 'string' ? option : option.code}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="State/Province (Multiple)" />}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="City"
                value={criteria.originCity || ''}
                onChange={(e) => handleChange('originCity', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Range (mi)"
                type="number"
                value={criteria.originRange || ''}
                onChange={(e) => handleChange('originRange', Number(e.target.value))}
                fullWidth
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 1.5, mb: 1, fontWeight: 'bold' }}>
            Destination
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Country"
                select
                value={criteria.destinationCountry || ''}
                onChange={(e) => {
                  handleChange('destinationCountry', e.target.value);
                  handleChange('destinationState', ''); // Reset state when country changes
                }}
                fullWidth
              >
                {Object.entries(Country).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Autocomplete
                multiple
                freeSolo
                options={destinationStateOptions}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                value={selectedDestinationStates}
                onChange={(e, newValue) => {
                  const codes = newValue.map(v => typeof v === 'string' ? v : v.code);
                  handleChange('destinationState', codes.length > 0 ? codes : '');
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={typeof option === 'string' ? option : option.code}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="State/Province (Multiple)" />}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="City"
                value={criteria.destinationCity || ''}
                onChange={(e) => handleChange('destinationCity', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Range (mi)"
                type="number"
                value={criteria.destinationRange || ''}
                onChange={(e) => handleChange('destinationRange', Number(e.target.value))}
                fullWidth
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />

          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={equipmentTypeOptions}
                getOptionLabel={(option) => option.label}
                value={equipmentTypeOptions.filter(opt => selectedEquipmentTypes.includes(opt.value))}
                onChange={(e, newValue) => {
                  const values = newValue.map(v => v.value);
                  handleChange('equipmentType', values.length > 0 ? values : 'ANY');
                }}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{option.label}</span>
                      <span style={{ marginLeft: 'auto', opacity: 0.6, fontSize: '0.85em' }}>{option.value}</span>
                    </Box>
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.value}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Equipment Type (Multiple)"
                    placeholder="Select equipment types"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Pickup Dates
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newDates = [...(criteria.pickupDates || []), new Date()];
                        handleChange('pickupDates', newDates);
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {(criteria.pickupDates || []).map((date, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <DatePicker
                        value={date}
                        onChange={(newDate) => {
                          if (newDate) {
                            const newDates = [...(criteria.pickupDates || [])];
                            newDates[index] = newDate;
                            handleChange('pickupDates', newDates);
                          }
                        }}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                          },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newDates = (criteria.pickupDates || []).filter((_, i) => i !== index);
                          handleChange('pickupDates', newDates.length > 0 ? newDates : undefined);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Load Type"
                select
                value={criteria.loadType || 'All'}
                onChange={(e) => handleChange('loadType', e.target.value)}
                fullWidth
              >
                {Object.values(LoadType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Sort By"
                select
                value={criteria.sortBy || 'Age'}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                fullWidth
              >
                {Object.values(SortBy).map((sort) => (
                  <MenuItem key={sort} value={sort}>
                    {sort}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={criteria.sortDescending ?? false}
                    onChange={(e) => handleChange('sortDescending', e.target.checked)}
                  />
                }
                label="Sort Desc"
                sx={{ mt: 0.5 }}
              />
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
}
