import axios from 'axios';
import SchoolCard from '../components/SchoolCard';
import { useEffect, useState } from 'react';



function Information2() {

    const [schools, setSchools] = useState<string[]>([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [country, setCountry] = useState<string>('');

    const [courseAreas, setCourseAreas] = useState<string[]>([]);
    const [courseArea, setCourseArea] = useState<string>('');


    const getAllSchools = async () => {
        const response = await axios.get('http://localhost:3001/database/getAllExchangeSchools');
        const schools = response.data;
        const uniqueCountries = [...new Set(schools.map((school: any) => school.country))] as string[];
        setCountries(uniqueCountries.sort());
        setSchools(schools.sort((a: any, b: any) => b['mappable_basket'].length - a['mappable_basket'].length));
    }

    const getSchoolsByCountry = async (country: string) => {
        const response = await axios.get(`http://localhost:3001/database/getAllExchangeSchoolsByCountry/${country}`);
        setSchools(response.data.sort((a: any, b: any) => b['mappable_basket'].length - a['mappable_basket'].length));
    }

    const getAllCourseAreas = async () => {
        const response = await axios.get('http://localhost:3001/database/getAllExchangeSchools');
        const schools = response.data;
        console.log(schools);
    }

    useEffect(() => {
        getAllSchools();
        getAllCourseAreas();
    }, []);


    useEffect(() => {
        if (country !== '') {
            getSchoolsByCountry(country);
        } else {
            getAllSchools();
        }
    }, [country]);

    return (
        <>
            <div className="container mx-auto mt-5 mb-1 bg-light text-center">
                <h1>Schools</h1>
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-12 mb-2">
                        <p className="text-start mb-1 ml-1">Select Country</p>
                        <select className="form-select" onChange={(e) => setCountry(e.target.value)}>
                            <option selected value="">Choose a country...</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-lg-6 col-12 mb-2">
                        <p className="text-start mb-1 ml-1">Select City</p>
                        <select className="form-select" onChange={(e) => setCourseArea(e.target.value)}>
                            <option selected value="">Choose a course area...</option>
                            {courseAreas.map((courseArea) => (
                                <option key={courseArea} value={courseArea}>{courseArea}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="container mx-auto mt-5 mb-1 text-center">
                <div className="row justify-content-center">
                    {schools.map((school: any) => (
                        <SchoolCard key={school['host_university']} school={school} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Information2;