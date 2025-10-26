import MapSearch from "../components/MapSearch";

function Mappable() {
  return (
    //  Main wrapper: switched to full-screen black backdrop, matches Home.tsx theme
    <div
      className="relative min-h-screen flex flex-col items-center justify-start text-white overflow-hidden"
      style={{
        backgroundColor: "#0a0a0a", // 📝 Deep black background
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 25%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.04) 0%, transparent 30%)",
      }}
    >

      {/*  Keeps MapSearch above the animated background */}
      <div className="relative z-10 w-full">
        <MapSearch />
      </div>
    </div>
  );
}

export default Mappable;''