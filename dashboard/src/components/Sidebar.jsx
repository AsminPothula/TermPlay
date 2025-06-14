// src/components/Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const games = [
  { id: 'snake', label: '🐍 Snake' },
  { id: 'tetris', label: '🧱 Tetris' },
  { id: 'pong', label: '🏓 Pong' },
];

export default function Sidebar({ selectedGame, setSelectedGame }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: '#1e1e2f',
          color: '#fff', // make whole drawer text white by default
        },
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', my: 2, textAlign: 'center', color: '#fff' }}>
        🐍 TermPlay
      </Typography>

      <List>
        <Typography variant="h6" sx={{ pl: 2, pb: 1, color: '#fff' }}>
          🎮 Games
        </Typography>

        {games.map((game) => (
          <ListItemButton
            key={game.id}
            selected={selectedGame === game.id}
            onClick={() => setSelectedGame(game.id)}
            sx={{
              borderRadius: 0,
              color: '#fff', // text color for ListItemButton (default)
              '& .MuiListItemIcon-root': {
                color: '#fff', // icon color
              },
              '&.Mui-selected': {
                bgcolor: '#292950',
                color: '#fff',
                '& .MuiListItemIcon-root': {
                  color: '#fff', // keep icon white when selected
                },
                '&:hover': {
                  bgcolor: '#292950',
                },
              },
            }}
          >
            <ListItemIcon>
              <SportsEsportsIcon />
            </ListItemIcon>
            <ListItemText primary={game.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
