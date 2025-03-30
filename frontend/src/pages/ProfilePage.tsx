import React, { useContext } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';

const ProfilePage: React.FC = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          View and manage your account information
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <StyledAvatar>
                {user.name.charAt(0).toUpperCase()}
              </StyledAvatar>
              <Typography variant="h5" mt={2}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Typography>
            </Box>
            <Divider />
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <List>
                <ListItem disablePadding>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText
                    primary="Account ID"
                    secondary={user.id}
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                    secondaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Activity Summary
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              This is where you can see your recent activity and dashboard usage statistics.
              This feature is currently under development.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>
            <Typography variant="body2" color="textSecondary">
              User preference settings will be added in a future update.
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Layout>
  );
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  backgroundColor: theme.palette.primary.main,
  fontSize: '2.5rem',
}));

export default ProfilePage;