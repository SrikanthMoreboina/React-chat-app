import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []);
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  // Handle message selection
  const handleMessageSelect = (id, isSelected) => {
    setSelectedMessages((prev) =>
      isSelected ? [...prev, id] : prev.filter((msgId) => msgId !== id)
    );
  };

  // Handle delete
  const handleDeleteMessages = async () => {
    try {
      const chatDocRef = doc(db, "chats", data.chatId);
      const updatedMessages = messages.filter(
        (message) => !selectedMessages.includes(message.id)
      );

      await updateDoc(chatDocRef, {
        messages: updatedMessages,
      });

      // Clear the selection
      setSelectedMessages([]);
    } catch (err) {
      console.error("Error deleting messages:", err);
    }
  };

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message
          message={m}
          key={m.id}
          onMessageSelect={handleMessageSelect}
          isSelected={selectedMessages.includes(m.id)}
        />
      ))}
      {selectedMessages.length > 0 && (
        <button onClick={handleDeleteMessages} className="deleteBtn">
          Delete Selected Messages
        </button>
      )}
    </div>
  );
};

export default Messages;
