function createStars() {
  const starCount = 150;
  const container = document.body;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const size = Math.random() * 2 + 1; 
    const x = Math.random() * 100; 
    const y = Math.random() * 100; 
    const opacity = Math.random() * 0.7 + 0.3;

    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = x + '%';
    star.style.top = y + '%';
    star.style.opacity = opacity;

    container.appendChild(star);
  }
}

createStars();