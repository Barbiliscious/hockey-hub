import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "PLAYER" | "COACH" | "ADMIN";
  content: string;
  createdAt: Date;
}

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "2",
    senderName: "Coach Mike",
    senderRole: "COACH",
    content: "Great training session today everyone! Remember we have a game this Saturday.",
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "2",
    senderId: "1",
    senderName: "James Wilson",
    senderRole: "PLAYER",
    content: "Thanks coach! What time should we arrive?",
    createdAt: new Date(Date.now() - 86400000 * 2 + 3600000),
  },
  {
    id: "3",
    senderId: "2",
    senderName: "Coach Mike",
    senderRole: "COACH",
    content: "Please arrive by 1:30pm, game starts at 2:30pm.",
    createdAt: new Date(Date.now() - 86400000 * 2 + 7200000),
  },
  {
    id: "4",
    senderId: "3",
    senderName: "Sarah Chen",
    senderRole: "PLAYER",
    content: "I'll be there! 🏒",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "5",
    senderId: "4",
    senderName: "Admin Lisa",
    senderRole: "ADMIN",
    content: "Reminder: Fees are due by end of month. Please check your emails.",
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = "1"; // Mock current user

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: String(messages.length + 1),
      senderId: currentUserId,
      senderName: "James Wilson",
      senderRole: "PLAYER",
      content: newMessage.trim(),
      createdAt: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-AU", {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("en-AU", { weekday: "short" });
    }
    return date.toLocaleDateString("en-AU", {
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadge = (role: Message["senderRole"]) => {
    switch (role) {
      case "COACH":
        return <Badge variant="coach" className="text-xs">Coach</Badge>;
      case "ADMIN":
        return <Badge variant="admin" className="text-xs">Admin</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-display text-3xl md:text-4xl text-foreground">
          CLUB CHAT
        </h1>
        <p className="text-muted-foreground mt-1 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Grampians Hockey Club • General Chat
        </p>
      </div>

      {/* Messages Container */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  isOwnMessage && "flex-row-reverse"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0",
                    isOwnMessage
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {message.senderName.charAt(0)}
                </div>

                {/* Message Content */}
                <div
                  className={cn(
                    "max-w-[75%]",
                    isOwnMessage && "text-right"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 mb-1",
                      isOwnMessage && "flex-row-reverse"
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {isOwnMessage ? "You" : message.senderName}
                    </span>
                    {getRoleBadge(message.senderRole)}
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 inline-block",
                      isOwnMessage
                        ? "bg-accent text-accent-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
