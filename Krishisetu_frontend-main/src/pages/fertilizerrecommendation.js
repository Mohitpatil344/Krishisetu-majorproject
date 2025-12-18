import React, { useState, useEffect } from 'react';

const FertilizerRecommendations = () => {
    const [crop, setCrop] = useState('');
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const apiKey = process.env.REACT_APP_GROQ_API_KEY;

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    // Use reverse geocoding to get location details
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();

                        setUserLocation({
                            city: data.address.city || data.address.town || data.address.village || 'Unknown',
                            state: data.address.state || 'Unknown',
                            country: data.address.country || 'Unknown',
                            lat: latitude,
                            lon: longitude
                        });
                        setLocationLoading(false);
                    } catch (err) {
                        console.error('Error getting location details:', err);
                        setUserLocation({
                            city: 'Unknown',
                            state: 'Unknown',
                            country: 'Unknown',
                            lat: latitude,
                            lon: longitude
                        });
                        setLocationLoading(false);
                    }
                },
                (err) => {
                    console.error('Error getting location:', err);
                    setError('Unable to get your location. Please enable location permissions.');
                    setLocationLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser.');
            setLocationLoading(false);
        }
    }, []);

    const handleSubmit = async () => {
        if (!crop.trim()) {
            setError('Please enter a crop name');
            return;
        }

        if (!userLocation) {
            setError('Location data not available. Please enable location permissions.');
            return;
        }

        setLoading(true);
        setError(null);
        setResponseData(null);

        try {
            // Call Groq API
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert agricultural advisor specializing in fertilizer recommendations. Provide detailed, location-specific fertilizer recommendations in a structured format with sections for Soil Analysis, Recommended Fertilizer, Application Rates, Timing and Method, Local Context, and Environmental Safety. Include a summary table at the end with columns: Nutrient, Quantity (kg/ha), Timing, Method.'
                        },
                        {
                            role: 'user',
                            content: `Please provide detailed fertilizer recommendations for ${crop} in ${userLocation.city}, ${userLocation.state}, ${userLocation.country} (Latitude: ${userLocation.lat.toFixed(4)}, Longitude: ${userLocation.lon.toFixed(4)}). 

Consider:
1. Local soil conditions typical for this region
2. Climate and weather patterns
3. Optimal NPK ratios for ${crop}
4. Application timing and methods
5. Local availability and costs
6. Environmental considerations

Format your response with these sections:
**Soil Analysis**
**Recommended Fertilizer**
**Application Rates**
**Timing and Method**
**Local Context**
**Environmental Safety**
**Summary Table**

For the summary table, use this format:
| Nutrient | Quantity (kg/ha) | Timing | Method |`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to get recommendations from Groq API');
            }

            const data = await response.json();
            const recommendation = data.choices[0]?.message?.content || 'No recommendation available';

            // Mock weather data (you can integrate a weather API here)
            const mockWeatherData = {
                temperature: 25,
                humidity: 60,
                precipitation: 2.0,
                windspeed: 10
            };

            setResponseData({
                status: 'success',
                recommendation: recommendation,
                weather_data: mockWeatherData
            });
            setLoading(false);

        } catch (err) {
            console.error('Error:', err);
            setError(err?.message || 'An error occurred while fetching recommendations');
            setLoading(false);
        }
    };

    const renderWeatherCard = () => (
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm w-48">
            <h4 className="font-semibold text-gray-800 mb-3">Current Weather</h4>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-green-600">🌡️</span>
                    <span className="text-sm text-gray-600">{responseData.weather_data.temperature}°C</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-green-600">💧</span>
                    <span className="text-sm text-gray-600">{responseData.weather_data.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-green-600">🌧️</span>
                    <span className="text-sm text-gray-600">{responseData.weather_data.precipitation} mm</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-green-600">💨</span>
                    <span className="text-sm text-gray-600">{responseData.weather_data.windspeed} km/h</span>
                </div>
            </div>
        </div>
    );

    const renderSummaryTable = () => {
        const tableRegex = /\|.*\|.*\|.*\|.*\|/g;
        const tableRows = responseData.recommendation.match(tableRegex) || [];

        if (tableRows.length < 3) return null;

        const headers = tableRows[0]?.split('|').map(h => h.trim()).filter(h => h);
        const rows = tableRows.slice(2).map(row =>
            row.split('|').map(cell => cell.trim()).filter(cell => cell)
        );

        if (!headers || !rows.length) return null;

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className="px-4 py-3 text-center text-sm font-semibold text-gray-800 border-b">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b last:border-b-0">
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-4 py-3 text-sm text-gray-600 text-center">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderRecommendationWithIcons = () => {
        const summaryTableIndex = responseData.recommendation.indexOf('**Summary Table**');
        const recommendationText = summaryTableIndex !== -1
            ? responseData.recommendation.slice(0, summaryTableIndex).trim()
            : responseData.recommendation;

        const sections = recommendationText.split('\n\n');

        const iconMap = {
            'soil analysis': '🧪',
            'recommended fertilizer': '🌾',
            'application rates': '⚖️',
            'timing': '📅',
            'local context': '💰',
            'environmental': '⚠️',
            'additional': '🔧',
            'expected': '📈'
        };

        return sections.map((section, index) => {
            const titleMatch = section.match(/\*\*(.*?)\*\*/);
            const title = titleMatch ? titleMatch[1] : '';
            const content = section.replace(/\*\*(.*?)\*\*/, '').trim();

            let icon = '🌿';
            Object.entries(iconMap).forEach(([key, value]) => {
                if (title.toLowerCase().includes(key)) {
                    icon = value;
                }
            });

            return (
                <div key={index} className="mb-6">
                    {title && (
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{icon}</span>
                            <h4 className="font-semibold text-gray-800 text-base">{title}</h4>
                        </div>
                    )}
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{content}</p>
                </div>
            );
        });
    };

    const handleKeyPress = (e, action) => {
        if (e.key === 'Enter') {
            action();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Location Status */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📍</span>
                        {locationLoading ? (
                            <p className="text-sm text-gray-600">Getting your location...</p>
                        ) : userLocation ? (
                            <p className="text-sm text-gray-800">
                                <span className="font-semibold">Your Location:</span> {userLocation.city}, {userLocation.state}, {userLocation.country}
                            </p>
                        ) : (
                            <p className="text-sm text-red-600">Location unavailable</p>
                        )}
                    </div>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">🌾 Fertilizer Recommendations</h1>
                    <p className="text-sm text-gray-600 mb-6 text-center">
                        Get AI-powered fertilizer recommendations based on your crop and location
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Crop Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="e.g., Wheat, Rice, Cotton, Corn, Tomatoes"
                                value={crop}
                                onChange={(e) => setCrop(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || locationLoading || !userLocation}
                            className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${loading || locationLoading || !userLocation
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {loading ? '🔄 Analyzing...' : '✨ Get Recommendations'}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>

                {/* Results */}
                {responseData && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span>🌱</span> Fertilizer Recommendations
                            </h2>
                            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                                {renderRecommendationWithIcons()}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span>🌤️</span> Weather Conditions
                            </h2>
                            {renderWeatherCard()}
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span>📊</span> Application Summary
                            </h2>
                            {renderSummaryTable()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FertilizerRecommendations;