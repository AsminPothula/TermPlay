// src/components/LeaderboardTable.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function LeaderboardTable({ selectedGame }) {
  // TEMP dummy data — later you will connect this to game state!
  const rows = [
    { name: 'Player1', score: 120 },
    { name: 'Player2', score: 90 },
    { name: 'Player3', score: 70 },
  ];

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "#2e2e3e" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#fff' }}>Player</TableCell>
            <TableCell align="right" sx={{ color: '#fff' }}>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell sx={{ color: '#fff' }}>{row.name}</TableCell>
              <TableCell align="right" sx={{ color: '#fff' }}>{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
