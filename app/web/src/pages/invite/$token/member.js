import React from 'react';
import Member from '../components/Member';

export default (ctx) => {
  const {match} = ctx
  const {params} = match

  return (
    <div>
      <Member token={params.token} />
    </div>
  )
} 