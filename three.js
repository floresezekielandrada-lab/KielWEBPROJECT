// Three.js 3D Coffee Background - Super Smooth!
// Using instanced meshes for performance (no lag!)

const canvas = document.getElementById('coffee3D');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  canvas, 
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});

// Renderer settings for smooth performance
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// Coffee colors
const coffeeColors = [
  0x5a3f33, // dark brown
  0x7b563f, // medium brown
  0x8b6914, // golden brown
  0x3a2b20, // dark roast
  0xd4a373  // light cream
];

// Create floating coffee particles (using Points for performance)
function createCoffeeParticles() {
  const particleCount = 300;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Spread particles in 3D space
    positions[i3] = (Math.random() - 0.5) * 30;
    positions[i3 + 1] = (Math.random() - 0.5) * 30;
    positions[i3 + 2] = (Math.random() - 0.5) * 20 - 10;
    
    // Random coffee colors
    const color = new THREE.Color(coffeeColors[Math.floor(Math.random() * coffeeColors.length)]);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    
    sizes[i] = Math.random() * 0.3 + 0.1;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Custom shader for coffee particle appearance
  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending
  });
  
  return new THREE.Points(geometry, material);
}

// Create steam effect (subtle, smooth)
function createSteam() {
  const steamGeometry = new THREE.BufferGeometry();
  const steamCount = 100;
  const steamPositions = new Float32Array(steamCount * 3);
  
  for (let i = 0; i < steamCount; i++) {
    steamPositions[i * 3] = (Math.random() - 0.5) * 15;
    steamPositions[i * 3 + 1] = Math.random() * 10 - 5;
    steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
  }
  
  steamGeometry.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
  
  const steamMaterial = new THREE.PointsMaterial({
    size: 0.4,
    color: 0xf3ece6,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });
  
  return new THREE.Points(steamGeometry, steamMaterial);
}

// Create floating coffee beans (3D objects)
function createCoffeeBeans() {
  const beans = [];
  const beanGeometry = new THREE.CapsuleGeometry(0.08, 0.2, 4, 8);
  
  for (let i = 0; i < 50; i++) {
    const beanMaterial = new THREE.MeshStandardMaterial({
      color: coffeeColors[Math.floor(Math.random() * 3)],
      roughness: 0.8,
      metalness: 0.1
    });
    
    const bean = new THREE.Mesh(beanGeometry, beanMaterial);
    bean.position.set(
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 15 - 5
    );
    bean.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    bean.userData = {
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      floatSpeed: Math.random() * 0.005 + 0.002,
      floatOffset: Math.random() * Math.PI * 2
    };
    
    beans.push(bean);
  }
  
  return beans;
}

// Initialize scene
const particles = createCoffeeParticles();
const steam = createSteam();
const coffeeBeans = createCoffeeBeans();

scene.add(particles);
scene.add(steam);
coffeeBeans.forEach(bean => scene.add(bean));

// Camera position
camera.position.z = 8;

// Lighting
const ambientLight = new THREE.AmbientLight(0xd4a373, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xd4a373, 1, 50);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xf3ece6, 0.5, 50);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
});

// Animation loop
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;
  
  // Smooth mouse following
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  
  camera.position.x += (targetX * 2 - camera.position.x) * 0.05;
  camera.position.y += (-targetY * 2 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  
  // Rotate particles slowly
  particles.rotation.y += 0.0005;
  particles.rotation.x += 0.0002;
  
  // Animate steam rising
  const steamPositions = steam.geometry.attributes.position.array;
  for (let i = 0; i < steamPositions.length; i += 3) {
    steamPositions[i + 1] += 0.02;
    if (steamPositions[i + 1] > 5) {
      steamPositions[i + 1] = -5;
    }
  }
  steam.geometry.attributes.position.needsUpdate = true;
  steam.rotation.y += 0.001;
  
  // Animate coffee beans
  coffeeBeans.forEach(bean => {
    const data = bean.userData;
    bean.rotation.x += data.rotSpeed.x;
    bean.rotation.y += data.rotSpeed.y;
    bean.rotation.z += data.rotSpeed.z;
    bean.position.y += Math.sin(time * data.floatSpeed * 100 + data.floatOffset) * 0.002;
  });
  
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

console.log('☕ 3D Coffee Background Loaded!');