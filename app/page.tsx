"use client";

import archiveManifest from "../data/archive-manifest.json";
import Image from "next/image";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type Project = {
  id: string;
  letter: string;
  title: string;
  category: string;
  year: string;
  mode: "commercial" | "education";
  mediaItems: MediaItem[];
  aspectRatio: number;
  phi: number;
  theta: number;
  thumbnail: string;
  fallbackThumbnail: string;
};

type MediaItem = {
  src: string;
  type: "image" | "video";
};

type ArchiveManifest = Record<"commercial" | "education", Record<string, Record<string, string>>>;

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

const archiveMediaManifest = archiveManifest as ArchiveManifest;

const commercialArchiveSeeds = [
  {
    id: "01",
    title: "RIIZE - FAME",
    files: ["1.mp4", "2.mp4", "3.mp4", "5.mp4", "6.mp4", "7.mp4", "8.mp4"]
  },
  {
    id: "02",
    title: "ADPXIBK-I ONE BANK TVC",
    files: ["IBK_MAIN_30s_Dir.mp4"]
  },
  {
    id: "03",
    title: "ALLDAYPROJECT-CHROM DRIFT",
    files: ["1.mp4", "v1.mp4", "나사1.jpg", "디벨롭.mp4", "시퀀스 01_4.MP4", "아트보드 2.jpg"]
  },
  {
    id: "04",
    title: "ALLLDAYPROJECT-FAMOUS",
    files: ["1.mp4", "2.mp4", "3.mp4", "3p 뮤비작업아카이브_1.mp4", "4.mp4", "5.mp4", "6.mp4", "7.mp4", "guide1.png"]
  },
  {
    id: "05",
    title: "CLOSE YOUR EYES-S.O.B",
    files: ["1.mp4", "2.mp4", "3.mp4", "4.mp4"]
  },
  {
    id: "06",
    title: "CRAVITY-LEMONADE FEVER",
    files: ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4", "7.mp4", "8.mp4"]
  },
  {
    id: "07",
    title: "CRAVITY-LOGO MOTION",
    files: ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.png", "Guide.png"]
  },
  {
    id: "08",
    title: "DAILY DIRECTION-ROOMBADOOMBA",
    files: ["1.mp4", "1_1.mp4", "2.mp4", "3.mp4"]
  },
  {
    id: "09",
    title: "LEESEUNGYOON-POOKZOOKTIME",
    files: ["1.mp4", "1_1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4"]
  },
  {
    id: "10",
    title: "NCT DREAM-BEAT IT UP",
    files: ["1.mp4", "1_1.00_00_04_20.스틸 001.png", "1_1.mp4", "2.mp4", "3.mp4", "4.mp4", "Guide.png"]
  },
  {
    id: "11",
    title: "NCT HAECHAN-CRAZY",
    files: ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4", "이미지0.png"]
  },
  {
    id: "12",
    title: "P1HARMONY-UNIQUE",
    files: ["p1.mp4", "p2-1.mp4", "p2-2.mp4", "p2.mp4", "p4.mp4", "p5.mp4"]
  },
  {
    id: "13",
    title: "SOMI-CLOSER",
    files: ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4", "7.mp4", "Guide.png"]
  },
  {
    id: "14",
    title: "STRAYKIDZ-DIVINE",
    files: ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4", "7.mp4", "Guide.png"]
  },
  {
    id: "15",
    title: "TUNNEX-SET BY US ONLY",
    files: ["1.mp4", "2.mp4", "3.mp4", "4.mp4"]
  },
  {
    id: "16",
    title: "WATERBOMB-WATERFIGHT VISUALS",
    files: ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "Guide.png"]
  },
  {
    id: "17",
    title: "WHIB-ROCK THE NATION",
    files: ["0.mp4", "1-1.mp4", "2-1.mp4", "3-1.mp4", "4-1.mp4"]
  },
  {
    id: "18",
    title: "WOODZ-HUMAN EXTINCTION",
    files: ["1_1.mp4", "33.mp4", "[WOODZ] HUMAN EXTINCTION MV (저용량).mp4", "aaaaa.mp4"]
  }
] as const;

const educationSeeds: ProjectSeed[] = [
  { id: "21", letter: "u", title: "Archive U", category: "Education", year: "2025", mode: "education", mediaItems: [], thumbnail: workImagePath(2), fallbackThumbnail: createThumbnail(21, "#eef1f4", "#d4d9df", "#545d67") },
  { id: "22", letter: "v", title: "Archive V", category: "Education", year: "2026", mode: "education", mediaItems: [], thumbnail: workImagePath(3), fallbackThumbnail: createThumbnail(22, "#f2f4f6", "#d9dde2", "#505863") },
  { id: "23", letter: "w", title: "Archive W", category: "Education", year: "2024", mode: "education", mediaItems: [], thumbnail: workImagePath(4), fallbackThumbnail: createThumbnail(23, "#edf1f5", "#d1d7dd", "#4a535d") },
  { id: "24", letter: "x", title: "Archive X", category: "Education", year: "2025", mode: "education", mediaItems: [], thumbnail: workImagePath(5), fallbackThumbnail: createThumbnail(24, "#f4f6f8", "#dbe0e5", "#55606a") },
  { id: "25", letter: "y", title: "Archive Y", category: "Education", year: "2026", mode: "education", mediaItems: [], thumbnail: workImagePath(6), fallbackThumbnail: createThumbnail(25, "#f0f3f6", "#d8dde2", "#4e5861") }
];

