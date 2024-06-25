import React, { useEffect, useState } from 'react'
import { ReactReader } from 'react-reader'
const EpubViewer = (props) => {
  const [location, setLocation] = useState(0)
  useEffect(()=>{
    console.log(props)
    console.log(location)
  },[location])
  return (
    <div className='h-full'>
      <div style={{ height: '100vh' }}>
        <ReactReader
          url={props}
          location={location}
          locationChanged={(epubcfi) => setLocation(epubcfi)}
        />
      </div>
    </div>
  )
};

export default EpubViewer;