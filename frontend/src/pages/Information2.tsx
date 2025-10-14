import axios from 'axios';
import SchoolCard from '../components/SchoolCard';
import { useEffect, useState } from 'react';



function Information2() {

    const [schools, setSchools] = useState<string[]>([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [country, setCountry] = useState<string>('');

    const [courseAreas, setCourseAreas] = useState<string[]>([]);
    const [courseArea, setCourseArea] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(true);


    const getAllSchools = async () => {
        const response = await axios.get('http://localhost:3001/database/getAllExchangeSchools');
        const schools = response.data;
        const uniqueCountries = [...new Set(schools.map((school: any) => school.country))] as string[];
        setCountries(uniqueCountries.sort());
        setSchools(schools.sort((a: any, b: any) => b['mappable_basket'].length - a['mappable_basket'].length));
        setIsLoading(false);
    }

    const getSchoolsByCountry = async (country: string) => {
        const response = await axios.get(`http://localhost:3001/database/getAllExchangeSchoolsByCountry/${country}`);
        setSchools(response.data.sort((a: any, b: any) => b['mappable_basket'].length - a['mappable_basket'].length));
    }

    const getAllCourseAreas = async () => {
        const response = await axios.get('http://localhost:3001/database/getAllCourseAreas');
        const courseAreas = response.data;
        setCourseAreas(Object.keys(courseAreas[0]));
    }

    const getSchoolsByCourseArea = async (courseArea: string) => {
        const response = await axios.get(`http://localhost:3001/database/getAllExchangeSchools/`);
        const schools = response.data;
        const schoolsByCourseArea = schools.filter((school: any) => school['mappable_basket'].includes(courseArea));
        setSchools(schoolsByCourseArea.sort((a: any, b: any) => b['mappable_basket'].length - a['mappable_basket'].length));
    }

    const getSchoolsByCourseAreaAndCountry = async (courseArea: string, country: string) => {
        const response = await axios.get(`http://localhost:3001/database/getAllExchangeSchoolsByCountry/${country}`);
        const schools = response.data;
        const schoolsByCourseArea = schools.filter((school: any) => school['mappable_basket'].includes(courseArea));
        setSchools(schoolsByCourseArea.sort((a: any, b: any) => b['mappable_basket'].length - a['mappable_basket'].length));
    }

    useEffect(() => {
        getAllSchools();
        getAllCourseAreas();
    }, []);


    useEffect(() => {
        if (courseArea !== '' && country !== '') {
            getSchoolsByCourseAreaAndCountry(courseArea, country);
        } else if (courseArea !== '') {
            getSchoolsByCourseArea(courseArea);
        } else if (country !== '') {
            getSchoolsByCountry(country);
        } else {
            getAllSchools();
        }
    }, [country, courseArea]);

    return (
        <>
            <div className="container col-12 mx-auto mb-1-">
                <h1>Schools</h1>
            </div>
            <div className="container col-12 mx-auto bg-light py-3 rounded shadow-md font-semibold">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-12 mb-2">
                        <p className="text-start mb-1 ml-1">Select Country</p>
                        <select className="form-select" onChange={(e) => setCountry(e.target.value)}>
                            <option selected value="">All countries</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-lg-6 col-12 mb-2">
                        <p className="text-start mb-1 ml-1">Select Course Area</p>
                        <select className="form-select" onChange={(e) => setCourseArea(e.target.value)}>
                            <option selected value="">All course areas</option>
                            {courseAreas.map((courseArea) => (
                                <option key={courseArea} value={courseArea}>{courseArea}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="container mx-auto mt-5 text-center">
                <div className="row justify-content-center">
                    {schools.map((school: any) => (
                        <SchoolCard key={school['host_university']} school={school} />
                    ))}
                </div>
            </div>
            {(schools.length === 0 && !isLoading) && (
                <div className="container mx-auto mt-5 mb-1 text-center">
                    <div className="alert alert-danger" role="alert">
                        Module Unavailable. Try a different Course Area or Country.
                    </div>
                </div>
            )}
        </>
    );
}

export default Information2;