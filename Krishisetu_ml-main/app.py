import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor


app = Flask(__name__)
CORS(app)

df = pd.read_csv("agricultural_waste_data.csv")

categorical_columns = ['crop_type', 'harvest_season', 'soil_type', 'farming_technique']
df_encoded = pd.get_dummies(df, columns=categorical_columns)
X = df_encoded.drop('waste_produced', axis=1)
y = df_encoded['waste_produced']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)
y_pred = rf_model.predict(X_test)


@app.route('/waste_predict', methods=["POST"])
def waste_predect():
    data = request.get_json()

    # Format to match your model input structure
    input = {
        'crop_area': [data.get('crop_area', 0)],
        'crop_type_rice': [int(data.get('crop_type') == 'rice')],
        'crop_type_wheat': [int(data.get('crop_type') == 'wheat')],
        'crop_type_sugercane': [int(data.get('crop_type') == 'sugercane')],
        'crop_type_corn': [int(data.get('crop_type') == 'corn')],
        'harvest_season_summer': [int(data.get('harvest_season') == 'summer')],
        'harvest_season_winter': [int(data.get('harvest_season') == 'winter')],
        'harvest_season_monsoon': [int(data.get('harvest_season') == 'monsoon')],
        'soil_type_clay': [int(data.get('soil_type') == 'clay')],
        'soil_type_sandy': [int(data.get('soil_type') == 'sandy')],
        'soil_type_loamy': [int(data.get('soil_type') == 'loamy')],
        'farming_technique_traditional': [int(data.get('farming_technique') == 'traditional')],
        'farming_technique_organic': [int(data.get('farming_technique') == 'organic')],
        'farming_technique_modern': [int(data.get('farming_technique') == 'modern')],
        'temperature': [data.get('temperature', 0)],
        'rainfall': [data.get('rainfall', 0)],
        'humidity': [data.get('humidity', 0)]
    }
    
    sample_df = pd.DataFrame(input)
    sample_df = sample_df.reindex(columns=X_train.columns, fill_value=0)
    predicted_waste = rf_model.predict(sample_df)
    return jsonify({
        'farm_area': input['crop_area'][0],
        'predicted_waste': round(float(predicted_waste[0]), 2)
    })

if __name__ == '__main__':
    app.run()