# Tesla TCO Comparison App 🚗⚡

This web app allows users to compare the 5-year Total Cost of Ownership (TCO) of their current or prospective vehicle with a Tesla Model (Model 3 or Model Y). It includes comparisons for fuel/energy, maintenance, insurance, and total cost using interactive bar charts.

## ✨ Features

- Input your own car's make, model, year, and cost breakdown
- Choose a Tesla model to compare against
- Visualize side-by-side costs using Chart.js
- Built with Flask (Python), HTML, CSS, and JavaScript
- Ready for deployment on Render

## 📦 Project Structure

```
tco-app/
├── backend/
│   ├── app.py
│   └── templates/
│       └── index.html
├── static/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── scripts.js
├── data/
│   └── tesla_data.json
├── requirements.txt
```

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/tco-comparison-app.git
cd tco-comparison-app
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the App

```bash
python backend/app.py
```

Open your browser at `http://localhost:5000`.

## 🛰 Deployment

You can deploy this on [Render](https://render.com/):

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python backend/app.py`

## 🗃 Tesla Data

Tesla cost data is currently hard-coded in `data/tesla_data.json`. This can be expanded or integrated with a dynamic data source later.

## 📈 Future Enhancements

- Integrate live vehicle data APIs (e.g., CarQuery, Marketcheck)
- Add charts for depreciation and resale value
- Mobile-responsive design
- Save and share comparison results

---
