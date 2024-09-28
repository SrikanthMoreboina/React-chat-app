import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Timestamp } from "firebase/firestore";

const Message = ({ message, onMessageSelect, isSelected }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const formatTimestamp = (timestamp) => {
    const messageTime =
      timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    const currentTime = new Date();
    const timeDifference = (currentTime - messageTime) / 1000; // Time difference in seconds

    if (timeDifference < 60) {
      return "Just now";
    } else {
      const hours = messageTime.getHours();
      const minutes = messageTime.getMinutes();
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }
  };

  const handleSelect = () => {
    if (onMessageSelect) {
      onMessageSelect(message.id, !isSelected);
    }
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid ? "owner" : ""} ${isSelected ? "selected" : ""}`}
      onClick={handleSelect}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{formatTimestamp(message.date)}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
