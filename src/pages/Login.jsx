import { Box, Button, TextField, Typography, IconButton, CircularProgress, InputAdornment} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI, forgotPassword } from '../api/auth';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff, Person, Lock} from '@mui/icons-material';
import background from '../assets/images/bgImg.jpg';
import Logo from '../assets/images/Logo.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cookies, setCookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const onSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('All fields are required!');
      return;
    }

    loginAPI({ username, password })
      .then((res) => {
        if (res?.ok) {
          setCookie('AUTH_TOKEN', res.data.token);
          localStorage.setItem('token', res.data.token);
          dispatch(login({ user: res.data.user, token: res.data.token }));
          const role_id = res.data.user.role_id;
          navigate(
            role_id === 'Admin' || role_id === 1 ? '/admin/dashboard' : '/user/dashboard',{ replace: true }
          );
          toast.success(res?.message ?? 'Login successfully.');
        } else {
          toast.error(res?.message ?? 'Something went wrong.');
        }
      })
      .catch(() => toast.error("Account Doesn't Exist."));
  };

  const handleForgotPassword = () => {
    if (!username.trim()) {
      toast.error('Please enter your username first.');
      return;
    }

    setLoading(true);
    forgotPassword({ username })
      .then((res) => {
        setLoading(false);
        if (res?.ok) {
          toast.success(res?.message ?? 'Check your email to reset your password.');
        } else {
          toast.error(res?.message ?? 'Something went wrong.');
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error('Error processing request.');
      });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2, backgroundImage: `url(${background})`,  backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
        <Box  sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' }, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 4, padding: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: 900, boxShadow: 3}}>
        <Box  sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'black', textAlign: 'center', gap: 2, padding: 2 }}>
                <img src={Logo} alt="Logo" style={{ width: '40%', maxWidth: '120px' }}/>
                <Typography variant="h5" fontWeight="bold">Facility Management System</Typography>
                <Typography variant="body1">UNIVERSITY OF RIZAL SYSTEM</Typography>
                <Typography variant="body1">CAINTA CAMPUS</Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: { xs: 2, sm: 3, md: 4 }, textAlign: 'center'}}>
            <Typography variant="h5" fontWeight="bold" color="black" mb={2} sx={{mt:{xs: -4}}}> Log In</Typography>
            <Typography color="gray" mb={3}>Welcome, please log in to your account. </Typography>

          <form onSubmit={onSubmit}>
              <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  )
                }}
              />
              <TextField label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) =>           setPassword(e.target.value)} fullWidth margin="normal" InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}/>
              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ backgroundColor: '#02318A', color: 'white', fontWeight: 'bold', mt: 2}}>{loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}</Button>

              <Button variant="text" color="primary" sx={{ mt: 2, fontSize: '0.875rem' }} onClick={handleForgotPassword} disabled={loading} > Forgot Password? </Button>
          </form>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999}} >
            <CircularProgress size={50} color="primary" />
        </Box>
      )}
    </Box>
  );
}
