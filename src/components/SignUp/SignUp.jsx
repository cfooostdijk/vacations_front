import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import signUp from '../../services/SignUpService';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AlertDialog from '../AlertDialog';

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', message: '' });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await signUp(email, password);
      // console.log('SignUp successful:', response);
      setDialogContent({ title: 'Success', message: 'Sign up successful! Please use your credentials again in the signin.' });
      handleOpen();
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (error) {
      // console.error('Error signing up:', error);
      let errorMessage = 'Unknown error occurred.';
      if (error.response) {
        if (error.response.status === 422) {
          errorMessage = 'Invalid email or password (6 chars min). Please try again.';
        } else {
          errorMessage = error.response.data.message || 'Unknown error occurred.';
        }
      }
      setDialogContent({ title: 'Error', message: errorMessage });
      handleOpen();
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link component={RouterLink} to="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <AlertDialog
          open={open}
          handleClose={handleClose}
          title={dialogContent.title}
          message={dialogContent.message}
        />
      </Container>
    </ThemeProvider>
  );
}
