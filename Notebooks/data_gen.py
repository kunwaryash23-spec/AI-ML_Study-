"""
Day 19 · Shared dataset builder for the Week 4 capstone.
Import this from the other scripts so they all use the SAME data:
    from data_gen import make_deliveries
    df, late = make_deliveries()
Needs:  pip install pandas numpy
"""

import numpy as np
import pandas as pd


def make_deliveries(n=800, seed=42):
    """Build a toy 'food delivery' dataset. Returns (df, late).

    df       : features (numbers + text) — distance, prep, hour, weather,
               vehicle, and an engineered is_rush column.
    late     : the 0/1 label (1 = the delivery was late).
    """
    rng = np.random.default_rng(seed)
    distance = rng.uniform(1, 20, n)                 # km
    prep     = rng.uniform(5, 40, n)                 # kitchen prep minutes
    hour     = rng.integers(8, 23, n)                # hour of day (8..22)
    weather  = rng.choice(["sunny", "rain", "snow"], n, p=[0.6, 0.3, 0.1])
    vehicle  = rng.choice(["bike", "car", "van"],    n, p=[0.4, 0.4, 0.2])

    # latent lateness score with NON-LINEAR effects (rush hours, bike+long trip)
    rush  = np.isin(hour, [12, 13, 18, 19, 20]).astype(float)
    score = (0.15 * distance + 0.05 * prep
             + np.where(weather == "rain", 1.5, 0) + np.where(weather == "snow", 3.0, 0)
             + 1.6 * rush
             + 2.0 * ((distance > 10) & (vehicle == "bike")))
    late = (rng.random(n) < 1 / (1 + np.exp(-(score - 4.0)))).astype(int)

    df = pd.DataFrame({"distance": distance, "prep": prep, "hour": hour,
                       "weather": weather, "vehicle": vehicle})
    df["is_rush"] = rush.astype(int)                 # engineered feature (Day 18)
    return df, late


if __name__ == "__main__":
    df, late = make_deliveries()
    print(df.head())
    print("late share:", round(late.mean(), 2))
