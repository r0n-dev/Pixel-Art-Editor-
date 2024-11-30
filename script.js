const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('colorPicker');
const gridSizeSelect = document.getElementById('gridSize');
const clearButton = document.getElementById('clearCanvas');
const saveButton = document.getElementById('saveCanvas');
const loadButton = document.getElementById('loadCanvas');
const downloadButton = document.getElementById('download');
const eraserButton = document.getElementById('eraser');

let selectedColor = colorPicker.value;
let isMouseDown = false;
let eraserActive = false;

colorPicker.addEventListener('input', () => {
  selectedColor = colorPicker.value;
  eraserActive = false;
});

eraserButton.addEventListener('click', () => {
  eraserActive = true;
});

function createCanvas(size) {
  canvas.innerHTML = '';
  const pixelSize = Math.floor(canvas.offsetWidth / size);
  canvas.style.gridTemplateColumns = `repeat(${size}, ${pixelSize}px)`;
  canvas.style.gridTemplateRows = `repeat(${size}, ${pixelSize}px)`;

  for (let i = 0; i < size * size; i++) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixel.style.width = `${pixelSize}px`;
    pixel.style.height = `${pixelSize}px`;
    pixel.addEventListener('mousedown', colorPixel);
    pixel.addEventListener('mousemove', colorPixelOnDrag);
    canvas.appendChild(pixel);
  }
}

function colorPixel(event) {
  if (eraserActive) {
    event.target.style.backgroundColor = 'white';
  } else {
    event.target.style.backgroundColor = selectedColor;
  }
}

function colorPixelOnDrag(event) {
  if (isMouseDown) {
    colorPixel(event);
  }
}

canvas.addEventListener('mousedown', () => (isMouseDown = true));
canvas.addEventListener('mouseup', () => (isMouseDown = false));
canvas.addEventListener('mouseleave', () => (isMouseDown = false));

createCanvas(16);

gridSizeSelect.addEventListener('change', function () {
  createCanvas(parseInt(this.value));
});

clearButton.addEventListener('click', function () {
  document.querySelectorAll('.pixel').forEach(pixel => {
    pixel.style.backgroundColor = 'white';
  });
});

saveButton.addEventListener('click', function () {
  const pixelColors = Array.from(document.querySelectorAll('.pixel')).map(
    pixel => pixel.style.backgroundColor || 'white'
  );
  localStorage.setItem('pixelArt', JSON.stringify(pixelColors));
  alert('Dein Pixelbild wurde gespeichert!');
});

loadButton.addEventListener('click', function () {
  const pixelColors = JSON.parse(localStorage.getItem('pixelArt'));
  if (pixelColors) {
    document.querySelectorAll('.pixel').forEach((pixel, index) => {
      pixel.style.backgroundColor = pixelColors[index];
    });
  } else {
    alert('Kein gespeichertes Pixelbild gefunden.');
  }
});

downloadButton.addEventListener('click', function () {
  html2canvas(canvas, { backgroundColor: null }).then(canvasElement => {
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvasElement.toDataURL('image/png');
    link.click();
  });
});
