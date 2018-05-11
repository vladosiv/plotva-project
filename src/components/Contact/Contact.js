import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

import { Avatar } from '../Avatar/Avatar';
import { Icon } from '../Icon/Icon';


const formatOptions = {
  hour: 'numeric',
  minute: 'numeric',
};

const formatter = new Intl.DateTimeFormat('ru-RU', formatOptions)

export const Contact = props => {
  const {
    img,
    name,
    time,
    content,
    count,
    icon,
    onClick,
    link,
    color,
    size = 'large',
    contentType = 'message',
    checked = false,
    group
  } = props;

  let date;
  let timeFormatted;

  if (time) {
    date = new Date(time);
    timeFormatted = formatter.format(date);
  }

  return (
    <div onClick={onClick} className={`contact contact_${size}`}>
      <Avatar img={img} size={size} checked={checked} name={name} color={color} />
      <div className="contact__content">
        <div className="content__header">
          <div className="content__name">
            {group
              ? <Icon type={'group'} />
              : false
            }
            {name}
          </div>
          {time ? (
            <div className="content__time">
              {icon ? (
                <div className="content__icon">
                  <Icon type={icon} />
                </div>
              ) : (
                false
              )}
              {timeFormatted}
            </div>
          ) : (
            false
          )}
        </div>
        <div className="content__body">
          {content
            ? <div className={`content__text content__text_${contentType}`}>
                {content}
              </div>
            : false
          }
          {count ? <div className="content__counter">{count}</div> : false}
        </div>
      </div>
      {link ? <Link to={link} /> : false}
    </div>
  );
};
