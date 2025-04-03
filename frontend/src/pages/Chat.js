import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Grid,
  Badge,
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  MoreVert,
} from '@mui/icons-material';
import io from 'socket.io-client';

function Chat() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock data - replace with actual data from your backend
  const chatUser = {
    id: userId,
    name: 'John Doe',
    avatar: 'J',
    status: 'online',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    setSocket(newSocket);

    // Load chat history
    // Replace with actual API call
    const mockMessages = [
      {
        id: 1,
        senderId: 'currentUser',
        text: 'Hi, I saw your profile and would love to connect!',
        timestamp: '2024-01-20T10:00:00Z',
      },
      {
        id: 2,
        senderId: userId,
        text: 'Hello! Thanks for reaching out. I checked your company profile and it looks interesting.',
        timestamp: '2024-01-20T10:05:00Z',
      },
    ];
    setMessages(mockMessages);

    // Socket event listeners
    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.close();
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      senderId: 'currentUser',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Emit message through socket
    socket?.emit('message', {
      roomId: `chat_${userId}`,
      message,
    });

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Implement file upload logic
      console.log('File selected:', file);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            color={chatUser.status === 'online' ? 'success' : 'default'}
          >
            <Avatar sx={{ mr: 2 }}>{chatUser.avatar}</Avatar>
          </Badge>
          <Box>
            <Typography variant="subtitle1">{chatUser.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {chatUser.status === 'online' ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </Box>
        <IconButton>
          <MoreVert />
        </IconButton>
      </Paper>

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                flexDirection: message.senderId === 'currentUser' ? 'row-reverse' : 'row',
                mb: 2,
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  {message.senderId === 'currentUser' ? 'U' : chatUser.avatar}
                </Avatar>
              </ListItemAvatar>
              <Box
                sx={{
                  maxWidth: '70%',
                  bgcolor: message.senderId === 'currentUser' ? 'primary.main' : 'grey.100',
                  color: message.senderId === 'currentUser' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  p: 1,
                  position: 'relative',
                }}
              >
                <ListItemText
                  primary={message.text}
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        color: message.senderId === 'currentUser' ? 'white' : 'text.secondary',
                      }}
                    >
                      {formatTimestamp(message.timestamp)}
                    </Typography>
                  }
                />
              </Box>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Message Input */}
      <Paper
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          sx={{ mr: 1 }}
        >
          <AttachFile />
        </IconButton>
        <IconButton sx={{ mr: 1 }}>
          <EmojiEmotions />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{ mr: 1 }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!newMessage.trim()}
        >
          <Send />
        </IconButton>
      </Paper>
    </Box>
  );
}

export default Chat; 