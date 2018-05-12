import React from "react";
import "./message.css";
import {Icon} from "../Icon/Icon";
import {Avatar} from "../Avatar/Avatar";
import {getColor} from "../Avatar/DefaultColors.js"

const formatOptions = {
  hour: "numeric",
  minute: "numeric",
};

const formatter = new Intl.DateTimeFormat("ru-RU", formatOptions)

export const Message = ({ isMy, text, status = "sent", time, user, isChat }) => {
  const date = new Date(time);
  const timeFormatted = formatter.format(date);
  return (
    <div className={`message-wrapper ${isMy && !isChat ? "message-wrapper_my" : ""} ${isChat ? "message-wrapper_chat" : ""}`}>
      {
          isChat
          ? <Avatar {...user} size={"small"}/>
          : false
      }
      <div className={`message ${isMy && !isChat ? "message_my" : ""}`}>
        {
          isChat
          ? <div style={{"color": getColor(user.color)}}>{user.name}</div>
          : false
        }
        <div className="message__text">{text}</div>
        <span className="message__time">{timeFormatted}</span>
        <Icon type={`message-${status}`}/>
      </div>
    </div>
  );
};
