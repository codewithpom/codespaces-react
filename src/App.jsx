import React, { useState, useRef, forwardRef } from 'react';
import { Chessboard } from 'react-chessboard';
import html2canvas from 'html2canvas';
import { Chess } from 'chess.js';
import './App.css'; // Import the CSS file for dark theme

const CustomSquareRenderer = forwardRef(({ children, square, squareColor, style }, ref) => {
  return (
    <div ref={ref} style={{ ...style, position: 'relative' }}>
      {children}
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 16,
          width: 16,
          borderTopLeftRadius: 6,
          backgroundColor: squareColor === 'black' ? '#064e3b' : '#312e81',
          color: '#fff',
          fontSize: 14,
        }}
      >
        {square}
      </div>
    </div>
  );
});

const ChessboardPage = () => {
  const [fen, setFen] = useState('start');
  const [arrows, setArrows] = useState([]);
  const [isAddingArrow, setIsAddingArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState(null);
  const [boardWidth, setBoardWidth] = useState(480);
  const [useCustomSquares, setUseCustomSquares] = useState(true);
  const chessboardContainerRef = useRef(null);
  const chess = new Chess();

  const handleFenChange = (event) => {
    setFen(event.target.value);
    chess.load(event.target.value);
  };

  const handleArrowChange = (index, field, value) => {
    const newArrows = [...arrows];
    newArrows[index][field] = value;
    setArrows(newArrows);
  };

  const addArrow = () => {
    setArrows([...arrows, { src: '', dest: '', color: '' }]);
  };

  const removeArrow = (index) => {
    const newArrows = arrows.filter((_, i) => i !== index);
    setArrows(newArrows);
  };

  const handleSquareClick = (square) => {
    if (isAddingArrow) {
      if (arrowStart) {
        setArrows([...arrows, { src: arrowStart, dest: square, color: 'red' }]);
        setArrowStart(null);
        setIsAddingArrow(false);
      } else {
        setArrowStart(square);
      }
    }
  };

  const captureChessboard = async () => {
    if (chessboardContainerRef.current) {
      setBoardWidth(1080);
      setUseCustomSquares(false);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for the board to resize
      const canvas = await html2canvas(chessboardContainerRef.current);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'chessboard.png';
      link.click();
      setBoardWidth(480);
      setUseCustomSquares(true);
    }
  };

  return (
    <div className="dark-theme">
      <h1>Chessboard with Arrows</h1>
      <div>
        <label>
          FEN:
          <input type="text" value={fen} onChange={handleFenChange} />
        </label>
      </div>
      <div>
        <h2>Arrows</h2>
        <button onClick={addArrow}>Add Arrow</button>
        <button onClick={() => setIsAddingArrow(true)}>Start Adding Arrow</button>
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Destination</th>
              <th>Color</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {arrows.map((arrow, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={arrow.src}
                    onChange={(e) => handleArrowChange(index, 'src', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={arrow.dest}
                    onChange={(e) => handleArrowChange(index, 'dest', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={arrow.color}
                    onChange={(e) => handleArrowChange(index, 'color', e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => removeArrow(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div ref={chessboardContainerRef} style={{ display: 'inline-block' }}>
        <Chessboard
          id="StyledBoard"
          boardOrientation="black"
          position={fen}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)"
          }}
          customDarkSquareStyle={{
            backgroundColor: "#779952"
          }}
          customLightSquareStyle={{
            backgroundColor: "#edeed1"
          }}
          customSquare={useCustomSquares ? CustomSquareRenderer : undefined}
          customArrows={arrows.map(({ src, dest, color }) => [src, dest, color])}
          boardWidth={boardWidth}
          onSquareClick={handleSquareClick}
        />
      </div>
      <button onClick={captureChessboard}>Download Chessboard</button>
    </div>
  );
};

export default ChessboardPage;