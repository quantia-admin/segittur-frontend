import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import overlayImage from '../assets/overlay.jpg'; 

export default function LoginLayout({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
 
        height: '100%',
        backgroundColor: '#f5f5f5', 
        '&::before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          opacity: 0.24,
          position: 'fixed',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: `url(${overlayImage})`, 
        },
      }}
    >
      <CssBaseline />
      {children}
    </Box>
  );
}
