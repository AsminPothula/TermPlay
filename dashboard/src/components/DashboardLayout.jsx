// src/components/DashboardLayout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GameViewer from './GameViewer';
import LeaderboardTable from './LeaderboardTable';
import { Box, Grid, Paper, Typography } from '@mui/material';

export default function DashboardLayout() {
  const [selectedGame, setSelectedGame] = useState('snake');

  return (
    <Box sx={{ display: 'flex', bgcolor: '#0f0f1a', minHeight: '100vh' }}>
      <TopBar />
      <Sidebar selectedGame={selectedGame} setSelectedGame={setSelectedGame} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 10, // pushed to avoid hiding under TopBar
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Grid container spacing={2}>
          {/* Game Viewer */}
          <Grid item xs={8}>
            <Paper
              sx={{
                height: '500px',
                padding: 2,
                backgroundColor: '#1e1e2f',
                border: '2px solid #333',
                boxShadow: '0 0 10px rgba(0,255,0,0.2)',
              }}
            >
              <GameViewer selectedGame={selectedGame} />
            </Paper>
          </Grid>

          {/* Players + Leaderboard */}
          <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ height: '200px', padding: 2, backgroundColor: '#1e1e2f' }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>
                👥 Players (coming soon)
              </Typography>
            </Paper>

            <Paper sx={{ flexGrow: 1, padding: 2, backgroundColor: '#1e1e2f' }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>
                🏆 Leaderboard
              </Typography>
              <LeaderboardTable selectedGame={selectedGame} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
