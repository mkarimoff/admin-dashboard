import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { Divider } from "@mui/joy";
import { Link } from "react-router-dom";

interface Message {
  _id: string;
  name: string;
  avatar: string;
  avatar2x?: string;
  createdAt: string;
  subject: string;
  message: string;
}

export default function EmailLists() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5050/dev-api/messages/allMessages"
        );
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          margin: "10px",
          height: "50px",
        }}
      >
        <Box>
          <Typography level="title-lg" textColor="text.secondary" component="h1">
            My inbox
          </Typography>
          <Typography level="title-sm" textColor="text.tertiary">
            {messages.length} emails
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List
        sx={{
          boxShadow: "sm",
          height: "100%",
          width: "500px",
          [`& .${listItemButtonClasses.root}.${listItemButtonClasses.selected}`]: {
            borderLeft: "2px solid",
            borderLeftColor: "var(--joy-palette-primary-outlinedBorder)",
          },
          borderRight: "1px solid",
          borderColor: "divider",
          padding: 0,
        }}
      >
        {messages.map((item, index) => (
          <React.Fragment key={item._id}>
             <Link to={`/messages/${item._id}`} style={{ textDecoration: "none" }}>
            <ListItem>
              <ListItemButton
                {...(index === 0 && {
                  selected: true,
                  color: "neutral",
                })}
                sx={{ p: 2.5 }}
              >
                <ListItemDecorator sx={{ alignSelf: "flex-start" }}>
                  <Avatar alt={item.name} src={item.avatar}>
                    {!item.avatar && item.name[0]}
                  </Avatar>
                </ListItemDecorator>
                <Box sx={{ pl: 2, width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      <Typography level="body-xs">{item.name}</Typography>
                    </Box>
                    <Typography level="body-xs" textColor="text.tertiary">
                      {formatDate(item.createdAt)}
                    </Typography>
                  </Box>
                  <div>
                    <Typography level="body-sm">
                      {item.message.length > 45
                        ? `${item.message.slice(0, 45)}...`
                        : item.message}
                    </Typography>
                  </div>
                </Box>
              </ListItemButton>
            </ListItem>
            </Link>
            <ListDivider sx={{ m: 0 }} />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
