// src/JoinGameModal.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

export default function JoinGameModal({ onJoin }) {
  const [open, setOpen] = useState(true);
  const [nickname, setNickname] = useState("");

  const handleConfirm = () => {
    if (nickname.trim()) {
      onJoin(nickname.trim());
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => {}} PaperProps={{ sx: { zIndex: 2000 } }}>
      <DialogTitle>Join the Game</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} variant="contained">
          Join Game
        </Button>
      </DialogActions>
    </Dialog>
  );
}
