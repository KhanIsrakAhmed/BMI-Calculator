import React, { useEffect, useState } from "react";
import { FaMoon, FaSun, FaWeightScale } from "react-icons/fa6";
import "./App.css";

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("bmi-theme") || "light"
  );
  const [heightUnit, setHeightUnit] = useState("cm");
  const [heightCm, setHeightCm] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bmi-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const switchHeightUnit = (unit) => {
    if (unit === heightUnit) return;

    if (unit === "ft") {
      const cm = Number(heightCm);
      if (cm > 0) {
        const totalInches = cm / 2.54;
        setFeet(String(Math.floor(totalInches / 12)));
        setInches(String(Math.round((totalInches % 12) * 10) / 10));
      }
    } else {
      const ft = Number(feet) || 0;
      const inch = Number(inches) || 0;
      if (ft > 0 || inch > 0) {
        setHeightCm(
          String(Math.round((ft * 12 + inch) * 2.54 * 10) / 10)
        );
      }
    }

    setHeightUnit(unit);
    setResult(null);
  };

  const getHeightInCm = () => {
    if (heightUnit === "cm") return Number(heightCm);

    const ft = Number(feet) || 0;
    const inch = Number(inches) || 0;

    if (ft < 0 || inch < 0 || inch >= 12) return 0;

    return (ft * 12 + inch) * 2.54;
  };

  const calculateBMI = () => {
    const heightInCm = getHeightInCm();
    const weightInKg = Number(weight);

    if (!heightInCm || !weightInKg || heightInCm <= 0 || weightInKg <= 0) {
      alert("Please enter a valid height and weight.");
      return;
    }

    if (heightUnit === "ft" && Number(inches) >= 12) {
      alert("Inches must be between 0 and 11.99.");
      return;
    }

    const heightInMeters = heightInCm / 100;
    const bmi = weightInKg / (heightInMeters * heightInMeters);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Healthy Weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obesity";

    const healthyMinWeight = 18.5 * heightInMeters * heightInMeters;
    const healthyMaxWeight = 24.9 * heightInMeters * heightInMeters;
    const weightToLose = Math.max(0, weightInKg - healthyMaxWeight);
    const weightToGain = Math.max(0, healthyMinWeight - weightInKg);

    setResult({
      bmi: bmi.toFixed(1),
      category,
      healthyMinWeight: healthyMinWeight.toFixed(1),
      healthyMaxWeight: healthyMaxWeight.toFixed(1),
      weightToLose: weightToLose.toFixed(1),
      weightToGain: weightToGain.toFixed(1),
    });
  };

  const resetCalculator = () => {
    setHeightCm("");
    setFeet("");
    setInches("");
    setWeight("");
    setResult(null);
  };

  return (
    <div className="app">
      <div className="page">
        <header className="topbar">
          <div className="brand">
            <div className="brand-icon">
              <FaWeightScale />
            </div>
            <div>
              <h1>BMI Calculator</h1>
              <p>Calculate your BMI and find your healthy weight range.</p>
            </div>
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
            title={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </button>
        </header>

        <main className="layout">
          <aside className="sidebar">
            <section className="card">
              <h2>Enter Your Details</h2>

              <div className="unit-switch">
                <button
                  className={heightUnit === "cm" ? "active" : ""}
                  onClick={() => switchHeightUnit("cm")}
                >
                  cm
                </button>
                <button
                  className={heightUnit === "ft" ? "active" : ""}
                  onClick={() => switchHeightUnit("ft")}
                >
                  ft / in
                </button>
              </div>

              {heightUnit === "cm" ? (
                <div className="input-group">
                  <label htmlFor="height-cm">Height</label>
                  <div className="input-wrapper">
                    <input
                      id="height-cm"
                      type="number"
                      min="1"
                      step="0.1"
                      placeholder="e.g. 178"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                    />
                    <span>cm</span>
                  </div>
                </div>
              ) : (
                <div className="input-group">
                  <label>Height</label>
                  <div className="height-ft-row">
                    <div className="input-wrapper">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="5"
                        value={feet}
                        onChange={(e) => setFeet(e.target.value)}
                      />
                      <span>ft</span>
                    </div>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        min="0"
                        max="11.99"
                        step="0.1"
                        placeholder="10"
                        value={inches}
                        onChange={(e) => setInches(e.target.value)}
                      />
                      <span>in</span>
                    </div>
                  </div>
                  <small className="example">
                    Example: 5 ft 10 in (5&apos; 10&quot;)
                  </small>
                </div>
              )}

              <div className="input-group">
                <label htmlFor="weight">Weight</label>
                <div className="input-wrapper">
                  <input
                    id="weight"
                    type="number"
                    min="1"
                    step="0.1"
                    placeholder="e.g. 75"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  <span>kg</span>
                </div>
              </div>

              <div className="buttons">
                <button className="calculate-btn" onClick={calculateBMI}>
                  Calculate BMI
                </button>
                <button className="reset-btn" onClick={resetCalculator}>
                  Reset
                </button>
              </div>
            </section>

            <section className="card categories">
              <h2>BMI Categories</h2>

              <div className="category-row">
                <span>
                  <i className="dot underweight"></i>Below 18.5
                </span>
                <strong>Underweight</strong>
              </div>

              <div className="category-row">
                <span>
                  <i className="dot healthy"></i>18.5 – 24.9
                </span>
                <strong>Healthy</strong>
              </div>

              <div className="category-row">
                <span>
                  <i className="dot overweight"></i>25.0 – 29.9
                </span>
                <strong>Overweight</strong>
              </div>

              <div className="category-row">
                <span>
                  <i className="dot obesity"></i>30.0+
                </span>
                <strong>Obesity</strong>
              </div>
            </section>
          </aside>

          <section className="card result-card">
            {result ? (
              <>
                <div className="result-title">
                  <h2>Your Result</h2>
                  <span>BMI</span>
                </div>

                <div className="bmi-number">{result.bmi}</div>
                <div className="your-bmi">Your BMI</div>
                <div className="category-pill">{result.category}</div>

                <div className="result-divider"></div>

                <div className="result-grid">
                  <div className="stat-card healthy-stat">
                    <div className="stat-icon">
                      <FaWeightScale />
                    </div>
                    <span>Healthy Weight Range</span>
                    <strong>
                      {result.healthyMinWeight} – {result.healthyMaxWeight} kg
                    </strong>
                    <small>for your height</small>
                  </div>

                  {Number(result.weightToLose) > 0 ? (
                    <div className="stat-card warning-stat">
                      <div className="stat-icon">↓</div>
                      <span>Approximate Weight to Lose</span>
                      <strong>{result.weightToLose} kg</strong>
                      <small>
                        To reach a BMI of 24.9, based on the standard BMI
                        range.
                      </small>
                    </div>
                  ) : Number(result.weightToGain) > 0 ? (
                    <div className="stat-card info-stat">
                      <div className="stat-icon">↑</div>
                      <span>Approximate Weight to Gain</span>
                      <strong>{result.weightToGain} kg</strong>
                      <small>
                        To reach a BMI of 18.5, based on the standard BMI
                        range.
                      </small>
                    </div>
                  ) : (
                    <div className="stat-card success-stat">
                      <div className="stat-icon">✓</div>
                      <span>Weight Status</span>
                      <strong>Healthy BMI range</strong>
                      <small>
                        Your current weight is within the standard healthy BMI
                        range.
                      </small>
                    </div>
                  )}
                </div>

                <div className="note">
                  <div className="note-icon">i</div>
                  <div>
                    <strong>Note</strong>
                    <p>
                      BMI is a screening measure and does not directly measure
                      body fat or overall health.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaWeightScale />
                </div>
                <h2>Your Result</h2>
                <p>
                  Enter your height and weight, then click Calculate BMI to see
                  your results.
                </p>
              </div>
            )}
          </section>
        </main>

        <footer>
          BMI is a screening measure and weight targets should not be treated
          as medical advice.
        </footer>
      </div>
    </div>
  );
}

export default App;