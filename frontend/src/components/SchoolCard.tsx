import { Link } from "react-router-dom";

type ChildProps = {
    school: any;
};


function SchoolCard({ school }: ChildProps) {
    const getRandomColor = (number: number) => {
        const basketColor = ['primary bg-gradient', 'success bg-gradient', 'danger bg-gradient', 'warning bg-gradient', 'info bg-gradient', 'secondary bg-gradient'];
        return basketColor[number];
    }
    const randomNumber = Math.floor(Math.random() * (school['mappable_basket'].length - 3));

    return (
        <>
            <div className="col-lg-4 col-md-6 col-12 mb-2">
                <div className="card shadow h-100 border-0">
                    <img src="https://placehold.co/600x400"
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

                                {school['mappable_basket'].slice(randomNumber, randomNumber + 3).map(
                                    (basket: any, counter: number) => (
                                        <span key={basket} className={`badge rounded-pill bg-${getRandomColor(counter)} text-wrap mb-1 mx-auto`}>{basket}</span>
                                    )
                                )}
                                {school['mappable_basket'].length > 5 && (
                                    <span className={`badge rounded-pill bg-${getRandomColor(5)} mb-1 mx-auto`}>+{school['mappable_basket'].length - 3} more</span>
                                )}
                            </div>

                            <p className="mb-2">
                                <span className="rating text-warning">★★★★★</span>
                                <small className="text-muted">(110 reviews)</small>
                            </p>
                            <div className="d-flex justify-content-between gap-2">
                                <Link
                                    to={`/mappablev3/${school['host_university']}/${school['country']}`}
                                    className="btn btn-outline-primary btn-sm w-100"
                                >
                                    Try Map
                                </Link>
                                <a href="#" className="btn btn-outline-success btn-sm w-100">Learn More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SchoolCard;