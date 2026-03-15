"use client";

import Image from "next/image";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type Project = {
  id: string;
  letter: string;
  title: string;
  category: string;
  year: string;
  mode: "music-video" | "tvc";
  aspectRatio: number;
  phi: number;
  theta: number;
  thumbnail: string;
  fallbackThumbnail: string;
};

type GlobePoint = {
  project: Project;
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
};

type HintSeed = {
  id: string;
  phi: number;
  theta: number;
};

type ProjectSeed = Omit<Project, "phi" | "theta" | "aspectRatio">;

const projectSeeds: ProjectSeed[] = [
  { id: "01", letter: "a", title: "Archive A", category: "Brand Film", year: "2025", mode: "music-video", thumbnail: workImagePath(1), fallbackThumbnail: createThumbnail(1, "#e7eef6", "#8ea3bd", "#32465e") },
  { id: "02", letter: "b", title: "Archive B", category: "Campaign", year: "2024", mode: "music-video", thumbnail: workImagePath(2), fallbackThumbnail: createThumbnail(2, "#e8edf5", "#a5b5ca", "#41506a") },
  { id: "03", letter: "c", title: "Archive C", category: "Motion Identity", year: "2025", mode: "music-video", thumbnail: workImagePath(3), fallbackThumbnail: createThumbnail(3, "#eef2f7", "#95a8c2", "#2f435d") },
  { id: "04", letter: "d", title: "Archive D", category: "Installation", year: "2023", mode: "music-video", thumbnail: workImagePath(4), fallbackThumbnail: createThumbnail(4, "#e3ebf4", "#aab8ca", "#43516a") },
  { id: "05", letter: "e", title: "Archive E", category: "Interactive Film", year: "2026", mode: "music-video", thumbnail: workImagePath(5), fallbackThumbnail: createThumbnail(5, "#ecf1f6", "#8fa5bf", "#324962") },
  { id: "06", letter: "f", title: "Archive F", category: "Visual System", year: "2024", mode: "music-video", thumbnail: workImagePath(6), fallbackThumbnail: createThumbnail(6, "#e6edf5", "#9fb0c6", "#40516a") },
  { id: "07", letter: "g", title: "Archive G", category: "Spatial Visual", year: "2025", mode: "music-video", thumbnail: workImagePath(7), fallbackThumbnail: createThumbnail(7, "#eef3f8", "#92a4bc", "#31445d") },
  { id: "08", letter: "h", title: "Archive H", category: "Direction", year: "2023", mode: "music-video", thumbnail: workImagePath(1), fallbackThumbnail: createThumbnail(8, "#e5ecf4", "#abb8ca", "#435068") },
  { id: "09", letter: "i", title: "Archive I", category: "Short Form", year: "2026", mode: "music-video", thumbnail: workImagePath(2), fallbackThumbnail: createThumbnail(9, "#e9eef5", "#9caec4", "#364860") },
  { id: "10", letter: "j", title: "Archive J", category: "Sound Motion", year: "2024", mode: "music-video", thumbnail: workImagePath(3), fallbackThumbnail: createThumbnail(10, "#edf2f7", "#93a6bf", "#31465d") },
  { id: "11", letter: "k", title: "Archive K", category: "Graphic System", year: "2025", mode: "tvc", thumbnail: workImagePath(4), fallbackThumbnail: createThumbnail(11, "#20242b", "#3a4657", "#e7edf5") },
  { id: "12", letter: "l", title: "Archive L", category: "Editorial Motion", year: "2024", mode: "tvc", thumbnail: workImagePath(5), fallbackThumbnail: createThumbnail(12, "#1d2129", "#465263", "#eef4fb") },
  { id: "13", letter: "m", title: "Archive M", category: "Launch Visual", year: "2026", mode: "tvc", thumbnail: workImagePath(6), fallbackThumbnail: createThumbnail(13, "#21262e", "#4c596b", "#eff4fa") },
  { id: "14", letter: "n", title: "Archive N", category: "Brand Motion", year: "2025", mode: "tvc", thumbnail: workImagePath(7), fallbackThumbnail: createThumbnail(14, "#1f242c", "#455266", "#edf3fb") },
  { id: "15", letter: "o", title: "Archive O", category: "Film Title", year: "2023", mode: "tvc", thumbnail: workImagePath(1), fallbackThumbnail: createThumbnail(15, "#1c2027", "#3b4758", "#ecf2f9") },
  { id: "16", letter: "p", title: "Archive P", category: "Screen Visual", year: "2025", mode: "tvc", thumbnail: workImagePath(2), fallbackThumbnail: createThumbnail(16, "#21252d", "#4a5666", "#eef4fb") },
  { id: "17", letter: "q", title: "Archive Q", category: "Spatial Media", year: "2026", mode: "tvc", thumbnail: workImagePath(3), fallbackThumbnail: createThumbnail(17, "#1d2129", "#455162", "#e8eef6") },
  { id: "18", letter: "r", title: "Archive R", category: "Identity Film", year: "2024", mode: "tvc", thumbnail: workImagePath(4), fallbackThumbnail: createThumbnail(18, "#20242c", "#404d5d", "#eff4fa") },
  { id: "19", letter: "s", title: "Archive S", category: "Visual Direction", year: "2025", mode: "tvc", thumbnail: workImagePath(5), fallbackThumbnail: createThumbnail(19, "#1f232a", "#4c5869", "#eef3fb") },
  { id: "20", letter: "t", title: "Archive T", category: "Experimental Motion", year: "2026", mode: "tvc", thumbnail: workImagePath(6), fallbackThumbnail: createThumbnail(20, "#1c2027", "#3d4857", "#ecf2f8") }
];

