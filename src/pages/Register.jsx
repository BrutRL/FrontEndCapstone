import { Box, Button, TextField, Typography, Container } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import { register } from '../api/auth';
import { toast } from 'react-toastify';
import background from '../assets/images/background.png';

export default function Register() {
  const [warnings, setWarnings] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      const body = {
        username: $("#username").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        password_confirmation: $("#password_confirmation").val(),
        first_name: $("#first_name").val(),
        // middle_name: $('#middle_name').val(),
        last_name: $("#last_name").val(),
        birth_date: $("#birth_date").val(),
        gender: $("#gender").val(),
        contact_number: $("#contact_number").val(),
        department: $("#department").val(),
      };

      setLoading(true);
      register(body).then(res => {
        if (res?.ok) {
          toast.success(res?.message ?? "Account created successfully");
          navigate('/login');
        } else {
          toast.error(res?.message ?? "An error occurred. Please try again");
          setWarnings(res?.error);
        }
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      />
      <Box
      sx={{
      position: 'relative',
      zIndex: 2,
      width: '100%',
      maxWidth: 400,
      boxShadow: '0px 0px 15px rgba(0,0,0,0.5)',
      borderRadius: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: 4,
      margin: 2,
      overflowY: 'scroll', 
      maxHeight: '90vh',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none', 
      },
        }}
      >
        <form onSubmit={onSubmit}>
          <Typography
            variant="h4"
            sx={{ textAlign: 'center', mt: 2, fontWeight: 'bold', color: 'white' }}
          >
            Register
          </Typography>
          <TextField
            required
            id="username"
            fullWidth
            size='small'
            label='Username'
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            }}
          />
          {warnings?.username && (
            <Typography sx={{ fontSize: 12 }} component="small" color="error">
              {warnings.username}
            </Typography>
          )}
          <TextField
            required
            id="email"
            fullWidth
            size='small'
            label='Email'
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            }}
          />
          {warnings?.email && (
            <Typography sx={{ fontSize: 12 }} component="small" color="error">
              {warnings.email}
            </Typography>
          )}
          <TextField
            required
            id="password"
            fullWidth
            size='small'
            label='Password'
            type='password'
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            }}
          />
          {warnings?.password && (
            <Typography sx={{ fontSize: 12 }} component="small" color="error">
              {warnings.password}
            </Typography>
          )}
          <TextField
            required
            id="password_confirmation"
            fullWidth
            size='small'
            label='Repeat Password'
            type='password'
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            }}
          />
          {warnings?.password_confirmation && (
            <Typography sx={{ fontSize: 12 }} component="small" color="error">
              {warnings.password_confirmation}
            </Typography>
          )}
          <TextField
            required
            id="first_name"
            fullWidth
            size='small'
            label='First Name'
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            }}
          />
          {warnings?.first_name && (
            <Typography sx={{ fontSize: 12 }} component="small" color="error">
              {warnings.first_name}
            </Typography>
          )}
          <TextField
            id="middle_name"
            fullWidth
            size='small'
            label='Middle Name'
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            }}
          />
          {warnings?.middle_name && (
            <Typography sx={{ fontSize: 12 }} component="small" color="error">
              {warnings.middle_name}
            </Typography>
          )}
          <TextField
            required
            id="last_name"
            fullWidth
            size='small'
            label='Last Name'
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            }}
          />
          {warnings?.last_name && (
            <Typography sx={{ fontSize: 12 }} component="small" color="error">
              {warnings.last_name}
            </Typography>
          )}
          <TextField
            required
            id="birth_date"
            fullWidth
            size='small'
            type='date'
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white'}              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            }}
          />
          {warnings?.birth_date && (
            <Typography sx={{ fontSize: 12 }} component="small" color="error">
              {warnings.birth_date}
            </Typography>
          )}
          <TextField
            required
            id="gender"
            fullWidth
            size='small'
            label='Gender'
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            }}
          />
          {warnings?.gender && (
            <Typography sx={{ fontSize: 12 }} component="small" color="error">
              {warnings.gender}
            </Typography>
          )}
          <TextField
            id="contact_number"
            fullWidth
            size='small'
            label='Contact Number'
            type='number'
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            }}
          />
          {warnings?.contact_number && (
            <Typography sx={{ fontSize: 12 }} component="small" color="error">
              {warnings.contact_number}
            </Typography>
          )}
          <TextField
            required
            id="department"
            fullWidth
            size='small'
            label='Department'
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
            }}
          />
          {warnings?.department && (
            <Typography sx={{ fontSize: 12 }} component="small" color="error">
              {warnings.department}
            </Typography>
          )}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              disabled={loading}
              type="submit"
              variant='contained'
              color="primary"
              sx={{ backgroundColor: 'rgb(2 49 138)', color: 'white', fontWeight: 'bold', borderRadius: '15px',width: '150px' }}
            >
              Register
            </Button>
          </Box>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link to='/login'>
            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
              Already have an account? Login
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
