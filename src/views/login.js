import React, { useState } from 'react';
import {
  Box, Button, TextField, IconButton, Typography, InputAdornment, Divider
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import bgLogin from '../assets/Diseño-sin-título-100-modified.png';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  backgroundColor: '#f9f9f9',
  fontFamily: 'Montserrat, sans-serif',
}));

const IllustrationContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
}));

const FormContainer = styled(Box)(({ theme }) => ({
  flex: '0 1 30%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(5),
  backgroundColor: '#fff',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
  marginRight: '0',
  height: '100%',
}));

export default function SignInView() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (email === 'turismosalud@segittur.com' && password === 'turismosalud') {
      navigate('/admin/centros-salud');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <Container>
      <IllustrationContainer>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <img
            src={bgLogin}
            alt="Illustration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#922220',
              opacity: 0.1,
            }}
          />
        </Box>
      </IllustrationContainer>

      <FormContainer>
        <Typography sx={{ fontFamily: 'Montserrat, sans-serif', fontSize: '25px' }} variant="h4" gutterBottom>
          Plataforma Turismo de Salud! 👋
        </Typography>
        <Typography sx={{ fontFamily: 'Montserrat, sans-serif', fontSize: '15px' }} variant="body1" color="textSecondary" gutterBottom>
          Inicia sesión para poder insertar y consultar datos acerca de los datos de tu centro de salud!
        </Typography>

        <TextField
          label="Email or Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ backgroundColor: '#fdf3f3', fontFamily: 'Montserrat, sans-serif' }}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ backgroundColor: '#fdf3f3', fontFamily: 'Montserrat, sans-serif' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  <Icon icon={showPassword ? 'mdi:eye' : 'mdi:eye-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginY: 2,
            backgroundColor: '#922220',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px 0',
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            '&:hover': {
              backgroundColor: '#a63b3b',
              transform: 'scale(1.05)',
            },
          }}
          onClick={handleSignIn}
        >
          Login
        </Button>

        <Divider sx={{ my: 2 }} />
      </FormContainer>
    </Container>
  );
}
