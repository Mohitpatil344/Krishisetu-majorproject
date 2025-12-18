import React, { useState } from 'react';
import { Upload, Camera, Leaf, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const HealthBar = ({ status }) => {
    const healthLevels = {
        healthy: { percent: 100, color: 'bg-green-500', label: 'Healthy' },
        'mildly affected': { percent: 65, color: 'bg-yellow-500', label: 'Mildly Affected' },
        'severely affected': { percent: 30, color: 'bg-orange-500', label: 'Severely Affected' },
        dead: { percent: 0, color: 'bg-red-500', label: 'Dead' },
    };

    const health = healthLevels[status?.toLowerCase()] || {
        percent: 50,
        color: 'bg-gray-400',
        label: status || 'Unknown',
    };

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full ${health.color} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${health.percent}%` }}
                />
            </div>
            <span className="text-sm font-medium text-gray-700 min-w-[120px]">
                {health.label}
            </span>
        </div>
    );
};

export default function CropCare() {
    const [image, setImage] = useState(null);
    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const apiKey = process.env.REACT_APP_GROQ_API_KEY;

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
            setDiagnosis(null);
            setError(null);
            analyzeImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const analyzeImage = async (base64Image) => {
        if (!apiKey) {
            setError('API Key not found. Please check your environment configuration.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: `You are an expert agricultural pathologist. Analyze this plant image and provide a detailed diagnosis in JSON format with the following structure:
{
  "disease": "name of disease or 'Healthy' if no disease detected",
  "plant": "plant species name (common and scientific)",
  "type_of_disease": "Fungal/Bacterial/Viral/Pest/Nutritional/None",
  "plant_health": "healthy/mildly affected/severely affected/dead",
  "leaf_health": "healthy/mildly affected/severely affected/dead",
  "treatment_required": true or false,
  "disease_symptoms": ["symptom 1", "symptom 2", ...],
  "treatment_procedure": "Detailed treatment steps in markdown format with ### headers for sections"
}

Be specific and accurate. If the plant appears healthy, say so. Only respond with valid JSON.`
                                },
                                {
                                    type: 'image_url',
                                    image_url: {
                                        url: base64Image
                                    }
                                }
                            ]
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 2000,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to analyze image');
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || '';

            // Extract JSON from response
            let jsonStr = content.trim();
            if (jsonStr.includes('```json')) {
                jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
            } else if (jsonStr.includes('```')) {
                jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
            }

            const diagnosisData = JSON.parse(jsonStr);
            setDiagnosis(diagnosisData);
            setLoading(false);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to analyze image. Please check your API key and try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <Leaf className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Crop Care</h1>
                            <p className="text-sm text-gray-600">AI-powered plant disease diagnosis with Groq</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Hero Image */}
                <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=300&fit=crop"
                        alt="Crop field"
                        className="w-full h-48 object-cover"
                    />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={loading}
                        />
                        <div className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3">
                            <Upload className="w-5 h-5" />
                            <span>{image ? 'Change Image' : 'Upload Image'}</span>
                        </div>
                    </label>

                    <label className="cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={loading}
                        />
                        <div className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3">
                            <Camera className="w-5 h-5" />
                            <span>Take Photo</span>
                        </div>
                    </label>
                </div>

                {/* Image Preview */}
                {image && (
                    <div className="mb-8 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                        <img
                            src={image}
                            alt="Selected crop"
                            className="w-full h-96 object-contain bg-gray-50"
                        />
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700">Analyzing your crop image with Groq AI...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-800">Error</h3>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Diagnosis Results */}
                {diagnosis && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-5 border-b border-gray-200">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <h2 className="text-2xl font-bold text-green-800 mb-1">
                                        {diagnosis.disease || 'No Disease Detected'}
                                    </h2>
                                    <p className="text-gray-700">Diagnosis Results</p>
                                </div>
                                {diagnosis.treatment_required && (
                                    <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full border border-amber-200">
                                        <AlertCircle className="w-4 h-4" />
                                        Treatment Required
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Plant Info */}
                        <div className="px-6 py-5 border-b border-gray-200">
                            <div className="flex items-start gap-3">
                                <Leaf className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Plant Species</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {diagnosis.plant || 'Unknown Plant'}
                                    </p>
                                    {diagnosis.type_of_disease && (
                                        <p className="text-sm text-purple-700 font-medium mt-1">
                                            Type: {diagnosis.type_of_disease}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Health Status */}
                        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Health Status</h3>
                            <div className="space-y-4">
                                {diagnosis.plant_health && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Plant Health</p>
                                        <HealthBar status={diagnosis.plant_health} />
                                    </div>
                                )}
                                {diagnosis.leaf_health && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Leaf Health</p>
                                        <HealthBar status={diagnosis.leaf_health} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Symptoms */}
                        {diagnosis.disease_symptoms && diagnosis.disease_symptoms.length > 0 && (
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-orange-600" />
                                    Disease Symptoms
                                </h3>
                                <ul className="space-y-2">
                                    {diagnosis.disease_symptoms.map((symptom, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="text-green-600 font-bold text-lg leading-none">•</span>
                                            <span className="text-gray-700 flex-1">{symptom}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Treatment */}
                        {diagnosis.treatment_procedure && (
                            <div className="px-6 py-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    Treatment Procedure
                                </h3>
                                <div className="prose prose-sm max-w-none">
                                    {diagnosis.treatment_procedure.split('\n').map((line, idx) => {
                                        if (line.startsWith('###')) {
                                            return (
                                                <h3 key={idx} className="text-base font-bold text-green-800 mt-4 mb-2">
                                                    {line.replace('###', '').trim()}
                                                </h3>
                                            );
                                        } else if (line.startsWith('**')) {
                                            return (
                                                <p key={idx} className="font-semibold text-gray-800 mt-3">
                                                    {line.replace(/\*\*/g, '')}
                                                </p>
                                            );
                                        } else if (line.match(/^\d+\./)) {
                                            return (
                                                <p key={idx} className="text-gray-700 ml-4 mt-1">
                                                    {line}
                                                </p>
                                            );
                                        } else if (line.startsWith('- ')) {
                                            return (
                                                <p key={idx} className="text-gray-700 ml-4 mt-1">
                                                    • {line.substring(2)}
                                                </p>
                                            );
                                        } else if (line.trim()) {
                                            return (
                                                <p key={idx} className="text-gray-700 mt-2">
                                                    {line}
                                                </p>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Instructions */}
                {!image && !loading && (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
                            <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Get Started
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Upload a photo of your crop or take a new picture to receive an instant AI-powered diagnosis of potential diseases and treatment recommendations using Groq's vision AI.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600 mb-2">1</div>
                                    <p className="text-sm text-gray-700">Upload or capture a clear image of the affected plant</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600 mb-2">2</div>
                                    <p className="text-sm text-gray-700">Groq AI analyzes the image for disease symptoms</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600 mb-2">3</div>
                                    <p className="text-sm text-gray-700">Receive diagnosis and treatment recommendations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fertilizer Recommendation Section */}
                <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border border-blue-200">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Leaf className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Need Fertilizer Recommendations?
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Get personalized fertilizer recommendations based on your soil type, crop requirements, and growth stage. Our AI-powered system helps you optimize nutrient management for better yields.
                        </p>
                        <button
                            onClick={() => window.location.href = '/fertilizer-recommendation'}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
                        >
                            <span>Get Fertilizer Recommendations</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}