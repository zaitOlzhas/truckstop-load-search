'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { Load } from '@/types/api';

interface LoadDetailModalProps {
  load: Load | null;
  open: boolean;
  onClose: () => void;
}

export default function LoadDetailModal({ load, open, onClose }: LoadDetailModalProps) {
  if (!load) return null;

  const DetailRow = ({ label, value }: { label: string; value: any }) => (
    <Grid container spacing={2} sx={{ mb: 1 }}>
      <Grid item xs={4}>
        <Typography variant="body2" fontWeight="bold" color="text.secondary">
          {label}:
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body2">{value || '-'}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Load Details - ID: {load.id}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Company Information</Typography>
          <DetailRow label="Company Name" value={load.truckCompanyName} />
          <DetailRow label="Company City" value={load.truckCompanyCity} />
          <DetailRow label="Company State" value={load.truckCompanyState} />
          <DetailRow label="Company Phone" value={load.truckCompanyPhone} />
          <DetailRow label="Company Email" value={load.truckCompanyEmail} />
          <DetailRow label="Company Fax" value={load.truckCompanyFax} />
          <DetailRow label="Company ID" value={load.truckCompanyId} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Contact Information</Typography>
          <DetailRow label="Point of Contact" value={load.pointOfContact} />
          <DetailRow label="Contact Phone" value={load.pointOfContactPhone} />
          <DetailRow label="Handle Name" value={load.handleName} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Load Details</Typography>
          <DetailRow label="Equipment Type" value={load.equipmentTypes?.description || load.equipment} />
          <DetailRow label="Load Type" value={load.loadType} />
          <DetailRow label="Length" value={load.length ? `${load.length}'` : '-'} />
          <DetailRow label="Weight" value={load.weight ? `${load.weight.toLocaleString()} lbs` : '-'} />
          <DetailRow label="Width" value={load.width ? `${load.width}'` : '-'} />
          <DetailRow label="Quantity" value={load.quantity} />
          <DetailRow label="Payment Amount" value={load.paymentAmount ? `$${load.paymentAmount.toLocaleString()}` : '-'} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Origin</Typography>
          <DetailRow label="City" value={load.originCity} />
          <DetailRow label="State" value={load.originState} />
          <DetailRow label="Country" value={load.originCountry} />
          <DetailRow label="Zip" value={load.originZip} />
          <DetailRow label="Distance" value={load.originDistance ? `${load.originDistance} mi` : '-'} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Destination</Typography>
          <DetailRow label="City" value={load.destinationCity} />
          <DetailRow label="State" value={load.destinationState} />
          <DetailRow label="Country" value={load.destinationCountry} />
          <DetailRow label="Zip" value={load.destinationZip} />
          <DetailRow label="Distance" value={load.destinationDistance ? `${load.destinationDistance} mi` : '-'} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Schedule</Typography>
          <DetailRow label="Pickup Date" value={load.pickupDate} />
          <DetailRow label="Pickup Time" value={load.pickupTime} />
          <DetailRow label="Delivery Date" value={load.deliveryDate} />
          <DetailRow label="Delivery Time" value={load.deliveryTime} />
          <DetailRow label="Entered" value={load.entered} />
          <DetailRow label="Age" value={load.age} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Additional Information</Typography>
          <DetailRow label="Stops" value={load.stops} />
          <DetailRow label="Mileage" value={load.mileage ? `${load.mileage} mi` : '-'} />
          <DetailRow label="Special Info" value={load.specInfo} />
          <DetailRow label="Bond" value={load.bond ? `$${load.bond}` : '-'} />
          <DetailRow label="Has Bonding" value={load.hasBonding ? 'Yes' : 'No'} />
          <DetailRow label="Bond Type ID" value={load.bondTypeID} />
          <DetailRow label="Credit" value={load.credit} />
          <DetailRow label="DOT Number" value={load.dotNumber} />
          <DetailRow label="MC Number" value={load.mcNumber} />
          <DetailRow label="TMC Number" value={load.tmcNumber} />
          <DetailRow label="Experience Factor" value={load.experienceFactor} />
          <DetailRow label="Is Friend" value={load.isFriend ? 'Yes' : 'No'} />
          <DetailRow label="Is Deleted" value={load.isDeleted ? 'Yes' : 'No'} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