const AUTO_ROTATE_Y = 0.0025;
const GLOBE_RADIUS = 280;
const INITIAL_ROTATION = { x: -0.28, y: 0.52 };
const SMOOTHING = 0.08;
const LIST_LOOP_COPIES = 3;
const hintSeeds: HintSeed[] = [
  { id: "h01", phi: 0.34, theta: 0.36 },
  { id: "h02", phi: 0.52, theta: 1.02 },
  { id: "h03", phi: 0.78, theta: 1.64 },
  { id: "h04", phi: 0.94, theta: 2.18 },
  { id: "h05", phi: 1.12, theta: 2.76 },
  { id: "h06", phi: 1.28, theta: 3.24 },
  { id: "h07", phi: 1.46, theta: 3.82 },
  { id: "h08", phi: 1.66, theta: 4.44 },
  { id: "h09", phi: 1.86, theta: 5.04 },
  { id: "h10", phi: 2.04, theta: 5.58 },
  { id: "h11", phi: 2.18, theta: 0.72 },
  { id: "h12", phi: 2.36, theta: 1.26 },
  { id: "h13", phi: 2.54, theta: 1.9 },
  { id: "h14", phi: 2.68, theta: 2.54 },
  { id: "h15", phi: 2.84, theta: 3.12 },
  { id: "h16", phi: 0.62, theta: 4.88 },
  { id: "h17", phi: 0.88, theta: 5.42 },
  { id: "h18", phi: 1.18, theta: 6.02 }
];

