function CardSkeleton() {
    return (
      <div className="col-lg-4 col-md-6 col-12 mb-3">
        <div className="card shadow h-100 border-0 rounded-3 overflow-hidden">
          {/* Image placeholder */}
          <div
            className="w-100 bg-light placeholder-glow"
            style={{
              height: '200px',
              borderRadius: '.5rem',
              overflow: 'hidden',
            }}
          >
            <span className="placeholder col-12 h-100 d-block" />
          </div>
  
          {/* Card Body */}
          <div className="card-body d-flex flex-column justify-content-between">
            <div>
              {/* Title */}
              <div className="placeholder-glow mb-2">
                <span className="placeholder col-8" />
              </div>
  
              {/* Country + City */}
              <div className="placeholder-glow mb-3">
                <span className="placeholder col-4 me-2" />
                <span className="placeholder col-3" />
              </div>
  
              {/* Description */}
              <div className="placeholder-glow mb-3">
                <span className="placeholder col-12 d-block mb-1" />
                <span className="placeholder col-10 d-block mb-1" />
                <span className="placeholder col-8 d-block" />
              </div>
            </div>
  
            {/* Footer Section */}
            <div className="mt-auto">
              {/* GPA / Places row */}
              <div className="placeholder-glow d-flex justify-content-evenly gap-2 mb-3">
                <span className="placeholder col-3" />
                <span className="placeholder col-3" />
                <span className="placeholder col-3" />
              </div>
  
              {/* Baskets (stacked rounded pills) */}
              <div className="d-flex flex-column align-items-center mb-3">
                {[320, 320, 320, 320].map((w, i) => (
                  <span
                    key={i}
                    className="bg-secondary opacity-25 rounded-pill mb-2"
                    style={{ height: 19, minWidth: w }}
                  />
                ))}
              </div>
  
              {/* Rating + Reviews */}
              <div className="placeholder-glow mb-3 text-center">
                <span className="placeholder col-4 me-2" />
                <span className="placeholder col-2" />
              </div>
  
              {/* Buttons */}
              <div className="d-flex justify-content-between gap-2">
                <span
                  className="btn btn-outline-primary btn-sm disabled placeholder-glow w-100"
                  style={{ height: 32 }}
                />
                <span
                  className="btn btn-outline-success btn-sm disabled placeholder-glow w-100"
                  style={{ height: 32 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default CardSkeleton;
  