import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import signIn from '../../services/SignInService';
import AlertDialog from '../AlertDialog';
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
import { useAuth } from '../../context/AuthContext';

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [open, setOpen] = React.useState(false); // Estado para controlar el diálogo
  const [dialogContent, setDialogContent] = React.useState({ title: '', message: '' }); // Contenido del diálogo

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    try {
      const token = await signIn(email, password);
      login(token);
      setDialogContent({ title: 'Success', message: 'Sign in successful! Welcome to the application.' });
      handleOpen(); // Abrir diálogo después de un inicio de sesión exitoso
      setTimeout(() => {
        navigate('/home');
      }, 3000); // Redirigir después de 3 segundos (ajustar según sea necesario)
    } catch (error) {
      console.error('Error signing in:', error);
      let errorMessage = 'Unknown error occurred.';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else {
          errorMessage = error.response.data.message || 'Unknown error occurred.';
        }
      }
      setDialogContent({ title: 'Error', message: errorMessage });
      handleOpen(); // Abrir diálogo después de un inicio de sesión fallido
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link component={RouterLink} to="/" variant="body2">
                  {"Don't have an account? Sign Up"}
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
