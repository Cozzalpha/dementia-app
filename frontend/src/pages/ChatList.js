import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  Paper,
  TextField,
  IconButton,
  Badge,
  Divider,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Star,
  StarBorder,
} from '@mui/icons-material';

function ChatList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(['1', '2']); // Mock favorites

  // Mock data - replace with actual data from your backend
  const conversations = [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'J',
      lastMessage: "Thanks for the proposal! I'll review it and get back to you.",
      timestamp: '2024-01-20T15:30:00Z',
      unreadCount: 2,
      status: 'online',
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'J',
      lastMessage: 'When would you like to schedule the meeting?',
      timestamp: '2024-01-20T14:15:00Z',
      unreadCount: 0,
      status: 'offline',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      avatar: 'M',
      lastMessage: 'Great to meet you at the conference!',
      timestamp: '2024-01-19T16:45:00Z',
      unreadCount: 0,
      status: 'online',
    },
  ];

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id]
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Messages
        </Typography>
        <IconButton>
          <MoreVert />
        </IconButton>
      </Paper>

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {filteredConversations.map((conversation) => (
          <React.Fragment key={conversation.id}>
            <ListItem
              button
              onClick={() => navigate(`/chat/${conversation.id}`)}
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  color={conversation.status === 'online' ? 'success' : 'default'}
                >
                  <Avatar>{conversation.avatar}</Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ flexGrow: 1 }}
                    >
                      {conversation.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {formatTimestamp(conversation.timestamp)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {conversation.lastMessage}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {conversation.unreadCount > 0 && (
                    <Badge
                      badgeContent={conversation.unreadCount}
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <Box />
                    </Badge>
                  )}
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(conversation.id);
                    }}
                  >
                    {favorites.includes(conversation.id) ? (
                      <Star color="primary" />
                    ) : (
                      <StarBorder />
                    )}
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default ChatList; 