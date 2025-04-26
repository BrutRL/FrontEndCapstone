import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth'; // API call for resetting password
import { TextField, Button, Card, CardContent, Typography, Alert, IconButton, InputAdornment, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import visibility icons
import background from '../assets/images/bgImg.jpg';
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const username = searchParams.get('username');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false); // State to toggle confirm password visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    try {
      const response = await resetPassword({
        username,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
  
  
      if (response.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.message || 'Failed to reset password.');
      }
    } catch (error) {
      setError('An error occurred while resetting password.');
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: 2, backgroundImage: `url(${background})`, backgroundRepeat:"no-repeat", backgroundSize: "cover" }}>
      <Card sx={{ mt: 5, p: 3, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 1)', width: '100%', maxWidth: 600,  boxSizing: 'border-box', }}>
        <CardContent>
          <Typography variant="h5" gutterBottom> Reset your password</Typography>{error && <Alert severity="error">{error}</Alert>}{success && <Alert severity="success">{success}</Alert>}
          <Typography sx={{fontSize: '11px',color: 'text.secondary'}}> (Make sure to change your password within 6 minutes. After this time frame, the token will expire)</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="New Password" type={showPassword ? 'text' : 'password'} fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required InputProps={{endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}/>
            <TextField label="Confirm Password" type={showPasswordConfirmation ? 'text' : 'password'} fullWidth margin="normal" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required InputProps={{endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)} edge="end">
                      {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }} />
            <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: '#1632A2',width:{xs: '100%',sm: '300px'},'&:hover': {backgroundColor: '#0c2461',},}} fullWidth> Reset Password</Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