function createThumbnail(seed: number, base: string, accent: string, ink: string): string {
  const offsetA = 54 + (seed * 13) % 90;
  const offsetB = 168 + (seed * 11) % 80;
  const bandY = 120 + (seed * 17) % 84;
  const bandTilt = 24 + (seed * 7) % 36;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
      <defs>
        <radialGradient id="wash" cx="36%" cy="28%" r="78%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="52%" stop-color="${base}" />
          <stop offset="100%" stop-color="${accent}" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <rect width="320" height="320" fill="url(#wash)" />
      <circle cx="${offsetA}" cy="98" r="76" fill="${accent}" opacity="0.72" filter="url(#blur)" />
      <circle cx="${offsetB}" cy="214" r="72" fill="#ffffff" opacity="0.96" filter="url(#blur)" />
      <rect x="-32" y="${bandY}" width="384" height="46" rx="23" fill="${ink}" fill-opacity="0.14" transform="rotate(${bandTilt} 160 160)" />
      <path d="M36 ${220 - seed}C88 ${174 - seed} 150 ${148 + seed} 206 ${116 + seed}C236 ${98 + seed} 264 ${84 + seed} 296 ${74 + seed}" stroke="${ink}" stroke-opacity="0.16" stroke-width="12" stroke-linecap="round" />
      <circle cx="${88 + (seed * 5) % 120}" cy="${84 + (seed * 9) % 120}" r="18" fill="${ink}" fill-opacity="0.12" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function workImagePath(seed: number) {
  const imageIndex = ((seed - 1) % 7) + 1;
  return `/works/oloids-${String(imageIndex).padStart(2, "0")}.png`;
}

function hintPoint(seed: HintSeed, rotateX: number, rotateY: number) {
  const point = projectPoint(
    {
      id: seed.id,
      letter: "",
      title: "",
      category: "",
      year: "",
      mode: "music-video",
      aspectRatio: 1,
      phi: seed.phi,
      theta: seed.theta,
      thumbnail: "",
      fallbackThumbnail: ""
    },
    rotateX,
    rotateY
  );

  return point;
}

function normalizeAngleNear(target: number, reference: number) {
  let next = target;

  while (next - reference > Math.PI) {
    next -= Math.PI * 2;
  }

  while (next - reference < -Math.PI) {
    next += Math.PI * 2;
  }

  return next;
}

function focusRotation(project: Project, currentY: number) {
  return {
    x: Math.max(-1.18, Math.min(1.18, Math.PI / 2 - project.phi)),
    y: normalizeAngleNear(Math.PI / 2 - project.theta, currentY)
  };
}

function projectPoint(project: Project, rotateX: number, rotateY: number): GlobePoint {
  const sinPhi = Math.sin(project.phi);
  const baseX = GLOBE_RADIUS * sinPhi * Math.cos(project.theta);
  const baseY = GLOBE_RADIUS * Math.cos(project.phi);
  const baseZ = GLOBE_RADIUS * sinPhi * Math.sin(project.theta);

  const cosY = Math.cos(rotateY);
  const sinY = Math.sin(rotateY);
  const x1 = baseX * cosY - baseZ * sinY;
  const z1 = baseX * sinY + baseZ * cosY;

  const cosX = Math.cos(rotateX);
  const sinX = Math.sin(rotateX);
  const y2 = baseY * cosX - z1 * sinX;
  const z2 = baseY * sinX + z1 * cosX;

  const depth = (z2 + GLOBE_RADIUS) / (GLOBE_RADIUS * 2);

  return {
    project,
    x: x1,
    y: y2,
    z: z2,
    scale: 0.14 + Math.pow(depth, 1.7) * 1.28,
    opacity: 0.28 + Math.pow(depth, 1.08) * 0.72
  };
}

export default function Home() {
  const [activeMode, setActiveMode] = useState<"music-video" | "tvc">("music-video");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [rotation, setRotation] = useState(INITIAL_ROTATION);
  const [isDragging, setIsDragging] = useState(false);
  const workListRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef(INITIAL_ROTATION);
  const targetRotationRef = useRef(INITIAL_ROTATION);
  const hoveredProjectIdRef = useRef<string | null>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startRotateX: 0,
    startRotateY: 0
  });

  useEffect(() => {
    hoveredProjectIdRef.current = hoveredProjectId;
  }, [hoveredProjectId]);

  useEffect(() => {
    setHoveredProjectId(null);
    setSelectedProject(null);
  }, [activeMode]);

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      if (!dragRef.current.active) {
        targetRotationRef.current = {
          x: targetRotationRef.current.x,
          y:
            targetRotationRef.current.y +
            AUTO_ROTATE_Y * (hoveredProjectIdRef.current ? 0.26 : 1)
        };
      }

      const nextRotation = {
        x: rotationRef.current.x + (targetRotationRef.current.x - rotationRef.current.x) * SMOOTHING,
        y: rotationRef.current.y + (targetRotationRef.current.y - rotationRef.current.y) * SMOOTHING
      };

      rotationRef.current = nextRotation;
      setRotation(nextRotation);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedProject]);

  useEffect(() => {
    const list = workListRef.current;

    if (!list) {
      return undefined;
    }

    const segmentHeight = list.scrollHeight / LIST_LOOP_COPIES;
    list.scrollTop = segmentHeight;

    const handleScroll = () => {
      const nextSegmentHeight = list.scrollHeight / LIST_LOOP_COPIES;

      if (list.scrollTop < nextSegmentHeight * 0.35) {
        list.scrollTop += nextSegmentHeight;
      } else if (list.scrollTop > nextSegmentHeight * 1.65) {
        list.scrollTop -= nextSegmentHeight;
      }
    };

    list.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      list.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isDragging) {
      return undefined;
    }

    const handleWindowPointerMove = (event: PointerEvent) => {
      if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - dragRef.current.startX;
      const deltaY = event.clientY - dragRef.current.startY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        dragRef.current.moved = true;
      }

      targetRotationRef.current = {
        x: Math.max(-0.9, Math.min(0.9, dragRef.current.startRotateX + deltaY * 0.005)),
        y: dragRef.current.startRotateY + deltaX * 0.006
      };
    };

    const stopDragging = (event: PointerEvent) => {
      if (dragRef.current.pointerId !== event.pointerId) {
        return;
      }

      dragRef.current.active = false;
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, [isDragging]);

  const visibleProjects = useMemo(() => {
    const scopedProjects = projectSeeds.filter((project) => project.mode === activeMode);

    return scopedProjects.map((project, index, list) => {
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const normalized = (index + 0.5) / list.length;
      const y = 1 - normalized * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = (index * goldenAngle + 0.45) % (Math.PI * 2);
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const phi = Math.acos(Math.max(-1, Math.min(1, y)));
      const azimuth = Math.atan2(z, x);

      return {
        ...project,
        aspectRatio: index % 5 === 1 || index % 5 === 4 ? 3 / 4 : 4 / 3,
        phi,
        theta: azimuth
      };
    });
  }, [activeMode]);

  const globePoints = useMemo(
    () => {
      return visibleProjects
        .map((project) => projectPoint(project, rotation.x, rotation.y))
        .map((point) => {
          const distanceFromCenter = Math.hypot(point.x, point.y);
          const isFrontHemisphere = point.z > 0;
          const centerBias = Math.exp(-Math.pow(distanceFromCenter / 170, 2));
          const radialPush = isFrontHemisphere ? 1 + centerBias * 0.26 : 1;

          return {
            ...point,
            x: point.x * radialPush,
            y: point.y * radialPush
          };
        })
        .sort((a, b) => a.z - b.z);
    },
    [rotation.x, rotation.y, visibleProjects]
  );

  const globeLinks = useMemo(() => {
    const pointById = new Map(globePoints.map((point) => [point.project.id, point]));

    return visibleProjects.slice(0, -1).flatMap((project, index) => {
      const from = pointById.get(project.id);
      const to = pointById.get(visibleProjects[index + 1].id);

      if (!from || !to) {
        return [];
      }

      const dx = to.x - from.x;
      const dy = to.y - from.y;

      return [
        {
          id: `${from.project.id}-${to.project.id}`,
          x: from.x,
          y: from.y,
          length: Math.hypot(dx, dy),
          angle: Math.atan2(dy, dx)
        }
      ];
    });
  }, [globePoints, visibleProjects]);

  const frontmostProjectId = useMemo(() => {
    return globePoints.reduce<string | null>((closestId, point) => {
      if (!closestId) {
        return point.project.id;
      }

      const currentFrontmost = globePoints.find((candidate) => candidate.project.id === closestId);

      if (!currentFrontmost || point.z > currentFrontmost.z) {
        return point.project.id;
      }

      return closestId;
    }, null);
  }, [globePoints]);

  const loopedProjects = useMemo(
    () =>
      Array.from({ length: LIST_LOOP_COPIES }, (_, copyIndex) =>
        visibleProjects.map((project) => ({
          copyIndex,
          project
        }))
      ).flat(),
    [visibleProjects]
  );

  const hintPoints = useMemo(
    () =>
      hintSeeds
        .map((seed) => hintPoint(seed, INITIAL_ROTATION.x - 0.2, INITIAL_ROTATION.y + 0.34))
        .filter((point) => point.z < 0)
        .sort((a, b) => a.z - b.z),
    []
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRotateX: targetRotationRef.current.x,
      startRotateY: targetRotationRef.current.y
    };

    setIsDragging(true);
  };

  const handleProjectHover = (project: Project) => {
    setHoveredProjectId(project.id);
    targetRotationRef.current = focusRotation(project, targetRotationRef.current.y);
  };

  const clearProjectHover = () => {
    if (dragRef.current.active) {
      return;
    }
    setHoveredProjectId(null);
  };

  return (
    <main className={`page-shell theme-${activeMode}`}>
      <div className="ambient-wash" aria-hidden="true" />

      <section className="stage">
        <div className="stage-layout">
          <aside className="work-list" aria-label="Project index" onPointerLeave={clearProjectHover}>
            <div ref={workListRef} className="work-list-inner">
              {loopedProjects.map(({ copyIndex, project }) => (
                <button
                  key={`${copyIndex}-${project.id}`}
                  type="button"
                  className={`work-item ${hoveredProjectId === project.id ? "is-active" : ""}`}
                  onPointerEnter={() => handleProjectHover(project)}
                  onPointerLeave={clearProjectHover}
                  onFocus={() => handleProjectHover(project)}
                  onBlur={clearProjectHover}
                  onClick={() => setSelectedProject(project)}
                >
                  <span className="work-key">{project.letter}</span>
                  <span className="work-title">{project.title}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="stage-visual">
            <div className="center-mark" aria-label="oloids logo">
              <div className="logo-frame">
                <Image
                  src="/oloids-logo.png"
                  alt="oloids logo"
                  fill
                  priority
                  sizes="(max-width: 640px) 120px, 160px"
                />
              </div>
            </div>

            <div
              className={`globe-scene ${isDragging ? "is-dragging" : ""}`}
              onPointerDownCapture={handlePointerDown}
              onPointerLeave={clearProjectHover}
              role="presentation"
            >
              <div className="globe-guide" aria-hidden="true" />
              <div className="globe-links" aria-hidden="true">
                {globeLinks.map((link) => (
                  <span
                    key={link.id}
                    className="globe-link"
                    style={
                      {
                        "--link-x": `${link.x.toFixed(2)}px`,
                        "--link-y": `${link.y.toFixed(2)}px`,
                        "--link-length": `${link.length.toFixed(2)}px`,
                        "--link-angle": `${link.angle.toFixed(4)}rad`
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
              <div className="globe-hints" aria-hidden="true">
                {hintPoints.map((point) => (
                  <span
                    key={`hint-${point.project.id}`}
                    className="globe-hint"
                    style={
                      {
                        "--hint-x": `${point.x.toFixed(2)}px`,
                        "--hint-y": `${point.y.toFixed(2)}px`,
                        "--hint-scale": (0.16 + ((point.z + GLOBE_RADIUS) / (GLOBE_RADIUS * 2)) * 0.48).toFixed(3),
                        "--hint-opacity": (0.04 + ((point.z + GLOBE_RADIUS) / (GLOBE_RADIUS * 2)) * 0.12).toFixed(3),
                        "--hint-size": `${(18 + point.scale * 16).toFixed(2)}px`,
                        "--hint-blur": `${(3.6 - ((point.z + GLOBE_RADIUS) / (GLOBE_RADIUS * 2)) * 2.2).toFixed(2)}px`
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
              {globePoints.map((point) => (
                <button
                  key={point.project.id}
                  type="button"
                  className={`globe-node ${point.z < 0 ? "is-rear" : "is-front"} ${hoveredProjectId === point.project.id ? "is-active" : ""}`}
                  aria-label={point.project.title}
                  data-depth={point.z < 0 ? "rear" : "front"}
                  style={
                    {
                      "--node-x": `${point.x.toFixed(2)}px`,
                      "--node-y": `${point.y.toFixed(2)}px`,
                      "--node-scale": point.scale.toFixed(3),
                      "--node-opacity": point.opacity.toFixed(3),
                      "--node-width": `${(38 + point.scale * 64).toFixed(2)}px`,
                      "--node-height": `${((38 + point.scale * 64) / point.project.aspectRatio).toFixed(2)}px`,
                      "--node-blur": `${point.project.id === frontmostProjectId ? 0 : Math.max(0, 3.8 - point.scale * 2.4).toFixed(2)}px`,
                      "--node-saturation": `${Math.max(0.22, 0.3 + point.scale * 0.62).toFixed(3)}`
                    } as CSSProperties
                  }
                  onClick={() => {
                    if (dragRef.current.moved) {
                      dragRef.current.moved = false;
                      return;
                    }
                    setSelectedProject(point.project);
                  }}
                  onPointerEnter={() => handleProjectHover(point.project)}
                  onPointerLeave={clearProjectHover}
                  onFocus={() => handleProjectHover(point.project)}
                  onBlur={clearProjectHover}
                >
              <span className="node-surface">
                <img
                  className="node-thumb"
                  src={point.project.thumbnail}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  onError={(event) => {
                    const image = event.currentTarget;
                    if (image.src === point.project.fallbackThumbnail) {
                      return;
                    }
                    image.src = point.project.fallbackThumbnail;
                  }}
                />
                <span className="node-vignette" aria-hidden="true" />
              </span>
            </button>
              ))}
            </div>
          </div>

          <aside className="mode-rail" aria-label="Project type mirror">
            <div className="mode-nav mode-nav-right">
              <button
                type="button"
                className={`mode-item ${activeMode === "music-video" ? "is-active" : ""}`}
                onClick={() => setActiveMode("music-video")}
              >
                MV
              </button>
              <button
                type="button"
                className={`mode-item ${activeMode === "tvc" ? "is-active" : ""}`}
                onClick={() => setActiveMode("tvc")}
              >
                TVC
              </button>
            </div>
          </aside>
        </div>

        <footer className="site-meta" aria-label="Studio information">
          <a className="site-meta-link" href="mailto:info@oloidstudio.com">
            info@oloidstudio.com
          </a>
          <a className="site-meta-link site-meta-center" href="https://www.instagram.com/oloids" target="_blank" rel="noreferrer">
            instagram
          </a>
          <div className="site-meta-right">
            <span>ALL RIGHTS RESERVED Ⓒoloids</span>
          </div>
        </footer>
      </section>

      {selectedProject ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProject.title} preview`}
          onClick={() => setSelectedProject(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="Close preview"
            onClick={() => setSelectedProject(null)}
          >
            close
          </button>
          <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <div className="lightbox-copy">
              <p>{selectedProject.year}</p>
              <h2>{selectedProject.title}</h2>
              <span>{selectedProject.category}</span>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
