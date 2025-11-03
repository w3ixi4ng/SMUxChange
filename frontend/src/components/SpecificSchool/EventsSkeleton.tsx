// components/EventsSkeleton.tsx
function EventsSkeleton({ count = 4 }: { count?: number }) {
    return (
      <div>
        <div className="d-flex overflow-auto gap-3 pb-3">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#102b72]/20 rounded-xl w-72 shrink-0"
            >
              <span
                className="placeholder d-block w-100"
                style={{ height: 160, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
              />
              <div className="p-3">
                <div className="placeholder-glow mb-2">
                  <span className="placeholder col-8 d-block" style={{ height: 18 }} />
                </div>
                <div className="placeholder-glow mb-2">
                  <span className="placeholder col-5 d-block" style={{ height: 14 }} />
                </div>
                <div className="placeholder-glow mb-2">
                  <span className="placeholder col-10 d-block" style={{ height: 14 }} />
                </div>
                <div className="placeholder-glow mb-3">
                  <span className="placeholder col-9 d-block" style={{ height: 14 }} />
                </div>
                <button className="btn btn-primary disabled placeholder-glow w-100" style={{ height: 32 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default EventsSkeleton;