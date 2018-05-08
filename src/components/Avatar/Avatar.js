import React from 'react';
import './Avatar.css';
import {colors} from './DefaultColors.js'

export function Avatar(props) {
    const { size = 'large', avatar, checked, defaultName, color = 0 } = props;

    return (
      <div className={`avatar avatar_${size} ${checked ? 'avatar_checked' : ''}`}>
      { avatar
        ? <img className='avatar__img' src={avatar} alt='avatar' />
        : <div
            style={{'backgroundColor': colors[color[color.length - 1]]}} className='avatar_default'
          >
            {defaultName}
          </div>
      }
      </div>
    );
}
