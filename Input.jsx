import React, { useContext, useState } from "react";
import Img from "../imgs/img.png";
import Attach from "../imgs/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error("Image upload failed:", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          } catch (err) {
            console.error("Failed to update Firestore with image URL:", err);
          }
        }
      );
    } else {
      try {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      } catch (err) {
        console.error("Failed to send message without image:", err);
      }
    }

    // Update last message info
    try {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to update last message info:", err);
    }

    // Reset after sending
    setText("");
    setImg(null);
    setFilePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleUnselect = () => {
    setImg(null);
    setFilePreview(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="Attach" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleFileChange}
        />
        <label htmlFor="file">
          <img src={Img} alt="Select" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>

      {/* Show file preview */}
      {filePreview && (
        <div className="filePreview">
          <img src={filePreview} alt="File preview" />
          <button onClick={handleUnselect}>Unselect</button>
        </div>
      )}
    </div>
  );
};

export default Input;
