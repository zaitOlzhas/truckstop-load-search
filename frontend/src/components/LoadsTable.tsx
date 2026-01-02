'use client';

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import { Load } from '@/types/api';
import { calculateElapsedTime } from '@/utils/timeUtils';
import LoadDetailModal from './LoadDetailModal';

interface LoadsTableProps {
  loads: Load[];
  loading: boolean;
  totalResults: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function LoadsTable({
  loads,
  loading,
  totalResults,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange
}: LoadsTableProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Update time every second for real-time elapsed time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRowClick = (load: Load) => {
    setSelectedLoad(load);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLoad(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1); // MUI uses 0-based, we use 1-based
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPageSizeChange(parseInt(event.target.value, 10));
    onPageChange(1); // Reset to first page
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading loads...</Typography>
      </Paper>
    );
  }

  if (loads.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No loads found. Try adjusting your search criteria.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper elevation={3}>
        <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">
            Search Results ({totalResults} total)
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Time Elapsed</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Pickup Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Equipment</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Mode</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Origin</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Destination</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Length</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Weight</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Rate</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loads.map((load) => (
                <TableRow
                  key={load.id}
                  hover
                  onClick={() => handleRowClick(load)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {calculateElapsedTime(load.entered)}
                    </Typography>
                  </TableCell>
                  <TableCell>{load.pickupDate}</TableCell>
                  <TableCell>
                    {load.equipmentTypes?.description || load.equipment}
                  </TableCell>
                  <TableCell>{load.loadType}</TableCell>
                  <TableCell>{load.truckCompanyName}</TableCell>
                  <TableCell>
                    {load.originCity}, {load.originState}
                  </TableCell>
                  <TableCell>
                    {load.destinationCity}, {load.destinationState}
                  </TableCell>
                  <TableCell>
                    {load.length ? `${load.length}'` : '-'}
                  </TableCell>
                  <TableCell>
                    {load.weight ? `${load.weight.toLocaleString()} lbs` : '-'}
                  </TableCell>
                  <TableCell>
                    {load.paymentAmount ? `$${load.paymentAmount.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {load.pointOfContact}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {load.pointOfContactPhone}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={totalResults}
          rowsPerPage={pageSize}
          page={page - 1} // MUI uses 0-based, we use 1-based
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <LoadDetailModal
        load={selectedLoad}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
