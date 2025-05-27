import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [collaborations, setCollaborations] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [isRaceWeekend, setIsRaceWeekend] = useState(false);
  const [nextRace, setNextRace] = useState(null);
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [gear, setGear] = useState('Helmet');
  const [color, setColor] = useState('blue');
  const [pattern, setPattern] = useState('solid');
  const [image, setImage] = useState(null);
  const [designRace, setDesignRace] = useState('');
  const [selectedForAR, setSelectedForAR] = useState(false);
  const [sharedPlatforms, setSharedPlatforms] = useState([]);
  // New helmet-specific states
  const [helmetShape, setHelmetShape] = useState('standard');
  const [decals, setDecals] = useState([]);
  const [sponsorLogos, setSponsorLogos] = useState([]);
  const canvasRef = useRef();
  const threeRef = useRef();
  const fileInputRef = useRef();
  const decalInputRef = useRef();
  const sponsorInputRef = useRef();
  const designListRef = useRef();

  // Color and pattern options
  const colorOptions = [
    { value: 'blue', label: 'Sapphire Blue', hex: '#005566' },
    { value: 'red', label: 'Rosso Corsa', hex: '#D91E2A' },
    { value: 'ferrari_red', label: 'Ferrari Red', hex: '#ED1C24' },
    { value: 'mclaren_orange', label: 'McLaren Papaya', hex: '#F58020' },
    { value: 'mercedes_silver', label: 'Mercedes Silver', hex: '#B7C7C4' },
    { value: 'redbull_blue', label: 'Red Bull Navy', hex: '#1B3A67' },
    { value: 'gold', label: 'Champagne Gold', hex: '#D4A017' },
    { value: 'carbon_black', label: 'Carbon Black', hex: '#1C2526' },
    { value: 'lime_green', label: 'Lime Green', hex: '#32CD32' },
    { value: 'sunset_yellow', label: 'Sunset Yellow', hex: '#F9B000' },
    { value: 'monaco_white', label: 'Monaco White', hex: '#F5F6F5' },
    { value: 'purple_haze', label: 'Purple Haze', hex: '#800080' },
    { value: 'bronze', label: 'Bronze Metallic', hex: '#CD7F32' },
    { value: 'turquoise', label: 'Turquoise', hex: '#40E0D0' }
  ];
  const patternOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'striped', label: 'Racing Stripes' },
    { value: 'checkered', label: 'Checkered Flag' },
    { value: 'gradient', label: 'Gradient Fade' },
    { value: 'carbon_fiber', label: 'Carbon Weave' },
    { value: 'camouflage', label: 'Stealth Camo' },
    { value: 'chevron', label: 'Chevron Arrows' },
    { value: 'flag_inspired', label: 'National Flag' }
  ];
  // Helmet-specific options
  const helmetShapeOptions = [
    { value: 'standard', label: 'Standard Full-Face' },
    { value: 'aero', label: 'Aerodynamic' },
    { value: 'retro', label: 'Retro Open-Face' }
  ];

  // Race presets
  const racePresets = {
    '2025-03-16': { color: 'lime_green', pattern: 'checkered', title: 'Helmet Alpha', helmetShape: 'aero' },
    '2025-03-23': { color: 'redbull_blue', pattern: 'striped', title: 'Helmet Surge', helmetShape: 'standard' },
    '2025-04-06': { color: 'sunset_yellow', pattern: 'gradient', title: 'Helmet Bloom', helmetShape: 'retro' },
    '2025-04-13': { color: 'carbon_black', pattern: 'carbon_fiber', title: 'Helmet Blaze', helmetShape: 'aero' },
    '2025-04-20': { color: 'red', pattern: 'flag_inspired', title: 'Helmet Star', helmetShape: 'standard' },
    '2025-05-04': { color: 'mclaren_orange', pattern: 'chevron', title: 'Helmet Heat', helmetShape: 'aero' },
    '2025-05-18': { color: 'mercedes_silver', pattern: 'solid', title: 'Helmet Shine', helmetShape: 'retro' },
    '2025-05-25': { color: 'gold', pattern: 'carbon_fiber', title: 'Helmet Spark', helmetShape: 'standard' },
    '2025-06-01': { color: 'ferrari_red', pattern: 'striped', title: 'Helmet Passion', helmetShape: 'aero' },
    '2025-06-15': { color: 'turquoise', pattern: 'gradient', title: 'Helmet Cool', helmetShape: 'retro' },
    '2025-06-29': { color: 'bronze', pattern: 'checkered', title: 'Helmet Grit', helmetShape: 'standard' },
    '2025-07-06': { color: 'red', pattern: 'flag_inspired', title: 'Helmet Classic', helmetShape: 'aero' },
    '2025-07-27': { color: 'purple_haze', pattern: 'camouflage', title: 'Helmet Mystique', helmetShape: 'retro' },
    '2025-08-03': { color: 'mclaren_orange', pattern: 'chevron', title: 'Helmet Blaze', helmetShape: 'standard' },
    '2025-08-31': { color: 'redbull_blue', pattern: 'solid', title: 'Helmet Tide', helmetShape: 'aero' },
    '2025-09-07': { color: 'ferrari_red', pattern: 'carbon_fiber', title: 'Helmet Flair', helmetShape: 'retro' },
    '2025-09-21': { color: 'sunset_yellow', pattern: 'flag_inspired', title: 'Helmet Glow', helmetShape: 'standard' },
    '2025-10-05': { color: 'carbon_black', pattern: 'gradient', title: 'Helmet Night', helmetShape: 'aero' },
    '2025-10-19': { color: 'mclaren_orange', pattern: 'striped', title: 'Helmet Speed', helmetShape: 'retro' },
    '2025-10-26': { color: 'lime_green', pattern: 'chevron', title: 'Helmet Fiesta', helmetShape: 'standard' },
    '2025-11-09': { color: 'turquoise', pattern: 'checkered', title: 'Helmet Samba', helmetShape: 'aero' },
    '2025-11-22': { color: 'purple_haze', pattern: 'gradient', title: 'Helmet Neon', helmetShape: 'retro' },
    '2025-11-30': { color: 'monaco_white', pattern: 'solid', title: 'Helmet Pearl', helmetShape: 'standard' },
    '2025-12-07': { color: 'gold', pattern: 'flag_inspired', title: 'Helmet Glory', helmetShape: 'aero' }
  };

  // IntersectionObserver for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = designListRef.current?.querySelectorAll('.design-item, .preview-card');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [designs]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const collabRes = await fetch('http://localhost:5000/api/collaborations');
        if (!collabRes.ok) throw new Error(`Collaborations fetch failed: ${collabRes.status}`);
        const collabData = await collabRes.json();
        setCollaborations(collabData);

        const scheduleRes = await fetch('http://localhost:5000/api/race-schedule');
        if (!scheduleRes.ok) throw new Error(`Race schedule fetch failed: ${scheduleRes.status}`);
        const scheduleData = await scheduleRes.json();
        setNextRace(scheduleData.nextRace);
        setIsRaceWeekend(scheduleData.isRaceWeekend);
        const raceList = scheduleData.raceWeekends.map(date => ({
          date: new Date(date).toISOString().split('T')[0],
          name: getRaceName(new Date(date).toISOString().split('T')[0])
        }));
        setRaces(raceList);
        setSelectedRace(scheduleData.nextRace ? new Date(scheduleData.nextRace).toISOString().split('T')[0] : raceList[0]?.date || '');
        setDesignRace(scheduleData.nextRace ? new Date(scheduleData.nextRace).toISOString().split('T')[0] : raceList[0]?.date || '');
      } catch (err) {
        console.error('Initial fetch error:', err);
        setError(err.message);
        toast.error('Failed to load initial data: ' + err.message);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch designs
  useEffect(() => {
    if (!selectedRace) return;
    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const designsRes = await fetch(`http://localhost:5000/api/ar-designs?race=${encodeURIComponent(selectedRace)}&page=${pagination.page}&limit=${pagination.limit}`);
        if (!designsRes.ok) throw new Error(`Designs fetch failed: ${designsRes.status}`);
        const designsData = await designsRes.json();
        setDesigns(designsData.designs || []);
        setPagination(prev => ({
          ...prev,
          ...designsData.pagination,
          pages: designsData.pagination.total > 0 ? designsData.pagination.pages : 1
        }));
      } catch (err) {
        console.error('Designs fetch error:', err);
        setError(err.message);
        toast.error('Failed to load designs: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, [selectedRace, pagination.page, pagination.limit]);

  // Debug UI
  useEffect(() => {
    console.log('UI Rendered:', { isRaceWeekend, designsCount: designs.length, error, pagination, selectedRace });
  }, [isRaceWeekend, designs, error, pagination, selectedRace]);

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Handle race selection
  const handleRaceChange = (e) => {
    const newRace = e.target.value;
    setSelectedRace(newRace);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Apply race preset
  const applyPreset = (raceDate) => {
    const preset = racePresets[raceDate];
    if (preset) {
      setColor(preset.color);
      setPattern(preset.pattern);
      setTitle(preset.title);
      setDesignRace(raceDate);
      setSelectedForAR(true);
      setHelmetShape(preset.helmetShape);
    }
  };

  // Handle decals and sponsors
  const handleAddDecal = (e) => {
    if (e.target.files[0]) {
      setDecals([...decals, e.target.files[0]]);
      decalInputRef.current.value = '';
    }
  };

  const handleAddSponsor = (e) => {
    if (e.target.files[0]) {
      setSponsorLogos([...sponsorLogos, e.target.files[0]]);
      sponsorInputRef.current.value = '';
    }
  };

  // Render thumbnail
  const renderThumbnail = (designData, width = 80, height = 80) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const selectedColor = colorOptions.find(c => c.value === designData.color)?.hex || '#005566';
    ctx.fillStyle = selectedColor;

    if (designData.gear === 'Helmet') {
      const isAero = designData.helmetShape === 'aero';
      const isRetro = designData.helmetShape === 'retro';
      ctx.beginPath();
      if (isRetro) {
        ctx.moveTo(width * 0.25, height * 0.3);
        ctx.quadraticCurveTo(width * 0.5, height * 0.15, width * 0.75, height * 0.3);
        ctx.lineTo(width * 0.75, height * 0.6);
        ctx.lineTo(width * 0.25, height * 0.6);
      } else {
        ctx.moveTo(width * 0.25, height * 0.25);
        ctx.quadraticCurveTo(width * 0.5, isAero ? height * 0.05 : height * 0.1, width * 0.75, height * 0.25);
        ctx.lineTo(width * 0.75, height * 0.75);
        ctx.quadraticCurveTo(width * 0.5, isAero ? height * 0.95 : height * 0.9, width * 0.25, height * 0.75);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      // Other gear rendering (unchanged)
      if (designData.gear === 'Gloves') {
        ctx.beginPath();
        ctx.moveTo(width * 0.25, height * 0.25);
        ctx.lineTo(width * 0.75, height * 0.25);
        ctx.quadraticCurveTo(width * 0.8, height * 0.5, width * 0.75, height * 0.75);
        ctx.lineTo(width * 0.25, height * 0.75);
        ctx.quadraticCurveTo(width * 0.2, height * 0.5, width * 0.25, height * 0.25);
        ctx.closePath();
        ctx.fill();
      } else if (designData.gear === 'Suit') {
        ctx.beginPath();
        ctx.rect(width * 0.25, height * 0.25, width * 0.5, height * 0.5);
        ctx.fill();
      } else if (designData.gear === 'Boots') {
        ctx.beginPath();
        ctx.moveTo(width * 0.25, height * 0.5);
        ctx.lineTo(width * 0.4, height * 0.25);
        ctx.lineTo(width * 0.6, height * 0.25);
        ctx.lineTo(width * 0.75, height * 0.5);
        ctx.lineTo(width * 0.6, height * 0.75);
        ctx.lineTo(width * 0.4, height * 0.75);
        ctx.closePath();
        ctx.fill();
      } else if (designData.gear === 'Visor') {
        ctx.beginPath();
        ctx.moveTo(width * 0.25, height * 0.4);
        ctx.quadraticCurveTo(width * 0.5, height * 0.25, width * 0.75, height * 0.4);
        ctx.lineTo(width * 0.75, height * 0.6);
        ctx.quadraticCurveTo(width * 0.5, height * 0.75, width * 0.25, height * 0.6);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Patterns (unchanged)
    if (designData.pattern === 'striped') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      for (let i = 0; i < width; i += 5) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
    } else if (designData.pattern === 'checkered') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < width; i += 10) {
        for (let j = 0; j < height; j += 10) {
          if ((i / 10 + j / 10) % 2 === 0) {
            ctx.fillRect(i, j, 10, 10);
          }
        }
      }
    } else if (designData.pattern === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, selectedColor);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (designData.pattern === 'carbon_fiber') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      for (let i = 0; i < width; i += 5) {
        for (let j = 0; j < height; j += 5) {
          ctx.fillRect(i, j, 2, 2);
        }
      }
    } else if (designData.pattern === 'camouflage') {
      ctx.fillStyle = 'rgba(50, 80, 50, 0.5)';
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    } else if (designData.pattern === 'chevron') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      for (let i = 0; i < height; i += 10) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width / 2, i + 5);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
    } else if (designData.pattern === 'flag_inspired') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(width / 3, 0, width / 3, height);
    }

    return canvas.toDataURL();
  };

  // 2D Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const selectedColor = colorOptions.find(c => c.value === color)?.hex || '#005566';
    ctx.fillStyle = selectedColor;

    if (gear === 'Helmet') {
      const isAero = helmetShape === 'aero';
      const isRetro = helmetShape === 'retro';
      ctx.beginPath();
      if (isRetro) {
        ctx.moveTo(50, 60);
        ctx.quadraticCurveTo(100, 30, 150, 60);
        ctx.lineTo(150, 120);
        ctx.lineTo(50, 120);
      } else {
        ctx.moveTo(50, 50);
        ctx.quadraticCurveTo(100, isAero ? 10 : 20, 150, 50);
        ctx.lineTo(150, 150);
        ctx.quadraticCurveTo(100, isAero ? 190 : 180, 50, 150);
      }
      ctx.closePath();
      ctx.fill();

      // Render decals
      decals.forEach((decal, index) => {
        const img = new Image();
        img.src = URL.createObjectURL(decal);
        img.onload = () => {
          ctx.drawImage(img, 70 + index * 20, 50, 30, 30);
        };
      });

      // Render sponsor logos
      sponsorLogos.forEach((logo, index) => {
        const img = new Image();
        img.src = URL.createObjectURL(logo);
        img.onload = () => {
          ctx.drawImage(img, 70 + index * 20, 100, 30, 15);
        };
      });
    } else {
      // Other gear rendering (unchanged)
      if (gear === 'Gloves') {
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(150, 50);
        ctx.quadraticCurveTo(160, 100, 150, 150);
        ctx.lineTo(50, 150);
        ctx.quadraticCurveTo(40, 100, 50, 50);
        ctx.closePath();
        ctx.fill();
      } else if (gear === 'Suit') {
        ctx.beginPath();
        ctx.rect(50, 50, 100, 100);
        ctx.fill();
      } else if (gear === 'Boots') {
        ctx.beginPath();
        ctx.moveTo(50, 100);
        ctx.lineTo(80, 50);
        ctx.lineTo(120, 50);
        ctx.lineTo(150, 100);
        ctx.lineTo(120, 150);
        ctx.lineTo(80, 150);
        ctx.closePath();
        ctx.fill();
      } else if (gear === 'Visor') {
        ctx.beginPath();
        ctx.moveTo(50, 80);
        ctx.quadraticCurveTo(100, 50, 150, 80);
        ctx.lineTo(150, 120);
        ctx.quadraticCurveTo(100, 150, 50, 120);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Patterns (unchanged)
    if (pattern === 'striped') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 5;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
    } else if (pattern === 'checkered') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < canvas.width; i += 20) {
        for (let j = 0; j < canvas.height; j += 20) {
          if ((i / 20 + j / 20) % 2 === 0) {
            ctx.fillRect(i, j, 20, 20);
          }
        }
      }
    } else if (pattern === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, selectedColor);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (pattern === 'carbon_fiber') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      for (let i = 0; i < canvas.width; i += 10) {
        for (let j = 0; j < canvas.height; j += 10) {
          ctx.fillRect(i, j, 5, 5);
        }
      }
    } else if (pattern === 'camouflage') {
      ctx.fillStyle = 'rgba(50, 80, 50, 0.5)';
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          10,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    } else if (pattern === 'chevron') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 5;
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width / 2, i + 10);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    } else if (pattern === 'flag_inspired') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(canvas.width / 3, 0, canvas.width / 3, canvas.height);
    }

    if (image) {
      const img = new Image();
      img.src = URL.createObjectURL(image);
      img.onload = () => {
        ctx.drawImage(img, 50, 50, 100, 100);
      };
    }
  }, [gear, color, pattern, image, helmetShape, decals, sponsorLogos]);

  // Three.js for 3D preview
  useEffect(() => {
    const canvas = threeRef.current;
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(250, 250);
    camera.position.z = 3;

    let object;
    const selectedColor = colorOptions.find(c => c.value === color)?.hex || '#005566';
    const material = new THREE.MeshStandardMaterial({ color: selectedColor });

    if (gear === 'Helmet') {
      if (helmetShape === 'aero') {
        object = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16).scale(1, 0.9, 1.1), material);
      } else if (helmetShape === 'retro') {
        object = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.6, 32), material);
      } else {
        object = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), material);
      }

      // Add decals as textures
      decals.forEach((decal, index) => {
        const texture = new THREE.TextureLoader().load(URL.createObjectURL(decal));
        const decalMaterial = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
        const decalGeometry = new THREE.PlaneGeometry(0.3, 0.3);
        const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);
        decalMesh.position.set(0.5 + index * 0.2, 0, 1);
        object.add(decalMesh);
      });

      // Add sponsor logos
      sponsorLogos.forEach((logo, index) => {
        const texture = new THREE.TextureLoader().load(URL.createObjectURL(logo));
        const logoMaterial = new THREE.MeshStandardMaterial({ map: texture, transparent: true });
        const logoGeometry = new THREE.PlaneGeometry(0.3, 0.15);
        const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
        logoMesh.position.set(0.5 + index * 0.2, -0.5, 1);
        object.add(logoMesh);
      });
    } else {
      // Other gear (unchanged)
      if (gear === 'Gloves') {
        object = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.2), material);
      } else if (gear === 'Suit') {
        object = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32), material);
      } else if (gear === 'Boots') {
        object = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.4), material);
      } else if (gear === 'Visor') {
        object = new THREE.Mesh(
          new THREE.PlaneGeometry(0.8, 0.4),
          new THREE.MeshStandardMaterial({ color: selectedColor, transparent: true, opacity: 0.7 })
        );
      }
    }

    scene.add(object);
    const light = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      if (object) object.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => renderer.dispose();
  }, [gear, color, helmetShape, decals, sponsorLogos]);

  // Mock AI analysis
  const runAIAnalysis = () => {
    return {
      aerodynamics: (color === 'mclaren_orange' || color === 'ferrari_red' || helmetShape === 'aero') ? 'High' : 'Medium',
      comfort: (gear === 'Suit' || gear === 'Gloves' || helmetShape === 'retro') ? 'High' : 'Medium',
      grip: (pattern === 'checkered' || pattern === 'carbon_fiber') ? 'High' : 'Medium',
      heatResistance: (color === 'monaco_white' || color === 'turquoise') ? 'High' : 'Medium'
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const aiAnalysis = runAIAnalysis();
      const designData = {
        gear,
        color,
        pattern,
        image: image ? image.name : null,
        helmetShape: gear === 'Helmet' ? helmetShape : null,
        decals: decals.map(d => d.name),
        sponsors: sponsorLogos.map(s => s.name)
      };
      const res = await fetch('http://localhost:6000/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, designData, race: designRace, selectedForAR, userId: null })
      });
      if (!res.ok) throw new Error(`Design save failed: ${res.status}`);
      const newDesign = await res.json();
      newDesign.aiAnalysis = { ...newDesign.aiAnalysis, ...aiAnalysis };
      if (newDesign.race === selectedRace && newDesign.selectedForAR) {
        setDesigns([...designs, newDesign]);
      }
      setTitle('');
      setCategory('Fashion');
      setGear('Helmet');
      setColor('blue');
      setPattern('solid');
      setImage(null);
      setDesignRace(races[0]?.date || '');
      setSelectedForAR(false);
      setHelmetShape('standard');
      setDecals([]);
      setSponsorLogos([]);
      fileInputRef.current.value = '';
      decalInputRef.current.value = '';
      sponsorInputRef.current.value = '';
      toast.success('Design saved successfully!' + (selectedForAR && isRaceWeekend ? ' Ready for AR showcase!' : ''));
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message);
      toast.error('Failed to save design: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle external sharing
  const handleShare = async (designId, platform) => {
    if (!isRaceWeekend) {
      toast.error('Sharing only available during race weekends');
      return;
    }
    try {
      const res = await fetch('http://localhost:6000/api/alias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId, platform })
      });
      if (!res.ok) throw new Error(`Share failed: ${res.status}`);
      await res.json();
      setSharedPlatforms([...sharedPlatforms, { designId, platform }]);
      toast.success(`Shared to ${platform}!`);
    } catch (err) {
      console.error('Share error:', err);
      toast.error('Failed to share: ' + err.message);
    }
  };

  // Get race name
  const getRaceName = (date) => {
    const raceNames = {
      '2025-03-16': 'Australia',
      '2025-03-23': 'China',
      '2025-04-06': 'Japan',
      '2025-04-13': 'Bahrain',
      '2025-04-20': 'Saudi Arabia',
      '2025-05-04': 'Mexico',
      '2025-05-18': 'Miami',
      '2025-05-25': 'Monaco',
      '2025-06-01': 'Spain',
      '2025-06-15': 'Canada',
      '2025-06-29': 'Austria',
      '2025-07-06': 'Great Britain',
      '2025-07-27': 'Belgium',
      '2025-08-03': 'Hungary',
      '2025-08-31': 'Netherlands',
      '2025-09-07': 'Italy',
      '2025-09-21': 'Azerbaijan',
      '2025-10-05': 'Singapore',
      '2025-10-19': 'USA',
      '2025-10-20': 'Mexico',
      '2025-11-09': 'Brazil',
      '2025-11-22': 'Las Vegas',
      '2025-11-30': 'Qatar',
      '2025-12-07': 'Abu Dhabi'
    };
    return raceNames[date] || 'Unknown';
  };

  // Format next race
  const formatNextRace = () => {
    if (!nextRace) return 'No upcoming races scheduled';
    const date = new Date(nextRace);
    const raceName = getRaceName(date.toISOString().split('T')[0]);
    return `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (${raceName})`;
  };

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
      <header className="header">
        <h1>Fashion + F1 Atelier</h1>
      </header>
      <main className="main">
        <section className="section card">
          <h2>Design Racewear</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Design Title (e.g., Monaco Elegance)"
              required
              className="input"
            />
            <div className="preset-buttons">
              {races.map((race) => racePresets[race.date] && (
                <button
                  key={race.date}
                  type="button"
                  onClick={() => applyPreset(race.date)}
                  className="button preset-button"
                >
                  {race.name} Preset
                </button>
              ))}
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
              <option value="Fashion">Fashion</option>
              <option value="F1">F1</option>
            </select>
            <select value={gear} onChange={(e) => setGear(e.target.value)} className="input">
              <option value="Helmet">Helmet</option>
              <option value="Gloves">Gloves</option>
              <option value="Suit">Suit</option>
              <option value="Boots">Boots</option>
              <option value="Visor">Visor</option>
            </select>
            {gear === 'Helmet' && (
              <>
                <select value={helmetShape} onChange={(e) => setHelmetShape(e.target.value)} className="input">
                  {helmetShapeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={decalInputRef}
                  onChange={handleAddDecal}
                  className="file-input"
                  placeholder="Upload Decals"
                />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={sponsorInputRef}
                  onChange={handleAddSponsor}
                  className="file-input"
                  placeholder="Upload Sponsor Logos"
                />
              </>
            )}
            <select value={color} onChange={(e) => setColor(e.target.value)} className="input">
              {colorOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select value={pattern} onChange={(e) => setPattern(e.target.value)} className="input">
              {patternOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select value={designRace} onChange={(e) => setDesignRace(e.target.value)} className="input" required>
              <option value="">Select a race</option>
              {races.map((race) => (
                <option key={race.date} value={race.date}>
                  {race.name} ({new Date(race.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                </option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setImage(e.target.files[0])}
              className="file-input"
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedForAR}
                onChange={(e) => setSelectedForAR(e.target.checked)}
                className="checkbox"
              />
              <span>Select for AR Showcase</span>
            </label>
            <button type="submit" disabled={loading} className="button submit-button">
              {loading ? 'Saving...' : 'Save Design'}
            </button>
          </form>
        </section>

        <section className="section preview-section">
          <div className="card preview-card">
            <h3>2D Design Preview</h3>
            <canvas ref={canvasRef} width="250" height="250" className="canvas"></canvas>
          </div>
          <div className="card preview-card">
            <h3>3D AR Preview</h3>
            <canvas ref={threeRef} className="canvas"></canvas>
          </div>
        </section>

        <section className="section">
          <p className={isRaceWeekend ? 'ar-message available' : 'ar-message unavailable'}>
            {isRaceWeekend
              ? 'AR showcase available! Designs marked for AR are ready for collaborative platforms.'
              : `AR showcase unavailable: not a race weekend. Next race: ${formatNextRace()}`}
          </p>
        </section>

        <section className="section card" ref={designListRef}>
          <h2>Your AR Designs</h2>
          <select value={selectedRace} onChange={handleRaceChange} className="input race-select">
            {races.map((race) => (
              <option key={race.date} value={race.date}>
                {race.name} ({new Date(race.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
              </option>
            ))}
          </select>
          {loading && <p className="loading">Loading designs...</p>}
          {error && (
            <p className="error">
              Error: {error}
              <button onClick={() => setError(null)} className="button error-button">
                Clear
              </button>
            </p>
          )}
          {designs.length === 0 && !loading && !error && (
            <p className="no-designs">No AR designs for this race. Create one above!</p>
          )}
          <ul className="design-list">
            {designs.map((design) => (
              <li key={design.id} className="design-item">
                <img src={renderThumbnail(design.designData)} alt={`${design.title} thumbnail`} className="design-thumbnail" />
                <div className="design-info">
                  <span className="design-title">{design.title}</span>
                  <span className="design-details">
                    ({design.category}, {design.designData.gear}
                    {design.designData.gear === 'Helmet' ? `, Shape: ${design.designData.helmetShape}, Decals: ${design.designData.decals.length}, Sponsors: ${design.designData.sponsors.length}` : ''}, 
                    {colorOptions.find(c => c.value === design.designData.color)?.label || design.designData.color}, 
                    {patternOptions.find(p => p.value === design.designData.pattern)?.label || design.designData.pattern}) 
                    for {getRaceName(design.race)}
                  </span>
                  <span className="design-analysis">
                    Aerodynamics: {design.aiAnalysis.aerodynamics}, 
                    Comfort: {design.aiAnalysis.comfort}, 
                    Grip: {design.aiAnalysis.grip}, 
                    Heat Resistance: {design.aiAnalysis.heatResistance}
                  </span>
                  {design.selectedForAR && <span className="ar-indicator">Selected for AR Showcase</span>}
                </div>
                {isRaceWeekend && design.race === new Date().toISOString().split('T')[0] && (
                  <div className="share-buttons">
                    <button
                      onClick={() => handleShare(design.id, 'F1StyleHub')}
                      className="button share-button"
                    >
                      Share to F1StyleHub
                    </button>
                    <button
                      onClick={() => handleShare(design.id, 'RaceWearX')}
                      className="button share-button"
                    >
                      Share to RaceWearX
                    </button>
                  </div>
                )}
                {sharedPlatforms.some((sp) => sp.designId === design.id) && (
                  <p className="share-status">
                    Shared to: {sharedPlatforms
                      .filter((sp) => sp.designId === design.id)
                      .map((sp) => sp.platform)
                      .join(', ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="button pagination-button"
            >
              Previous
            </button>
            <span>Page {pagination.page} of {pagination.pages}</span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="button pagination-button"
            >
              Next
            </button>
          </div>
        </section>

        <section className="section card">
          <h2>Collaborations</h2>
          <ul className="design-list">
            {collaborations.map((design) => (
              <li key={design.id} className="design-item">
                <span className="design-title">{design.title}</span>
                <span className="design-details">({design.category})</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
