import './App.css';
import React, { useEffect, useState, useRef } from "react";

function makeRandomNumber() {
  return Math.floor(Math.random() * 1000)%400;
}

function drawLineOncanvas(canvas, color, x1, y1, x2, y2) {
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function gridCanvas(canvas, color) {
  const ctx = canvas.getContext("2d");
  for(let i=0;i<canvas.width;i+=100) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.width);
    ctx.lineWidth = 0.1;
    ctx.stroke();
  }
  for(let i=0;i<canvas.height;i+=50) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.lineWidth = 0.1;
    ctx.stroke();
  }
}

function TickerChart({canvasRef, canvasWrapperRef}) {
  return (
    <div className="canvas">
      <h2>Ticker Chart</h2>
      <div className="scroll-canvas" ref={canvasWrapperRef}>
        <canvas ref={canvasRef} width="20000px" height="400px"></canvas>
      </div>
    </div>
  )
}

function Ticker() {
  const [price, setPrice] = useState(0);
  const [color, setColor] = useState("black");

  const prevPriceRef = useRef(price);
  const x = useRef(0)
  const y = useRef(0)
  const canvasRef = useRef()
  const canvasWrapperRef = useRef()

  useEffect(() => {
    const prevPrice = prevPriceRef.current;

    if(x.current > canvasWrapperRef.current.getBoundingClientRect().width) {
      canvasWrapperRef.current.scrollBy(3, 0)
    }

    const prevX = x.current
    const prevY = y.current
    x.current += 3
    y.current = price
    
    if(price > prevPrice){
      setColor("green");
    } else if (price < prevPrice) {
      setColor("red");
    } else {
      //setColor("black");
    }

    drawLineOncanvas(canvasRef.current, color, prevX, prevY, x.current, y.current)

    prevPriceRef.current = price
  },[price, color])

  useEffect(() => {

    gridCanvas(canvasRef.current, "rgb(179, 179, 240)")
    // every 1 second, generate a new random price
    const id = setInterval(() => setPrice(makeRandomNumber), 100);
    return function () {
      clearInterval(id);
    };
  }, []);

  return (
    <div className="ticker-master">
    <h1 className="subject"><b>useRef</b> Advanced REACT Hook</h1>
      <h2>TickerMaster</h2>
      <h2 style={{ color: color }}>Price: ${price}</h2>

      <TickerChart canvasWrapperRef={canvasWrapperRef} canvasRef={canvasRef}/>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Ticker />
    </div>
  );
}

export default App;
