
import "./Hyperspeed.css";

function Hyperspeed({ effectOptions }:any) {
  // TODO: Insert the full Hyperspeed implementation here.
  // Only render the effect container, no placeholder text.
  return (
    <div
      id="lights"
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

export default Hyperspeed;
