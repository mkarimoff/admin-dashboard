import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import { Divider, Button, Snackbar, Sheet } from "@mui/joy";
import { ReplyRounded, ForwardToInboxRounded, DeleteRounded, CheckCircleRounded } from "@mui/icons-material";

interface Message {
  _id: string;
  avatar: string;
  name: string;
  createdAt: string;
  subject: string;
  email: string;
  message: string;
}

const Messages = () => {
  const { _id } = useParams<{ _id: string }>();  
  const [message, setMessage] = useState<Message | null>(null);
  const [open, setOpen] = useState([false, false, false]);

  useEffect(() => {
    console.log("Fetching message for id:", _id);
    if (_id) {
      axios
        .get(`http://localhost:5050/dev-api/messages/getMessage/${_id}`)
        .then((res) => {
          console.log("Fetched message:", res.data);
          setMessage(res.data.message);
        })
        .catch((err) => {
          console.error("Error fetching message:", err);
        });
        
    }
    
  }, [_id]);
  

  const handleSnackbarOpen = (index: number) => {
    const updated = [...open];
    updated[index] = true;
    setOpen(updated);
  };

  const handleSnackbarClose = (index: number) => {
    const updated = [...open];
    updated[index] = false;
    setOpen(updated);
  };

  if (!message) return <Typography>Loading...</Typography>;

  return (
    <Sheet variant="outlined" sx={{ minHeight: 500, borderRadius: "sm", p: 2, mb: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Avatar src={message.avatar} />
          <Box sx={{ ml: 2 }}>
            <Typography level="title-sm" textColor="text.primary" sx={{ mb: 0.5 }}>
              {message.name}
            </Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              {new Date(message.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", height: "32px", gap: 1.5 }}>
          {["Reply", "Forward", "Delete"].map((label, i) => (
            <React.Fragment key={label}>
              <Button
                size="sm"
                variant="plain"
                color={label === "Delete" ? "danger" : "neutral"}
                startDecorator={
                  label === "Reply" ? <ReplyRounded /> :
                  label === "Forward" ? <ForwardToInboxRounded /> :
                  <DeleteRounded />
                }
                onClick={() => handleSnackbarOpen(i)}
              >
                {label}
              </Button>
              <Snackbar
                color={label === "Delete" ? "danger" : "success"}
                open={open[i]}
                onClose={() => handleSnackbarClose(i)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                startDecorator={<CheckCircleRounded />}
                endDecorator={
                  <Button onClick={() => handleSnackbarClose(i)} size="sm" variant="soft" color="neutral">
                    Dismiss
                  </Button>
                }
              >
                Message {label.toLowerCase()}ed successfully.
              </Snackbar>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Divider sx={{ mt: 2 }} />
      <Box sx={{ py: 2 }}>
        <Typography level="title-lg" textColor="text.primary">
          {message.subject}
        </Typography>

        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Typography component="span" level="body-sm">From</Typography>
          <Typography component="span" level="body-sm">{message.email}</Typography>
        </Box>
      </Box>

      <Divider />
      <Typography level="body-sm" sx={{ mt: 2, mb: 2 }}>
        {message.message}
      </Typography>
    </Sheet>
  );
};

export default Messages;


