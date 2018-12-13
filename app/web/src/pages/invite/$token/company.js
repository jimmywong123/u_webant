import React from 'react';
import Company from '../components/Company';

export default (ctx) => {
  const {match} = ctx
  const {params} = match

  return ( 
    <div>
      <Company token={params.token} />
    </div>
  )
}