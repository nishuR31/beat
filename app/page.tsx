import { VisualizerLayout } from "@/components/visualizer-layout";
import HyperspeedBackground from "@/components/HyperspeedBackground";

export default function Page() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <HyperspeedBackground />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <VisualizerLayout />
      </div>
    </div>
  );
}
