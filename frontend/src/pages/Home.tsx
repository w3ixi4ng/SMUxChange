import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";


// testing
async function fetchEvents() {
  try {
    const response = await axios.get(`http://localhost:3001/database/getByCourseAreaAndCountry/Asian Studies/China`);
    return response.data;
  }
  catch (error) {
    console.error(error);
    return null;
  }
}
// testing
const data = await fetchEvents();
console.log(data);


function Home() {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-6 bg-gray-100 p-4 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to SMUxChange</h1>
        <p className="text-lg text-gray-600">Your platform for exploring and mapping locations</p>

        <div className="space-y-4">
          <Link to="/mappable">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg">
              Go to Mappable Locations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;