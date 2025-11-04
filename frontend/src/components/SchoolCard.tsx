import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StarRating from "@/components/StarRating";



type ChildProps = {
    school: any;
};


function SchoolCard({ school }: ChildProps) {
    const getRandomColor = (number: number) => {
        const basketColor = ['primary bg-gradient', 'success bg-gradient', 'danger bg-gradient', 'warning bg-gradient', 'info bg-gradient', 'secondary bg-gradient'];
        return basketColor[number];
    }

    const [avgRating, setAvgRating] = useState<number>(0);
    const [numberOfReviews, setNumberOfReviews] = useState<number>(0);

    const getReviews = async () => {
        try {
            const response = await axios.get(`http://54.206.13.109:3001/database/getReviews/${encodeURIComponent(school['host_university'])}`);
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
            <div className="col-lg-4 col-md-6 col-12 mb-2">
                <div className="card shadow h-100 border-0">
                    <img src={`/images/university_pictures/${school['host_university']}.jpg`}
                        className="card-img-top" alt={`${school['host_university']}`}
                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '.5rem' }} />
                    <div className="card-body d-flex flex-column justify-content-between">
                        <div className="">
                            <h6 className="text-uppercase fw-bold mb-1">{school['host_university']}</h6>
                            <h6 className="fw-muted mb-2">{school['country']}, {school['city']}</h6>
                            <p className="text-secondary small mb-1">
                                {school['description']}
                            </p>
                        </div>
                        <div className="mt-auto">
                            <div className="d-flex justify-content-evenly gap-2">
                                <h6 className="fw-muted small text-success">{school['max_gpa'] ? `Max GPA: ${school['max_gpa']}` : 'Max GPA: N/A'}</h6>
                                <h6 className="fw-muted small text-danger">{school['min_gpa'] ? `Min GPA: ${school['min_gpa']}` : 'Min GPA: N/A'}</h6>
                                <h6 className="fw-muted small text-primary">{school['places'] ? `Places: ${school['places']}` : 'Places: N/A'}</h6>
                            </div>
                            <div className="d-flex flex-wrap justify-content-center row">
                                {school['mappable_basket'].length === 0 && (
                                    <span className="badge rounded-pill bg-danger mb-1 mx-auto">No mappable baskets</span>
                                )}

                                {school['mappable_basket'].slice(0, 3).map(
                                    (basket: any, counter: number) => (
                                        <span key={basket} className={`badge rounded-pill bg-${getRandomColor(counter)} text-wrap mb-1 mx-auto`}>{basket}</span>
                                    )
                                )}
                                {school['mappable_basket'].length > 5 && (
                                    <span className={`badge rounded-pill bg-${getRandomColor(5)} mb-1 mx-auto`}>+{school['mappable_basket'].length - 3} more</span>
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
                                    className="btn btn-outline-primary btn-sm w-100"
                                >
                                    Try Map
                                </Link>
                                {/* ✅ CHANGE 1: Use <Link> instead of <a> so React Router handles navigation */}
                                <Link
                                    // ✅ CHANGE 2: Dynamic URL with encoded university name
                                    to={`/specifics/${encodeURIComponent(school['host_university'])}`}

                                    // ✅ CHANGE 3: Pass the school object along via state so no re-fetch needed
                                    onClick={() => sessionStorage.setItem("school", JSON.stringify(school))}

                                    className="btn btn-outline-success btn-sm w-100"
                                >
                                    Learn More
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
