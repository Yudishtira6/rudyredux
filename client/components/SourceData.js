import React from 'react';

const SourceData=({ data })=>{
    return(
            <div className="source-data">
              <img className="source-image" src={data.attributionLogo}/>
              <h3>Bench Name: {data.benchName}</h3>
              <h3>Moderation Stop Codes: {data.ModStopCodes.map((code)=>{return <span key={code} className="stp-code">{code}</span>})}</h3>
              <h3>Locales That will Syndicate: {data.Loc}</h3>
            </div>
          );
    }

export default SourceData;
