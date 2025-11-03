import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Trash2Icon } from "lucide-react";

export default function Admin() {


    const [reviews, setReviews] = useState([]);
    const [schools, setSchools] = useState([]);
    const calledRef = useRef(false);

    const deleteReview = async (uid: string, school: string) => {
        try {
            await axios.delete(`http://54.206.13.109:3001/database/deleteReview/${uid}/${school}`);
            setReviews((prev: any) => prev.filter((r: any) => !(r.uid === uid && r.school === school)));
        } catch (error) {
            console.log(error);
        }
    };

    const getSchoolsWithReviews = async () => {
        try {
            const response = await axios.post('http://54.206.13.109:3001/database/getSchoolsWithReviews');
            setSchools(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;
        getSchoolsWithReviews();
    }, []);

    useEffect(() => {
        schools.forEach(async (school: string) => {
            const response = await axios.get(`http://54.206.13.109:3001/database/getReviews/${school}`);
            const enriched = (Array.isArray(response.data) ? response.data : []).map((r: any) => ({ ...r, school }));
            setReviews(prevReviews => [...prevReviews, ...enriched] as any);
        });
    }, [schools]);

    useEffect(() => {
        console.log(reviews);
    }, [reviews]);

    return (
        <div className="min-h-screen flex flex-col p-6 md:p-10"
            style={{
                backgroundColor: "#eeeeee",
                color: "#102b72",
            }}
        >
            {/* === Subtle gradient + grid overlay === */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(16,43,114,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            <table className="table">
                <thead className="table-dark">
                    <tr>
                        <th>School</th>
                        <th>Name</th>
                        <th>Reviews</th>
                        <th>Comments</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review: any, index: number) => (
                        <tr key={index}>
                            <td>{review.school}</td>
                            <td>{review.name}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
                            <td>
                                <button className="btn btn-sm btn-danger hover:cursor-pointer"
                                    onClick={() => deleteReview(review.uid, review.school)}
                                ><Trash2Icon className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}