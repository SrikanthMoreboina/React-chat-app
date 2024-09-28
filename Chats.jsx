import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState({});

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (currentUser?.uid) {
      console.log('Fetching chats for user ID:', currentUser.uid);
      const docRef = doc(db, "userChats", currentUser.uid);
      const unsub = onSnapshot(
        docRef,
        (doc) => {
          const data = doc.data();
          console.log('Chats data:', data);
          setChats(data || {});
        },
        (error) => {
          console.error("Error fetching document:", error);
        }
      );

      return () => {
        unsub();
      };
    } else {
      console.error("No current user ID available.");
    }
  }, [currentUser?.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const sortedChats = Object.entries(chats || {}).sort((a, b) => b[1].date - a[1].date) || [];

  return (
    <div className="chats">
      {sortedChats.length > 0 ? (
        sortedChats.map(([key, chat]) => (
          <div
            className="userChat"
            key={key}
            onClick={() => handleSelect(chat.userInfo)}
          >
            <img src={chat.userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat.userInfo.displayName}</span>
              <p>{chat.lastMessage?.text}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No chats available</p>
      )}
    </div>
  );
};

export default Chats;
