function calculateRecord(milliseconds){
  
  const seconds = (Math.floor( (milliseconds/1000) % 60 )) < 10 ? "0" + (Math.floor( (milliseconds/1000) % 60 )) : Math.floor( (milliseconds/1000) % 60 );
  const minutes = ((Math.floor( (milliseconds/1000/60) % 60 )) < 10) ? "0" + (Math.floor( (milliseconds/1000/60) % 60 )) : Math.floor( (milliseconds/1000/60) % 60 );
  const hours = ((Math.floor( (milliseconds/(1000*60*60)) % 24 )) < 10) ? ("0" + (Math.floor( (milliseconds/(1000*60*60)) % 24 ))) : Math.floor( (milliseconds/(1000*60*60)) % 24 );
  const days = ((Math.floor( milliseconds/(1000*60*60*24)) < 10) ? ("0" + (Math.floor( milliseconds/(1000*60*60*24)))) : Math.floor( milliseconds/(1000*60*60*24) ) );
  const record = `${days}d - ${hours}h:${minutes}m:${seconds}s`

  return record
}

function calculateTimeLastIntervention(milliseconds){
  
  const seconds = Math.floor( (milliseconds/1000) % 60 );
  const minutes = Math.floor( (milliseconds/1000/60) % 60 );
  const hours = Math.floor( (milliseconds/(1000*60*60)) % 24 );
  const days = Math.floor( milliseconds/(1000*60*60*24));

  return { 
    days,
    hours,
    minutes,
    seconds
  }
}

module.exports = {
  calculateRecord,
  calculateTimeLastIntervention
}


