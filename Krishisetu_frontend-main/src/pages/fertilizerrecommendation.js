import React, { useState } from 'react';

const FertilizerRecommendations = () => {
    const [crop, setCrop] = useState('');
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);

    // Mock user location data
    const userLocation = {
        city: 'Narnaund',
        state: 'Haryana',
        country: 'India',
        lat: 29.2186,
        lon: 76.1428
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!crop.trim()) {
            setError('Please enter a crop name');
            return;
        }

        setLoading(true);
        setError(null);
        setResponseData(null);

        try {
            // Mock API response for demonstration
            // Replace with actual API call: const res = await fetch(API_URL, {...})

            setTimeout(() => {
                const mockData = {
                    status: 'success',
                    recommendation: `**Soil Analysis**
Based on your location in ${userLocation.city}, ${userLocation.state}, typical soil conditions suggest balanced NPK fertilizer application.

**Recommended Fertilizer**
For ${crop}, use a balanced NPK fertilizer ratio of 10-26-26 or similar composition.

**Application Rates**
Apply 150-200 kg per hectare during the growing season, split into 2-3 applications.

**Timing and Method**
First application at planting, second at vegetative stage, and third during flowering.

**Local Context**
Average cost in your region: ₹800-1200 per 50kg bag. Available at local agricultural stores.

**Environmental Safety**
Follow recommended dosages to prevent nutrient runoff. Maintain buffer zones near water sources.

**Summary Table**
| Nutrient | Quantity (kg/ha) | Timing | Method |
|----------|------------------|--------|---------|
| Nitrogen | 60-80 | Split application | Broadcast |
| Phosphorus | 40-50 | At planting | Band placement |
| Potassium | 40-50 | Split application | Broadcast |`,
                    weather_data: {
                        temperature: 28,
                        humidity: 65,
                        precipitation: 2.5,
                        windspeed: 12
                    }
                };

                setResponseData(mockData);
                setLoading(false);
            }, 1500);

        } catch (err) {
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
                    <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
                </div>
            );
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24">
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Fertilizer Recommendations</h1>
                    <p className="text-sm text-gray-600 mb-6 text-center">
                        Get personalized fertilizer recommendations based on your crop and location
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter crop name (e.g., Wheat, Rice, Cotton)"
                                value={crop}
                                onChange={(e) => setCrop(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {loading ? 'Loading...' : 'Get Recommendations'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>

                {responseData && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Fertilizer Recommendations</h2>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                {renderRecommendationWithIcons()}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Weather Conditions</h2>
                            {renderWeatherCard()}
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Summary Table</h2>
                            {renderSummaryTable()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FertilizerRecommendations;