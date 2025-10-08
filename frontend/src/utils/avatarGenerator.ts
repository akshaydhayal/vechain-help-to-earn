/**
 * Generate unique avatar based on user address
 * Creates a deterministic avatar using the address as seed
 */

// Removed unused interface to fix build warnings

export function generateAvatar(address: string, size: number = 32): string {
  // Create a simple hash from the address
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    const char = address.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use hash to generate consistent colors
  const hue = Math.abs(hash) % 360;
  const saturation = 60 + (Math.abs(hash >> 8) % 30); // 60-90%
  const lightness = 45 + (Math.abs(hash >> 16) % 20); // 45-65%
  
  const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const textColor = lightness > 55 ? '#000000' : '#ffffff';
  
  // Get initials from address (first 2 characters after 0x)
  const initials = address.slice(2, 4).toUpperCase();
  
  // Create SVG avatar
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size/8}"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.35em" 
            font-family="Arial, sans-serif" font-size="${size * 0.4}" 
            font-weight="bold" fill="${textColor}">${initials}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function generateAvatarWithPattern(address: string, size: number = 32): string {
  // Create a more complex pattern based on address
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    const char = address.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const hue = Math.abs(hash) % 360;
  const saturation = 70 + (Math.abs(hash >> 8) % 20);
  const lightness = 50 + (Math.abs(hash >> 16) % 30);
  
  const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const patternColor = `hsl(${hue}, ${saturation}%, ${lightness + 20}%)`;
  const textColor = lightness > 60 ? '#000000' : '#ffffff';
  
  const initials = address.slice(2, 4).toUpperCase();
  
  // Create pattern based on address
  const patternType = Math.abs(hash >> 24) % 4;
  let pattern = '';
  
  switch (patternType) {
    case 0: // Circles
      pattern = `<circle cx="${size/3}" cy="${size/3}" r="${size/6}" fill="${patternColor}" opacity="0.3"/>
                 <circle cx="${size*2/3}" cy="${size*2/3}" r="${size/8}" fill="${patternColor}" opacity="0.3"/>`;
      break;
    case 1: // Lines
      pattern = `<line x1="0" y1="${size/2}" x2="${size}" y2="${size/2}" stroke="${patternColor}" stroke-width="2" opacity="0.3"/>
                 <line x1="${size/2}" y1="0" x2="${size/2}" y2="${size}" stroke="${patternColor}" stroke-width="2" opacity="0.3"/>`;
      break;
    case 2: // Triangles
      pattern = `<polygon points="${size/4},${size/4} ${size*3/4},${size/4} ${size/2},${size*3/4}" fill="${patternColor}" opacity="0.2"/>`;
      break;
    case 3: // Squares
      pattern = `<rect x="${size/4}" y="${size/4}" width="${size/2}" height="${size/2}" fill="${patternColor}" opacity="0.2"/>`;
      break;
  }
  
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}" rx="${size/8}"/>
      ${pattern}
      <text x="50%" y="50%" text-anchor="middle" dy="0.35em" 
            font-family="Arial, sans-serif" font-size="${size * 0.35}" 
            font-weight="bold" fill="${textColor}">${initials}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function getAvatarForAddress(address: string, size: number = 32): string {
  return generateAvatarWithPattern(address, size);
}
