import * as React from "react";
import Box from "@mui/joy/Box";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Textarea from "@mui/joy/Textarea";
import Sheet from "@mui/joy/Sheet";
import { IconButton, Input, Stack, Typography } from "@mui/joy";
import FormatColorTextRoundedIcon from "@mui/icons-material/FormatColorTextRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import InsertPhotoRoundedIcon from "@mui/icons-material/InsertPhotoRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";

interface WriteEmailProps {
  open?: boolean;
  onClose?: () => void;
  senderEmail?: string;
}

const WriteEmail = React.forwardRef<HTMLDivElement, WriteEmailProps>(
  function WriteEmail({ open = false, onClose, senderEmail }, ref) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(3px)", 
              backgroundColor: "rgba(118, 116, 116, 0)", 
              alignItems:"center",
              justifyContent:'center',
              display:'flex'
            },
          },
        }}
      >
        <ModalDialog>
          <Sheet
            ref={ref}
            sx={{
              px: 1.5,
              py: 1.5,
              border: "1px solid",
              borderRadius: "8px",
              flex: 1,
              overflow: "auto",
              borderColor: "neutral.outlinedBorder",
              backgroundColor: "background.level1",
              boxShadow: "lg",
              width: 500,
              maxWidth: "100%",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography level="title-sm">New message</Typography>
              <ModalClose id="close-icon" onClick={onClose} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl>
                <FormLabel>To</FormLabel>
                <Input value={senderEmail || ""} readOnly />
              </FormControl>
              <FormControl>
                <FormLabel>CC</FormLabel>
                <Input placeholder="email@email.com" />
              </FormControl>
              <Input placeholder="Subject" />
              <FormControl
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Textarea
                  placeholder="Type your message here…"
                  minRows={8}
                  endDecorator={
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexGrow: 1,
                        py: 1,
                        pr: 1,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <div>
                        <IconButton size="sm" variant="plain" color="neutral">
                          <FormatColorTextRoundedIcon />
                        </IconButton>
                        <IconButton size="sm" variant="plain" color="neutral">
                          <AttachFileRoundedIcon />
                        </IconButton>
                        <IconButton size="sm" variant="plain" color="neutral">
                          <InsertPhotoRoundedIcon />
                        </IconButton>
                        <IconButton size="sm" variant="plain" color="neutral">
                          <FormatListBulletedRoundedIcon />
                        </IconButton>
                      </div>
                      <Button
                        color="primary"
                        sx={{ borderRadius: "sm" }}
                        onClick={onClose}
                      >
                        Send
                      </Button>
                    </Stack>
                  }
                  sx={{
                    "& textarea:first-of-type": {
                      minHeight: 72,
                    },
                  }}
                />
              </FormControl>
            </Box>
          </Sheet>
        </ModalDialog>
      </Modal>
    );
  }
);

export default WriteEmail;