const projectSeeds: ProjectSeed[] = [
  ...commercialArchiveSeeds.map((archive, index) => {
    const mediaItems = archive.files.map((file) => {
      const src = archiveFilePath("commercial", archive.title, file);
      return {
        src,
        type: getMediaType(src)
      };
    });

    return {
      id: archive.id,
      letter: String.fromCharCode(97 + index),
      title: archive.title,
      category: "Commercial",
      year: "",
      mode: "commercial" as const,
      mediaItems,
      thumbnail: mediaItems[0]?.src ?? workImagePath(index + 1),
      fallbackThumbnail: createThumbnail(index + 1, "#20242b", "#3a4657", "#e7edf5")
    };
  }),
  ...educationSeeds
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

function archiveFilePath(section: "commercial" | "education", folder: string, file: string) {
  const blobUrl = archiveMediaManifest[section]?.[folder]?.[file];

  if (blobUrl) {
    return blobUrl;
  }

  return `/archive/${section}/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;
}

function getMediaType(src: string): "image" | "video" {
  return /\.(mp4|webm|ogg|mov)$/i.test(src) ? "video" : "image";
}

function splitProjectTitle(title: string) {
  const dividerIndex = title.indexOf("-");

  if (dividerIndex === -1) {
    return {
      head: title,
      tail: ""
    };
  }

  return {
    head: title.slice(0, dividerIndex).trim(),
    tail: title.slice(dividerIndex + 1).trim()
  };
}

function hintPoint(seed: HintSeed, rotateX: number, rotateY: number) {
  const point = projectPoint(
    {
      id: seed.id,
      letter: "",
      title: "",
      category: "",
      year: "",
      mode: "commercial",
      mediaItems: [],
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

function ThumbnailMedia({
  src,
  fallbackSrc,
  className,
  shouldPlay
}: {
  src: string;
  fallbackSrc: string;
  className: string;
  shouldPlay: boolean;
}) {
  const type = getMediaType(src);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  useEffect(() => {
    if (type !== "video") {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (shouldPlay) {
      const playPromise = video.play();
      playPromise?.catch(() => {});
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [shouldPlay, src, type]);

  if (type === "video") {
    return (
      <video
        ref={videoRef}
        className={className}
        src={src}
        aria-hidden="true"
        muted
        playsInline
        loop={shouldPlay}
        autoPlay={shouldPlay}
        preload={shouldPlay ? "metadata" : "none"}
        poster={fallbackSrc}
      />
    );
  }

  return (
    <img
      className={className}
      src={imageSrc}
      alt=""
      aria-hidden="true"
      draggable={false}
      onError={(event) => {
        const image = event.currentTarget;

        if (image.src === fallbackSrc) {
          return;
        }

        image.src = fallbackSrc;
        setImageSrc(fallbackSrc);
      }}
    />
  );
}

export default function Home() {
  const [activeMode, setActiveMode] = useState<"commercial" | "education">("commercial");
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

  const selectedProjectMedia = selectedProject
    ? selectedProject.mediaItems.length > 0
      ? selectedProject.mediaItems
      : [{ src: selectedProject.thumbnail, type: getMediaType(selectedProject.thumbnail) }]
    : [];

  const selectedProjectPoster = selectedProject
    ? selectedProject.mediaItems.find((media) => media.type === "image")?.src ?? selectedProject.fallbackThumbnail
    : "";

  const selectedTitleParts = selectedProject ? splitProjectTitle(selectedProject.title) : null;

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
                  <span className="work-key">{Number(project.id)}</span>
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
              {globePoints.map((point) => {
                const shouldPlayPreview =
                  hoveredProjectId === point.project.id ||
                  point.project.id === frontmostProjectId ||
                  point.scale > 0.92;

                return (
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
                <ThumbnailMedia
                  className="node-thumb"
                  src={point.project.thumbnail}
                  fallbackSrc={point.project.fallbackThumbnail}
                  shouldPlay={shouldPlayPreview}
                />
                <span className="node-vignette" aria-hidden="true" />
              </span>
            </button>
                );
              })}
            </div>
          </div>

          <aside className="mode-rail" aria-label="Project type mirror">
            <div className="mode-nav mode-nav-right">
              <button
                type="button"
                className={`mode-item ${activeMode === "commercial" ? "is-active" : ""}`}
                onClick={() => setActiveMode("commercial")}
              >
                COMMERCIAL
              </button>
              <button
                type="button"
                className={`mode-item ${activeMode === "education" ? "is-active" : ""}`}
                onClick={() => setActiveMode("education")}
              >
                EDUCATION
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
              <h2 className="lightbox-title">
                <span className="lightbox-title-head">{selectedTitleParts?.head}</span>
                {selectedTitleParts?.tail ? <span className="lightbox-title-divider">-</span> : null}
                {selectedTitleParts?.tail ? <span className="lightbox-title-tail">{selectedTitleParts.tail}</span> : null}
              </h2>
              <span>{selectedProject.category}</span>
            </div>
            <div className="lightbox-media">
              {selectedProjectMedia.map((media, index) => (
                <div
                  key={`${selectedProject.id}-${media.src}`}
                  className={`lightbox-media-item ${index === 0 ? "is-primary" : ""}`}
                >
                  {media.type === "video" ? (
                    <video
                      src={media.src}
                      poster={selectedProjectPoster}
                      controls
                      playsInline
                      muted
                      preload="metadata"
                      className="lightbox-video"
                    />
                  ) : (
                    <img src={media.src} alt="" className="lightbox-image" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
