import { useEffect, useState } from "react";
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
  avatar?: string;
  createdAt: string;
  subject: string;
  message: string;
}

export default function EmailLists() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get<{ messages: Message[] }>(
          "http://localhost:5050/dev-api/messages/allMessages"
        );
        const validMessages: Message[] = res.data.messages.filter(
          (msg: Message) =>
            msg._id && typeof msg._id === "string" && /^[0-9a-fA-F]{24}$/.test(msg._id)
        );
        setMessages(validMessages);
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
          maxHeight: "800px", 
          overflowY: "auto", 
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
          <Box key={item._id} >
            <ListItem sx={{ '--ListItem-paddingY': '0px', '--ListItem-paddingTop': '0px', '--ListItem-paddingBottom': '0px', '--ListItem-paddingRight': '0px', p: 0, m: 0 }}>
              <Link to={`/messages/${item._id}`} style={{ textDecoration: "none", width: "100%" }}>
                <ListItemButton
                  selected={selectedId === item._id}
                  onClick={() => setSelectedId(item._id)}
                  color="neutral"
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
              </Link>
            </ListItem>
            {index < messages.length - 1 && <ListDivider sx={{ m: 0 }} />}
          </Box>
        ))}
      </List>
    </Box>
  );
}
