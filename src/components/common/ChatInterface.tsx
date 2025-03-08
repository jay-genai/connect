import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Badge,
  Chip,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  InsertDriveFile as FileIcon,
  SmartToy as BotIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { Message } from "../../types";
import { useAuth } from "../../context/AuthContext";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading?: boolean;
  onSendMessage: (content: string, attachments?: string[]) => void;
  collaborationId: string;
  otherPartyName: string;
  otherPartyImage?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading = false,
  onSendMessage,
  collaborationId,
  otherPartyName,
  otherPartyImage,
}) => {
  const { user, userType } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(
        newMessage,
        attachments.length > 0 ? attachments : undefined
      );
      setNewMessage("");
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true);

      // Simulate file upload - in a real app, you would upload to a server
      setTimeout(() => {
        const newAttachments = Array.from(e.target.files || []).map((file) =>
          URL.createObjectURL(file)
        );
        setAttachments([...attachments, ...newAttachments]);
        setIsUploading(false);
      }, 1000);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const renderMessage = (message: Message, index: number) => {
    const isCurrentUser = message.senderId === user?.id;
    const isSystem = message.senderType === "system";

    if (isSystem) {
      return (
        <Box
          key={message.id || index}
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 1,
            px: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              backgroundColor: "grey.200",
              borderRadius: 4,
              py: 0.5,
              px: 2,
              maxWidth: "80%",
            }}
          >
            {message.content}
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        key={message.id || index}
        sx={{
          display: "flex",
          flexDirection: isCurrentUser ? "row-reverse" : "row",
          alignItems: "flex-start",
          mb: 2,
          px: 2,
        }}
      >
        {!isCurrentUser && (
          <Avatar
            src={otherPartyImage}
            alt={otherPartyName}
            sx={{ mr: 1, width: 36, height: 36 }}
          />
        )}

        <Box
          sx={{
            maxWidth: "70%",
            ml: isCurrentUser ? 0 : 1,
            mr: isCurrentUser ? 1 : 0,
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: isCurrentUser
                ? "primary.main"
                : message.isAutomated
                ? "info.light"
                : "background.paper",
              color: isCurrentUser ? "primary.contrastText" : "text.primary",
            }}
          >
            {message.isAutomated && (
              <Box display="flex" alignItems="center" mb={0.5}>
                <BotIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="caption" fontWeight="bold">
                  AI Assistant
                </Typography>
              </Box>
            )}

            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {message.content}
            </Typography>

            {message.attachments && message.attachments.length > 0 && (
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {message.attachments.map((attachment, i) => (
                  <Box
                    key={i}
                    component="a"
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 0.5,
                      borderRadius: 1,
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <FileIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">
                      {attachment.split("/").pop()?.substring(0, 15)}...
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {format(new Date(message.timestamp), "MMM d, h:mm a")}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6">{otherPartyName}</Typography>
        <Typography variant="caption" color="text.secondary">
          Collaboration #{collaborationId.substring(0, 8)}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, maxHeight: "60vh" }}>
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map(renderMessage)
        )}

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {attachments.length > 0 && (
        <Box sx={{ p: 1, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="caption" sx={{ ml: 1 }}>
            Attachments:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
            {attachments.map((attachment, index) => (
              <Tooltip key={index} title="Click to remove">
                <Chip
                  icon={<FileIcon fontSize="small" />}
                  label={
                    attachment.split("/").pop()?.substring(0, 10) ||
                    `File ${index + 1}`
                  }
                  onDelete={() => removeAttachment(index)}
                  size="small"
                />
              </Tooltip>
            ))}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />

        <IconButton
          color="primary"
          onClick={handleAttachmentClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <CircularProgress size={24} />
          ) : (
            <Badge badgeContent={attachments.length} color="primary">
              <AttachFileIcon />
            </Badge>
          )}
        </IconButton>

        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
          sx={{ mx: 1 }}
        />

        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={
            isLoading || (newMessage.trim() === "" && attachments.length === 0)
          }
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatInterface;
