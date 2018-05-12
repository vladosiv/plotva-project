import React from 'react';
import { storiesOf } from '@storybook/react';
import { Contact } from '../../src/components/Contact/Contact';

export default storiesOf('Contact', module)
  .add('Standart contact with different sizes', () => ([
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='large'
      contentType='message'
    />,
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='large'
      contentType='message'
    />,
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='large'
      contentType='message'
    />,
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='medium'
      contentType='message'
    />,
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='medium'
      contentType='message'
    />,
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='medium'
      contentType='message'
    />,
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='small'
      contentType='message'
    />,
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='small'
      contentType='message'
    />,
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='small'
      contentType='message'
    />
  ]))
  .add('checked', () => (
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='large'
      contentType='message'
      checked='true'
    />
  ))
  .add('time', () => (
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='large'
      contentType='message'
      time='9:00'
    />
  ))
  .add('count', () => (
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='large'
      contentType='message'
      count='9'
    />
  ))
  .add('with status icons', () => ([
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='large'
      contentType='message'
      time='9:00'      
      count='9'
      icon='message-sent'
    />,
    <Contact
      name='Lena Cohen'
      content='+65 8586 3216'
      size='large'
      contentType='message'
      time='9:00'      
      count='9'
      icon='message-read'
    />
  ]
  ))