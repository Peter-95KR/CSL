import React, { useState, useContext } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const { login, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validate form
    if (!formData.email || !formData.password) {
      setLocalError('모든 필드를 입력해주세요');
      return;
    }

    try {
      console.log('직접 반입로 로그인 시도 중');
      // Using direct fetch instead of the authentication context
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      if (!response.ok) {
        throw new Error('로그인 실패');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      
      // Make the AuthContext aware that the user is authenticated
      // by setting the token and forcing a reload
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      setLocalError('로그인 실패. 사용자 정보를 확인해주세요.');
    }
  };

  return (
    <FormContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          로그인
        </Typography>

        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || localError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="이메일"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />

          <TextField
            label="비밀번호"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '로그인'}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            계정이 없으신가요?{' '}
            <Button color="primary" onClick={() => navigate('/register')}>
              회원가입
            </Button>
          </Typography>
        </Box>
      </StyledPaper>
    </FormContainer>
  );
};

const FormContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
`;

const StyledPaper = styled(Paper)`
  padding: 32px;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
`;

export default LoginForm;
