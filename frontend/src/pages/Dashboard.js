import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Business,
  Chat,
  GroupWork,
  Assessment,
  ArrowForward,
} from '@mui/icons-material';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Mock data - replace with actual data from your backend
  const stats = {
    matches: 12,
    connections: 45,
    messages: 8,
    projects: 3,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'match',
      title: 'New Match',
      description: 'TechStart Inc. matched with your profile',
      timestamp: '2 hours ago',
      avatar: 'T',
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      description: 'John Doe sent you a message',
      timestamp: '4 hours ago',
      avatar: 'J',
    },
    {
      id: 3,
      type: 'connection',
      title: 'New Connection',
      description: 'Sarah Smith accepted your connection request',
      timestamp: '1 day ago',
      avatar: 'S',
    },
  ];

  const quickActions = [
    {
      title: 'View Matches',
      icon: <People />,
      path: '/matchmaking',
      color: '#1976d2',
    },
    {
      title: 'Messages',
      icon: <Chat />,
      path: '/chat',
      color: '#2e7d32',
    },
    {
      title: 'Projects',
      icon: <GroupWork />,
      path: '/projects',
      color: '#ed6c02',
    },
    {
      title: 'Analytics',
      icon: <Assessment />,
      path: '/analytics',
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#e3f2fd',
            }}
          >
            <People sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
            <Typography variant="h4">{stats.matches}</Typography>
            <Typography color="text.secondary">New Matches</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#e8f5e9',
            }}
          >
            <TrendingUp sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
            <Typography variant="h4">{stats.connections}</Typography>
            <Typography color="text.secondary">Connections</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#fff3e0',
            }}
          >
            <Chat sx={{ fontSize: 40, color: '#ed6c02', mb: 1 }} />
            <Typography variant="h4">{stats.messages}</Typography>
            <Typography color="text.secondary">New Messages</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: '#f3e5f5',
            }}
          >
            <Business sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
            <Typography variant="h4">{stats.projects}</Typography>
            <Typography color="text.secondary">Active Projects</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {activity.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <Box>
                          <Typography component="span" variant="body2">
                            {activity.description}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block' }}
                          >
                            {activity.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action) => (
                <Grid item xs={6} key={action.title}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Box sx={{ color: action.color, mb: 1 }}>
                        {action.icon}
                      </Box>
                      <Typography variant="subtitle1">
                        {action.title}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center' }}>
                      <IconButton size="small">
                        <ArrowForward />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 