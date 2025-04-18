import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth'; // API call for resetting password
import { TextField, Button, Card, CardContent, Typography, Alert, Container } from '@mui/material';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const username = searchParams.get('username');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
  
      console.log('API Response:', response); // Debugging
  
      if (response.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.message || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('An error occurred while resetting password.');
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 5, p: 3, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Reset Password</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField label="New Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <TextField label="Confirm Password" type="password" fullWidth margin="normal" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
