import React from 'react';
import './Avatar.css';
import {getColor} from './DefaultColors.js'

export function Avatar ({ size = 'large', img, checked, name, color='0' }) {
  
    let defaultName = '';
    if (name) {
      name.split(' ').forEach(word => {
        defaultName += word[0].toUpperCase();
      });
    }
    
    return (
      <div className={`avatar avatar_${size} ${checked ? 'avatar_checked' : ''}`}>
      { img
        ? <img className='avatar__img' src={img} alt='avatar' />
        : <div
            style={{'backgroundColor': getColor(color)}}
            className='avatar_default'
          >
            {defaultName}
          </div>
      }
      </div>
    );
}
