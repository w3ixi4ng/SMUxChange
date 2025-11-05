import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Trash2Icon } from "lucide-react";

export default function Admin() {


    const [reviews, setReviews] = useState([]);
    const [schools, setSchools] = useState([]);
    const calledRef = useRef(false);

    const deleteReview = async (uid: string, school: string) => {
        try {
            await axios.delete(`https://smuxchange-backend.vercel.app/database/deleteReview/${uid}/${school}`);
            setReviews((prev: any) => prev.filter((r: any) => !(r.uid === uid && r.school === school)));
        } catch (error) {
            console.log(error);
        }
    };

    const getSchoolsWithReviews = async () => {
        try {
            const response = await axios.post('https://smuxchange-backend.vercel.app/database/getSchoolsWithReviews');
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
            const response = await axios.get(`https://smuxchange-backend.vercel.app/database/getReviews/${school}`);
            const enriched = (Array.isArray(response.data) ? response.data : []).map((r: any) => ({ ...r, school }));
            setReviews(prevReviews => [...prevReviews, ...enriched] as any);
        });
    }, [schools]);

    useEffect(() => {
        console.log(reviews);
    }, [reviews]);

    return (
        <div className="flex flex-col p-6 md:p-10  relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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