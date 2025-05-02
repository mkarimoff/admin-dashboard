import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Snackbar from "@mui/joy/Snackbar";
import Divider from "@mui/joy/Divider";
import Avatar from "@mui/joy/Avatar";
import Tooltip from "@mui/joy/Tooltip";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import WriteEmail from "./reply";
import { toast } from "react-toastify";
import { baseApi } from "../../utils/api";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export default function EmailContent() {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = React.useState<Message | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState([false, false, false]);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(
    null
  );
  const [isReplyOpen, setIsReplyOpen] = React.useState(false);
  const navigate = useNavigate();

  const deleteMessage = async (id: string) => {
    try {
      await axios.delete(
       baseApi + `/messages/deleteMessage/${id}`
      );

      const updatedOpen = [...open];
      updatedOpen[2] = true;
      setOpen(updatedOpen);

      setTimeout(() => {
        navigate("/emails");
      }, 1500);
    } catch (error) {
      toast.error("Failed to delete message.");
    }
  };

  React.useEffect(() => {
    if (!id) {
      setError("No message ID provided in the URL");
      return;
    }

    const fetchMessage = async () => {
      try {
        const res = await axios.get(
         baseApi + `/messages/getMessage/${id}`
        );
        setMessage(res.data.message);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError(`Message with ID ${id} not found`);
        } else {
          setError("Failed to load message");
        }
      }
    };

    fetchMessage();
  }, [id]);

  const handleSnackbarOpen = (index: number) => {
    const updatedOpen = [...open];
    updatedOpen[index] = true;
    setOpen(updatedOpen);
  };

  const handleSnackbarClose = (index: number) => {
    const updatedOpen = [...open];
    updatedOpen[index] = false;
    setOpen(updatedOpen);
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="danger">{error}</Typography>
      </Box>
    );
  }

  if (!message) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }

  return (
    <>
      <Sheet
        variant="outlined"
        sx={{
          minHeight: 720,
          borderRadius: "sm",
          p: 2,
          mb: 3,
          maxwidth: "50px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Avatar alt={message.name}>{message.name[0]}</Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography
                level="title-sm"
                textColor="text.primary"
                sx={{ mb: 0.5 }}
              >
                {message.name}
              </Typography>
              <Typography level="body-xs" textColor="text.tertiary">
                {new Date(message.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              height: "32px",
              flexDirection: "row",
              gap: 1.5,
            }}
          >
            <Button
              size="sm"
              variant="plain"
              color="neutral"
              startDecorator={<ReplyRoundedIcon />}
              onClick={() => setIsReplyOpen(true)}
            >
              Reply
            </Button>
            <WriteEmail
              open={isReplyOpen}
              onClose={() => setIsReplyOpen(false)}
              senderEmail={message.email}
            />
            <Snackbar
              color="success"
              open={open[0]}
              onClose={() => handleSnackbarClose(0)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              startDecorator={<CheckCircleRoundedIcon />}
              endDecorator={
                <Button
                  onClick={() => handleSnackbarClose(0)}
                  size="sm"
                  variant="soft"
                  color="neutral"
                >
                  Dismiss
                </Button>
              }
            >
              Your message has been sent.
            </Snackbar>
            <Button
              size="sm"
              variant="plain"
              color="danger"
              startDecorator={<DeleteRoundedIcon />}
              onClick={() => {
                setPendingDeleteId(message._id);
                handleSnackbarOpen(2);
              }}
            >
              Delete
            </Button>
            <Snackbar
              color="danger"
              open={open[2]}
              onClose={() => handleSnackbarClose(2)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              startDecorator={<CheckCircleRoundedIcon />}
              endDecorator={
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="sm"
                    variant="soft"
                    color="neutral"
                    onClick={() => {
                      setPendingDeleteId(null);
                      handleSnackbarClose(2);
                    }}
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    variant="solid"
                    color="danger"
                    onClick={() => {
                      if (pendingDeleteId) {
                        deleteMessage(pendingDeleteId);
                        handleSnackbarClose(2);
                      }
                    }}
                  >
                    Confirm Delete
                  </Button>
                </Box>
              }
            >
              Are you sure you want to delete this message?
            </Snackbar>
          </Box>
        </Box>
        <Divider sx={{ mt: 2 }} />
        <Box
          sx={{
            py: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <Typography
            level="title-lg"
            textColor="text.primary"
            endDecorator={
              <Chip
                component="span"
                size="sm"
                variant="outlined"
                color="warning"
              >
                Inquiry
              </Chip>
            }
          >
            {message.subject}
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <div>
              <Typography
                component="span"
                level="body-sm"
                sx={{ mr: 1, display: "inline-block" }}
              >
                From
              </Typography>
              <Tooltip size="sm" title="Copy email" variant="outlined">
                <Chip
                  size="sm"
                  variant="soft"
                  color="primary"
                  onClick={() => navigator.clipboard.writeText(message.email)}
                >
                  {message.email}
                </Chip>
              </Tooltip>
            </div>
          </Box>
        </Box>
        <Divider />
        <Typography level="body-sm" sx={{ mt: 2, mb: 2 }}>
          {message.message}
        </Typography>
      </Sheet>
    </>
  );
}
