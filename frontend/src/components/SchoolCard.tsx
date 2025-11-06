import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StarRating from "@/components/StarRating";
import { Info, MapPin } from "lucide-react";



type ChildProps = {
    school: any;
};


function SchoolCard({ school }: ChildProps) {

    const [avgRating, setAvgRating] = useState<number>(0);
    const [numberOfReviews, setNumberOfReviews] = useState<number>(0);

    const getReviews = async () => {
        try {
            const response = await axios.get(`https://smuxchange-backend.vercel.app/database/getReviews/${encodeURIComponent(school['host_university'])}`);
            const reviews = Array.isArray(response.data) ? response.data : [];
            const count = reviews.length;
            const sum = reviews.reduce((acc: number, r: any) => acc + Number(r?.rating || 0), 0);
            setNumberOfReviews(count);
            setAvgRating(count ? sum / count : 0);
        } catch (e) {
            console.log(e);
            setNumberOfReviews(0);
            setAvgRating(0);
        }
    }

    useEffect(() => {
        getReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [school?.host_university]);

    return (
        <>
            <div className="col-lg-4 col-md-6 col-12 mb-4">
                <div className="card h-100 border-0 transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-blue-200">
                    <div className="position-relative">
                        <img src={`/images/university_pictures/${school['host_university']}.jpg`}
                            className="card-img-top" alt={`${school['host_university']}`}
                            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '.5rem' }} />
                        <span
                            className="position-absolute top-0 end-0 m-2 px-3 py-1 rounded-pill shadow-sm"
                            style={{
                                border: '1px solid #bfdbfe', /* blue-200 */
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                color: '#334155', /* slate-700 */
                                fontSize: '0.75rem',
                                lineHeight: '1rem'
                            }}
                        >
                            {school['country']}
                        </span>
                    </div>
                    <div className="card-body d-flex flex-column justify-content-between">
                        <div className="">
                            <h6 className="text-uppercase fw-bold mb-1" style={{ color: "#102b72" }}>{school['host_university']}</h6>
                            <h6 className="fw-muted mb-2" style={{ color: "#102b72", opacity: 0.8 }}>{school['country']}, {school['city']}</h6>
                            <p className="small mb-1" style={{ color: "#334155" }}>
                                {school['description']}
                            </p>
                        </div>
                        <div className="mt-auto">
                            <div className="d-flex justify-content-evenly gap-2">
                                <h6 className="fw-muted small" style={{ color: '#059669' }}>{school['max_gpa'] ? `Max GPA: ${school['max_gpa']}` : 'Max GPA: N/A'}</h6>
                                <h6 className="fw-muted small" style={{ color: '#dc2626' }}>{school['min_gpa'] ? `Min GPA: ${school['min_gpa']}` : 'Min GPA: N/A'}</h6>
                                <h6 className="fw-muted small" style={{ color: '#2563eb' }}>{school['places'] ? `Places: ${school['places']}` : 'Places: N/A'}</h6>
                            </div>
                            <div className="d-flex flex-wrap justify-content-center row">
                                {school['mappable_basket'].length === 0 && (
                                    <span className="badge rounded-pill mb-1 mx-auto d-block w-100 text-truncate" style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>No mappable baskets</span>
                                )}

                                {school['mappable_basket'].slice(0, 3).map(
                                    (basket: any) => (
                                        <span key={basket} className="badge rounded-pill mb-1 mx-auto d-block w-100 text-truncate" style={{ backgroundColor: '#eef2ff', color: '#1e40af', border: '1px solid #c7d2fe' }}>{basket}</span>
                                    )
                                )}
                                {school['mappable_basket'].length > 5 && (
                                    <span className="badge rounded-pill mb-1 mx-auto d-block w-100 text-truncate" style={{ backgroundColor: '#ecfeff', color: '#164e63', border: '1px solid #a5f3fc' }}>+{school['mappable_basket'].length - 3} more</span>
                                )}
                            </div>

                            {/* ⭐ Rating Display */}
                            <div className="d-flex align-items-center justify-content-center mb-2">
                            <StarRating rating={avgRating || 0} />
                            <small className="text-muted ms-2">
                                {numberOfReviews === 0
                                ? "No reviews yet"
                                : `${avgRating.toFixed(1)}/5.0 (${numberOfReviews} review${numberOfReviews === 1 ? "" : "s"})`}
                            </small>
                            </div>
                            <div className="d-flex justify-content-between gap-2">
                                <Link
                                    to={`/mappable/${school['host_university']}/${school['country']}`}
                                    className="btn btn-sm w-100 font-semibold transition-transform hover:scale-105 d-flex align-items-center justify-content-center"
                                    style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none' }}
                                >
                                    <MapPin className="w-4 h-4 me-2" />
                                    Map Now
                                </Link>
                                <Link
                                    to={`/specifics/${encodeURIComponent(school['host_university'])}`}

                                    onClick={() => sessionStorage.setItem("school", JSON.stringify(school))}

                                    className="btn btn-sm w-100 font-semibold transition-transform hover:scale-105 d-flex align-items-center justify-content-center"
                                    style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none' }}
                                >
                                    <Info className="w-4 h-4 me-2" />
                                    More Info
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SchoolCard;
