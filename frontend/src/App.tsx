import React, { Dispatch, SetStateAction, useState } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

interface CalcSpectrumResponse {
  x: number[],
  y: number[],
}

const callCalcSpectrum = (setData: Dispatch<SetStateAction<CalcSpectrumResponse>>) => {
  const url = "http://localhost:5000/calc-spectrum"
  fetch(url, {
    method: "GET"
  }).then(response => response.json()).then(data => setData(data));
}

function App() {
  const [data, setData] = useState<CalcSpectrumResponse>({x: [], y: []})
  if (data) console.log(data)
  return (
    <div className="App">
      <header className="App-header">
        {data.x.length > 0 && <Plot
          className="Plot"
          data={[
            {
              x: data && data.x,
              y: data && data.y,
              type: 'scatter',
            },
          ]}
          layout={{ width: 800, height: 600, title: 'A Fancy Plot' }}
        />}
        <button type="button" onClick={() => callCalcSpectrum(setData)}>Generate graph</button>
      </header>
    </div>
  );
}

export default App;
