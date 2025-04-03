import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Business,
  AttachMoney,
  LocationOn,
  Work,
  FilterList,
  Send,
  Close,
} from '@mui/icons-material';

function Matchmaking() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [filters, setFilters] = useState({
    industry: '',
    fundingStage: '',
    location: '',
    investmentRange: [0, 1000000],
  });

  // Mock data - replace with actual data from your backend
  const matches = [
    {
      id: 1,
      name: 'TechStart Inc.',
      industry: 'AI/ML',
      fundingStage: 'Seed',
      location: 'San Francisco, CA',
      investmentRange: '$500K - $2M',
      description: 'AI-powered analytics platform for businesses',
      matchScore: 95,
      tags: ['AI', 'SaaS', 'B2B'],
    },
    {
      id: 2,
      name: 'HealthTech Solutions',
      industry: 'Healthcare',
      fundingStage: 'Series A',
      location: 'New York, NY',
      investmentRange: '$2M - $5M',
      description: 'Digital health platform for remote patient monitoring',
      matchScore: 88,
      tags: ['Healthcare', 'IoT', 'B2B'],
    },
    {
      id: 3,
      name: 'EcoGreen Energy',
      industry: 'CleanTech',
      fundingStage: 'Pre-Seed',
      location: 'Austin, TX',
      investmentRange: '$100K - $500K',
      description: 'Renewable energy solutions for residential use',
      matchScore: 82,
      tags: ['CleanTech', 'B2C', 'IoT'],
    },
  ];

  const industries = [
    'AI/ML',
    'Healthcare',
    'CleanTech',
    'FinTech',
    'E-commerce',
    'EdTech',
    'IoT',
  ];

  const fundingStages = [
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Growth',
  ];

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleInvestmentRangeChange = (event, newValue) => {
    setFilters((prev) => ({
      ...prev,
      investmentRange: newValue,
    }));
  };

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
  };

  const handleCloseDialog = () => {
    setSelectedMatch(null);
  };

  const handleConnect = (matchId) => {
    // Implement connection logic
    console.log('Connecting with match:', matchId);
    handleCloseDialog();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">AI-Powered Matches</Typography>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </Button>
      </Box>

      {/* Filters Panel */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Industry</InputLabel>
                <Select
                  value={filters.industry}
                  label="Industry"
                  onChange={handleFilterChange('industry')}
                >
                  {industries.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Funding Stage</InputLabel>
                <Select
                  value={filters.fundingStage}
                  label="Funding Stage"
                  onChange={handleFilterChange('fundingStage')}
                >
                  {fundingStages.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Location"
                value={filters.location}
                onChange={handleFilterChange('location')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography gutterBottom>Investment Range</Typography>
              <Slider
                value={filters.investmentRange}
                onChange={handleInvestmentRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000000}
                step={100000}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Matches Grid */}
      <Grid container spacing={3}>
        {matches.map((match) => (
          <Grid item xs={12} sm={6} md={4} key={match.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => handleMatchClick(match)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {match.name}
                  </Typography>
                  <Chip
                    label={`${match.matchScore}% Match`}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  {match.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <Business sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {match.industry}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <AttachMoney sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {match.investmentRange}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {match.location}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  {match.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<Send />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect(match.id);
                  }}
                >
                  Connect
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Match Details Dialog */}
      <Dialog
        open={Boolean(selectedMatch)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedMatch && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedMatch.name}</Typography>
                <IconButton onClick={handleCloseDialog}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedMatch.description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Industry
                  </Typography>
                  <Typography variant="body1">{selectedMatch.industry}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Funding Stage
                  </Typography>
                  <Typography variant="body1">{selectedMatch.fundingStage}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">{selectedMatch.location}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Investment Range
                  </Typography>
                  <Typography variant="body1">{selectedMatch.investmentRange}</Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Tags
                </Typography>
                {selectedMatch.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={() => handleConnect(selectedMatch.id)}
              >
                Connect
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Matchmaking; 