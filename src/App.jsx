import { useEffect, useState } from "react";

/* =========================
PASSWORD EYE ICONS
========================= */

function EyeIcon() {
return ( <svg
   width="22"
   height="22"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="2"
   strokeLinecap="round"
   strokeLinejoin="round"
   aria-hidden="true"
 > <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /> <circle cx="12" cy="12" r="3" /> </svg>
);
}

function EyeOffIcon() {
return ( <svg
   width="22"
   height="22"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="2"
   strokeLinecap="round"
   strokeLinejoin="round"
   aria-hidden="true"
 > <path d="M3 3l18 18" /> <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /> <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-3.1 4.4" /> <path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.5 8 10 8c1.8 0 3.4-.5 4.8-1.2" /> </svg>
);
}

/* =========================
MAIN APP
========================= */

function App() {
const [page, setPage] = useState("login");
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState(null);

function handleLogin(userData) {
setUser(userData);
setIsLoggedIn(true);
}

if (isLoggedIn) {
return (
<HealthApplication
user={user}
onLogout={() => {
setIsLoggedIn(false);
setUser(null);
setPage("login");
}}
/>
);
}

if (page === "register") {
return (
<Register
onBackToLogin={() => setPage("login")}
onRegistrationSuccess={() => setPage("login")}
/>
);
}

return (
<Login
onLogin={handleLogin}
onRegister={() => setPage("register")}
/>
);
}

/* =========================
LOGIN PAGE
========================= */

function Login({ onLogin, onRegister }) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [error, setError] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);

async function handleLogin(e) {
e.preventDefault();

setError("");

if (email.trim() === "" || password === "") {
setError("Please enter email and password.");
return;
}

try {
setLoading(true);


const response = await fetch(
  "http://localhost:8080/api/users/login",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password: password,
    }),
  }
);

const data = await response.json();

if (!response.ok) {
  throw new Error(
    typeof data === "string"
      ? data
      : "Invalid email or password."
  );
}

console.log("Logged in user:", data);

onLogin({
  id: data.id,
  name: data.name,
  email: data.email,
  password: password,
});


} catch (error) {
console.error("Login error:", error);


setError(
  error.message ||
  "Cannot connect to the backend. Make sure Spring Boot is running on port 8080."
);


} finally {
setLoading(false);
}
}


return ( <div className="login-page"> <div className="login-card">


    <div className="login-icon">
      ❤️
    </div>

    <h1>Health Assist</h1>

    <p className="login-subtitle">
      Your Personal Health Assistant
    </p>

    <form onSubmit={handleLogin}>

      <label>Email</label>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password</label>

      <div className="password-container">

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          title={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <EyeOffIcon />
          ) : (
            <EyeIcon />
          )}
        </button>

      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

    </form>

    <div className="register-link">

      <p>
        Don't have an account?
      </p>

      <button
        type="button"
        className="register-button"
        onClick={onRegister}
      >
        Create New Account
      </button>

    </div>

  </div>
</div>


);
}

/* =========================
REGISTRATION PAGE
========================= */

function Register({
onBackToLogin,
onRegistrationSuccess,
}) {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] =
useState(false);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [loading, setLoading] = useState(false);

async function handleRegister(e) {
e.preventDefault();


setError("");
setSuccess("");

if (name.trim() === "") {
  setError("Please enter your name.");
  return;
}

if (email.trim() === "") {
  setError("Please enter your email.");
  return;
}

if (password === "") {
  setError("Please enter a password.");
  return;
}

if (password.length < 6) {
  setError(
    "Password must contain at least 6 characters."
  );
  return;
}

if (password !== confirmPassword) {
  setError("Passwords do not match.");
  return;
}

try {
  setLoading(true);

  const response = await fetch(
    "http://localhost:8080/api/users/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password: password,
      }),
    }
  );

  const data = await response.text();

  if (response.ok) {

    /*
     * Save the registered user's name and email
     * so the Profile page can display them
     * after login.
     */
    localStorage.setItem(
      "healthAssistUser",
      JSON.stringify({
        name: name.trim(),
        email: email.trim(),
      })
    );

    setSuccess(
      "Account created successfully! You can now login."
    );

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setShowPassword(false);
    setShowConfirmPassword(false);

    setTimeout(() => {
      onRegistrationSuccess();
    }, 1500);
  } else {
    setError(data || "Registration failed.");
  }

} catch (error) {
  console.error(
    "Registration error:",
    error
  );

  setError(
    "Cannot connect to the backend. Make sure Spring Boot is running on port 8080."
  );

} finally {
  setLoading(false);
}


}

return ( <div className="login-page">


  <div className="login-card">

    <div className="login-icon">
      ❤️
    </div>

    <h1>Create Account</h1>

    <p className="login-subtitle">
      Join Health Assist
    </p>

    <form onSubmit={handleRegister}>

      <label>Full Name</label>

      <input
        type="text"
        placeholder="Enter your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Email</label>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password</label>

      <div className="password-container">

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          title={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <EyeOffIcon />
          ) : (
            <EyeIcon />
          )}
        </button>

      </div>

      <label>Confirm Password</label>

      <div className="password-container">

        <input
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() =>
            setShowConfirmPassword(
              !showConfirmPassword
            )
          }
          aria-label={
            showConfirmPassword
              ? "Hide confirm password"
              : "Show confirm password"
          }
          title={
            showConfirmPassword
              ? "Hide confirm password"
              : "Show confirm password"
          }
        >
          {showConfirmPassword ? (
            <EyeOffIcon />
          ) : (
            <EyeIcon />
          )}
        </button>

      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {success && (
        <p className="success">
          {success}
        </p>
      )}

      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </button>

    </form>

    <div className="register-link">

      <p>
        Already have an account?
      </p>

      <button
        type="button"
        className="register-button"
        onClick={onBackToLogin}
      >
        Back to Login
      </button>

    </div>

  </div>

</div>


);
}

/* =========================
MAIN HEALTH APPLICATION
========================= */

function HealthApplication({
user,
onLogout,
}) {
const [page, setPage] = useState("dashboard");

return ( <div className="app">

  <header className="header">

    <h1>
      ❤️ Health Assist
    </h1>

    <nav>

      <button
        className={page === "dashboard" ? "nav-button active" : "nav-button"}
        onClick={() => setPage("dashboard")}
      >
        <span className="nav-icon">⌂</span>
        Dashboard
      </button>

      <button
        className={page === "appointments" ? "nav-button active" : "nav-button"}
        onClick={() => setPage("appointments")}
      >
        <span className="nav-icon">▣</span>
        Find a Doctor
      </button>

      <button
        className={page === "health" ? "nav-button active" : "nav-button"}
        onClick={() => setPage("health")}
      >
        <span className="nav-icon">♥</span>
        Health Checker
      </button>

      <button
        className={page === "assistant" ? "nav-button active" : "nav-button"}
        onClick={() => setPage("assistant")}
      >
        <span className="nav-icon">✦</span>
        AI Doctor
      </button>

      <button
        className={page === "profile" ? "nav-button active" : "nav-button"}
        onClick={() => setPage("profile")}
      >
        <span className="nav-icon">◉</span>
        My Profile
      </button>

      <button
        className="logout-button"
        onClick={onLogout}
      >
        Logout
      </button>

    </nav>

  </header>

  <main className="main">

    {page === "dashboard" && (
      <Dashboard setPage={setPage} user={user} />
    )}

    {page === "profile" && (
      <Profile user={user} />
    )}

    {page === "health" && (
      <Health />
    )}

    {page === "appointments" && (
      <Appointments user={user} />
    )}

    {page === "assistant" && (
      <Assistant user={user} />
    )}

  </main>

</div>

);
}

/* =========================
USER PROFILE
========================= */

function Profile({ user }) {
const [showPassword, setShowPassword] =
useState(false);

return ( <div>


  <h2>
    My Profile
  </h2>

  <p>
    View your Health Assist account details.
  </p>

  <div className="panel">

    <div
      style={{
        textAlign: "center",
        marginBottom: "25px",
      }}
    >

      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "#2563eb",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 15px",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        {user?.name
          ? user.name
              .charAt(0)
              .toUpperCase()
          : "U"}
      </div>

      <h3>
        {user?.name || "User"}
      </h3>

    </div>

    <div
      style={{
        marginBottom: "20px",
      }}
    >

      <label>
        <strong>
          Full Name
        </strong>
      </label>

      <input
        type="text"
        value={user?.name || ""}
        readOnly
      />

    </div>

    <div
      style={{
        marginBottom: "20px",
      }}
    >

      <label>
        <strong>
          Email
        </strong>
      </label>

      <input
        type="email"
        value={user?.email || ""}
        readOnly
      />

    </div>

    <div
      style={{
        marginBottom: "20px",
      }}
    >

      <label>
        <strong>
          Password
        </strong>
      </label>

      <div
        className="password-container"
      >

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={
            user?.password || ""
          }
          readOnly
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
          title={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <EyeOffIcon />
          ) : (
            <EyeIcon />
          )}
        </button>

      </div>

    </div>

  </div>

  <div className="warning">

    <strong>
      Security Notice:
    </strong>

    <p>
      For this project demonstration, the
      password can be viewed using the eye
      icon. In a production health application,
      passwords should be securely hashed and
      should never be displayed.
    </p>

  </div>

</div>


);
}

/* =========================
DASHBOARD
========================= */

function Dashboard({ setPage, user }) {
  return (
    <div className="dashboard-page">

      {/* Keep the original dashboard background and layout */}
      <div className="dashboard-overlay"></div>

      <div className="dashboard-content">

        {/* Original welcome section */}
        <div className="dashboard-welcome">
          <p className="dashboard-small-title">
            HEALTH ASSIST
          </p>

          <h1>
            Welcome, {user?.name || "User"}!
          </h1>

          <p>
            Your healthcare information and services in one place.
          </p>
        </div>

        {/* Main Modules - same dashboard structure, only the modules are updated */}
        <div className="dashboard-modules">

          {/* Find a Doctor */}
          <div
            className="dashboard-module doctors-module"
            onClick={() => setPage("appointments")}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setPage("appointments");
              }
            }}
          >
            <div className="module-icon">
              👨‍⚕️
            </div>

            <div className="module-content">
              <h2>Find a Doctor</h2>

              <p>
                Find doctors, view specialties, and book an appointment
                with the doctor you choose.
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setPage("appointments");
                }}
              >
                Find a Doctor →
              </button>
            </div>
          </div>

          {/* AI Doctor */}
          <div
            className="dashboard-module ai-doctor-module"
            onClick={() => setPage("assistant")}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setPage("assistant");
              }
            }}
          >
            <div className="module-icon">
              🤖
            </div>

            <div className="module-content">
              <h2>AI Doctor</h2>

              <p>
                Ask your AI health assistant questions and get general
                health and wellness information.
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setPage("assistant");
                }}
              >
                Ask AI Doctor →
              </button>
            </div>
          </div>

          {/* Health Checker */}
          <div
            className="dashboard-module health-checker-module"
            onClick={() => setPage("health")}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setPage("health");
              }
            }}
          >
            <div className="module-icon">
              🩺
            </div>

            <div className="module-content">
              <h2>Health Checker</h2>

              <p>
                Calculate your BMI and explore food, nutrients, and
                exercise guidance based on your result.
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setPage("health");
                }}
              >
                Check My Health →
              </button>
            </div>
          </div>

          {/* My Profile - intentionally last */}
          <div
            className="dashboard-module profile-module"
            onClick={() => setPage("profile")}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setPage("profile");
              }
            }}
          >
            <div className="module-icon">
              👤
            </div>

            <div className="module-content">
              <h2>My Profile</h2>

              <p>
                View your Health Assist account information and personal
                profile details.
              </p>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setPage("profile");
                }}
              >
                View Profile →
              </button>
            </div>
          </div>

        </div>

        {/* Original bottom information area, updated only for the four modules */}
        <div className="dashboard-info">
          <div>
            <strong>Find a Doctor</strong>
            <span>Book appointments</span>
          </div>

          <div>
            <strong>AI Doctor</strong>
            <span>Ask health questions</span>
          </div>

          <div>
            <strong>Health Checker</strong>
            <span>Check your health</span>
          </div>

          <div>
            <strong>My Profile</strong>
            <span>View account details</span>
          </div>
        </div>

      </div>
    </div>
  );
}

/* =========================
HEALTH PAGE
========================= */

function Health() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [bmiError, setBmiError] = useState("");

  function calculateBMI() {
    setBmiError("");

    const heightNumber = Number(height);
    const weightNumber = Number(weight);

    if (!heightNumber || !weightNumber || heightNumber <= 0 || weightNumber <= 0) {
      setBmi(null);
      setBmiError("Please enter a valid height and weight.");
      return;
    }

    const heightInMeters = heightNumber / 100;
    const calculatedBMI = weightNumber / (heightInMeters * heightInMeters);

    setBmi(Number(calculatedBMI.toFixed(1)));
  }

  function getRecommendations(value) {
    if (value < 18.5) {
      return {
        category: "Underweight",
        badge: "Focus on healthy weight gain",
        focus: "Your main focus should be getting enough nutritious energy, protein, and strength-building activity rather than simply eating more processed food.",
        foods: [
          "Milk or curd, paneer, eggs, fish, chicken, beans and dals for protein",
          "Rice, oats, whole-grain roti, potatoes and other nutrient-rich carbohydrates",
          "Nuts, seeds, peanut butter, avocado and healthy cooking oils for energy",
          "Fruits and vegetables every day for fiber and micronutrients"
        ],
        vitamins: [
          "Prioritize nutrients from a varied diet first.",
          "Iron, vitamin B12, vitamin D or other supplements should be considered only when a deficiency or medical need is identified by a healthcare professional."
        ],
        exercises: [
          "Begin with resistance exercises such as squats, wall push-ups or light weights 2–3 days per week.",
          "Use walking or other moderate activity for general fitness, without letting exercise replace needed nutrition."
        ]
      };
    }

    if (value < 25) {
      return {
        category: "Healthy Weight",
        badge: "Focus on maintaining healthy habits",
        focus: "Your main focus should be maintaining a balanced eating pattern, regular physical activity, good sleep and consistent healthy routines.",
        foods: [
          "Vegetables and fruits in a variety of colors",
          "Whole grains such as oats, brown rice and whole-wheat foods",
          "Protein sources such as dal, beans, eggs, fish, chicken, paneer or curd",
          "Nuts and seeds in reasonable portions, plus adequate water"
        ],
        vitamins: [
          "A varied diet should be your first source of vitamins and minerals.",
          "Do not start high-dose vitamin supplements just because of a BMI result; supplements are situation-specific."
        ],
        exercises: [
          "Aim for regular moderate activity such as brisk walking, cycling or swimming.",
          "Include muscle-strengthening activity at least 2 days per week."
        ]
      };
    }

    if (value < 30) {
      return {
        category: "Overweight",
        badge: "Focus on sustainable healthy weight management",
        focus: "Your main focus should be a sustainable eating pattern, regular activity, portion awareness, sleep and gradual progress rather than crash diets.",
        foods: [
          "Vegetables, fruits and other high-fiber foods",
          "Dal, beans, eggs, fish, chicken, tofu or other lean protein sources",
          "Whole grains and minimally processed carbohydrates in appropriate portions",
          "Water as the main drink; limit frequent sugary drinks and highly processed snacks"
        ],
        vitamins: [
          "BMI alone does not tell you which vitamin you need.",
          "Get nutrients from food first; discuss supplements with a healthcare professional if a deficiency is suspected or confirmed."
        ],
        exercises: [
          "Build toward at least 150 minutes of moderate aerobic activity per week, such as brisk walking.",
          "Add muscle-strengthening activity at least 2 days per week if appropriate for you."
        ]
      };
    }

    return {
      category: "Obesity",
      badge: "Focus on sustainable weight management and health screening",
      focus: "Your main focus should be sustainable nutrition, regular movement, sleep and discussing your overall health with a healthcare professional—not BMI alone.",
      foods: [
        "Vegetables, fruits, legumes and other high-fiber foods",
        "Protein-rich foods such as dal, beans, eggs, fish, chicken, tofu or curd",
        "Whole grains and minimally processed foods in portions that fit your needs",
        "Water instead of frequent sugary drinks; reduce highly processed foods and excess added sugars"
      ],
      vitamins: [
        "There is no specific vitamin supplement that should automatically be taken because of obesity.",
        "Food-first nutrition is preferred; ask a healthcare professional about testing or supplements when there is a specific risk or deficiency."
      ],
      exercises: [
        "Start with activity you can do safely, such as walking, and increase gradually.",
        "Work toward regular aerobic activity and muscle-strengthening activity as tolerated."
      ]
    };
  }

  const recommendation = bmi !== null ? getRecommendations(bmi) : null;

  return (
    <div className="health-checker-page">
      <div className="page-heading-row">
        <div>
          <span className="section-kicker">PERSONAL HEALTH TOOL</span>
          <h2>Health Checker</h2>
          <p>
            Check your adult BMI and get general wellness guidance based on your result.
          </p>
        </div>
        <div className="health-checker-icon">♥</div>
      </div>

      <div className="health-checker-grid">
        <div className="panel bmi-calculator-card">
          <div className="card-title-row">
            <div>
              <h3>BMI Calculator</h3>
              <p>Enter your height and weight to calculate your BMI.</p>
            </div>
            <span className="mini-badge">Adult 20+</span>
          </div>

          <div className="bmi-input-grid">
            <div className="health-input-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                id="height"
                type="number"
                min="1"
                placeholder="e.g. 170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            <div className="health-input-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                min="1"
                step="0.1"
                placeholder="e.g. 65"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          {bmiError && <p className="error">{bmiError}</p>}

          <button className="health-check-button" onClick={calculateBMI}>
            Check My BMI →
          </button>

          <div className="bmi-scale">
            <span>Underweight<br /><strong>&lt; 18.5</strong></span>
            <span>Healthy<br /><strong>18.5–24.9</strong></span>
            <span>Overweight<br /><strong>25–29.9</strong></span>
            <span>Obesity<br /><strong>30+</strong></span>
          </div>
        </div>

        {recommendation && (
          <div className="panel bmi-result-card">
            <div className="result-topline">
              <span>Your BMI</span>
              <span className="result-category">{recommendation.category}</span>
            </div>
            <div className="bmi-number">{bmi}</div>
            <h3>{recommendation.badge}</h3>
            <p className="main-focus">
              <strong>Main focus:</strong> {recommendation.focus}
            </p>
          </div>
        )}
      </div>

      {recommendation && (
        <div className="recommendation-section">
          <div className="recommendation-heading">
            <span className="section-kicker">YOUR NEXT STEPS</span>
            <h3>Personalized Wellness Guidance</h3>
            <p>
              These are general suggestions based only on BMI. Your age, medical history,
              medications, activity level and other health information can change what is appropriate.
            </p>
          </div>

          <div className="recommendation-grid">
            <div className="recommendation-card food-card">
              <div className="recommendation-icon">🥗</div>
              <h3>Food to Prefer</h3>
              <ul>
                {recommendation.foods.map((food, index) => (
                  <li key={index}>{food}</li>
                ))}
              </ul>
            </div>

            <div className="recommendation-card vitamin-card">
              <div className="recommendation-icon">💊</div>
              <h3>Vitamins & Nutrients</h3>
              <ul>
                {recommendation.vitamins.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="recommendation-card exercise-card">
              <div className="recommendation-icon">🏃</div>
              <h3>Exercises to Consider</h3>
              <ul>
                {recommendation.exercises.map((exercise, index) => (
                  <li key={index}>{exercise}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="warning health-disclaimer">
        <strong>Important:</strong>
        <p>
          BMI is a screening measure, not a diagnosis, and it does not distinguish muscle from fat.
          The guidance above is general wellness information. If you are under 20, pregnant,
          have a medical condition, take medicines, have unexplained weight changes, or need a
          personalized diet/exercise plan, discuss your situation with a qualified healthcare professional.
        </p>
      </div>
    </div>
  );
}

/* =========================
APPOINTMENTS
========================= */

function Appointments({ user }) {
const doctors = [
{
id: 1,
name: "Dr. Rajesh Kumar",
specialty: "General Physician",
experience: "12 years experience",
locations: [
"Apollo Hospital",
"City Health Clinic",
],
times: [
"09:00 AM",
"10:30 AM",
"12:00 PM",
"04:00 PM",
],
},
{
id: 2,
name: "Dr. Priya Sharma",
specialty: "Cardiologist",
experience: "15 years experience",
locations: [
"Apollo Hospital",
"Heart Care Center",
],
times: [
"09:30 AM",
"11:00 AM",
"02:00 PM",
"05:30 PM",
],
},
{
id: 3,
name: "Dr. Arjun Reddy",
specialty: "Dermatologist",
experience: "10 years experience",
locations: [
"Skin Care Hospital",
"City Health Clinic",
],
times: [
"10:00 AM",
"11:30 AM",
"03:00 PM",
"06:00 PM",
],
},
{
id: 4,
name: "Dr. Sneha Patel",
specialty: "Pediatrician",
experience: "8 years experience",
locations: [
"Children's Hospital",
"Apollo Hospital",
],
times: [
"09:00 AM",
"11:00 AM",
"01:30 PM",
"04:30 PM",
],
},
{
id: 5,
name: "Dr. Vikram Singh",
specialty: "Orthopedic Specialist",
experience: "14 years experience",
locations: [
"Bone & Joint Hospital",
"Apollo Hospital",
],
times: [
"08:30 AM",
"10:00 AM",
"02:30 PM",
"05:00 PM",
],
},
{
id: 6,
name: "Dr. Anjali Rao",
specialty: "Gynecologist",
experience: "11 years experience",
locations: [
"Women's Care Hospital",
"City Health Clinic",
],
times: [
"09:30 AM",
"12:30 PM",
"03:30 PM",
"05:30 PM",
],
},
];

const [selectedDoctor, setSelectedDoctor] = useState(null);
const [date, setDate] = useState("");
const [time, setTime] = useState("");
const [place, setPlace] = useState("");
const [appointment, setAppointment] = useState(null);
const [appointments, setAppointments] = useState([]);
const [loading, setLoading] = useState(false);
const [loadingAppointments, setLoadingAppointments] = useState(false);

useEffect(() => {
  if (user?.id) {
    loadAppointments();
  }
}, [user?.id]);

async function loadAppointments() {
  try {
    setLoadingAppointments(true);

    const response = await fetch(
      `http://localhost:8080/api/appointments/user/${user.id}`
    );

    if (!response.ok) {
      throw new Error("Could not load appointments");
    }

    const data = await response.json();
    setAppointments(data);

  } catch (error) {
    console.error("Load appointments error:", error);
  } finally {
    setLoadingAppointments(false);
  }
}

function selectDoctor(doctor) {
  setSelectedDoctor(doctor);
  setTime("");
  setPlace("");
}

async function bookAppointment() {
  if (!user?.id) {
    alert("User information is missing. Please login again.");
    return;
  }

  if (!selectedDoctor || !date || !time || !place) {
    alert("Please select doctor, date, time and place.");
    return;
  }

  const appointmentData = {
    userId: user.id,
    patientName: user.name,
    patientEmail: user.email,
    doctorName: selectedDoctor.name,
    specialty: selectedDoctor.specialty,
    appointmentDate: date,
    appointmentTime: time,
    place: place,
  };

  console.log("Sending appointment data:", appointmentData);

  try {
    setLoading(true);

    const response = await fetch(
      "http://localhost:8080/api/appointments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      }
    );

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : data.message || "Failed to book appointment"
      );
    }

    console.log("Appointment saved:", data);

    setAppointment(data);
    setAppointments((previous) => [data, ...previous]);

    setSelectedDoctor(null);
    setDate("");
    setTime("");
    setPlace("");

    alert("Appointment booked successfully!");

  } catch (error) {
    console.error("Appointment booking error:", error);
    alert(error.message || "Could not save appointment.");
  } finally {
    setLoading(false);
  }
}

async function cancelAppointment(id) {
  if (!id) return;

  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this appointment?"
  );

  if (!confirmCancel) return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/appointments/${id}`,
      {
        method: "DELETE",
      }
    );

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : data.message || "Could not cancel appointment"
      );
    }

    setAppointments((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (appointment?.id === id) {
      setAppointment(null);
    }

    alert("Appointment cancelled successfully!");

  } catch (error) {
    console.error("Cancel appointment error:", error);
    alert(error.message || "Could not cancel appointment.");
  }
}

return (
  <div>

    <h2>
      Book a Doctor Appointment
    </h2>

    <p>
      Select a doctor, choose your preferred date and
      time, and select where you want to meet the doctor.
    </p>

    <h3>
      Available Doctors
    </h3>

    <div className="doctor-grid">

      {doctors.map((doctor) => (
        <div
          key={doctor.id}
          className="panel doctor-card"
          style={{
            border:
              selectedDoctor?.id === doctor.id
                ? "2px solid #2563eb"
                : "1px solid #ddd",
            cursor: "pointer",
          }}
          onClick={() => selectDoctor(doctor)}
        >

          <h3>
            {doctor.name}
          </h3>

          <p>
            <strong>
              {doctor.specialty}
            </strong>
          </p>

          <p>
            {doctor.experience}
          </p>

          <p>
            <strong>
              Available at:
            </strong>
          </p>

          <ul>
            {doctor.locations.map(
              (location, index) => (
                <li key={index}>
                  {location}
                </li>
              )
            )}
          </ul>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              selectDoctor(doctor);
            }}
          >
            {selectedDoctor?.id === doctor.id
              ? "Selected"
              : "Select Doctor"}
          </button>

        </div>
      ))}

    </div>

    {selectedDoctor && (
      <div className="panel">

        <h3>
          Book with {selectedDoctor.name}
        </h3>

        <p>
          <strong>
            Specialization:
          </strong>{" "}
          {selectedDoctor.specialty}
        </p>

        <label>
          <strong>
            Select Date
          </strong>
        </label>

        <br />

        <input
          type="date"
          value={date}
          min={
            new Date()
              .toISOString()
              .split("T")[0]
          }
          onChange={(e) => setDate(e.target.value)}
        />

        <br />
        <br />

        <label>
          <strong>
            Select Time
          </strong>
        </label>

        <br />

        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
        >

          <option value="">
            -- Select Time --
          </option>

          {selectedDoctor.times.map(
            (doctorTime, index) => (
              <option
                key={index}
                value={doctorTime}
              >
                {doctorTime}
              </option>
            )
          )}

        </select>

        <br />
        <br />

        <label>
          <strong>
            Select Place
          </strong>
        </label>

        <br />

        <select
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        >

          <option value="">
            -- Select Place --
          </option>

          {selectedDoctor.locations.map(
            (location, index) => (
              <option
                key={index}
                value={location}
              >
                {location}
              </option>
            )
          )}

        </select>

        <br />
        <br />

        <button
          onClick={bookAppointment}
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>

      </div>
    )}

    {appointment && (
      <div className="panel">

        <h3>
          Appointment Confirmed
        </h3>

        <p>
          Your appointment has been successfully booked.
        </p>

        <p>
          <strong>Doctor:</strong>{" "}
          {appointment.doctorName}
        </p>

        <p>
          <strong>Specialization:</strong>{" "}
          {appointment.specialty}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {appointment.appointmentDate}
        </p>

        <p>
          <strong>Time:</strong>{" "}
          {appointment.appointmentTime}
        </p>

        <p>
          <strong>Place:</strong>{" "}
          {appointment.place}
        </p>

        <p className="success">
          ✓ Appointment Confirmed
        </p>

        <button
          onClick={() => cancelAppointment(appointment.id)}
        >
          Cancel Appointment
        </button>

      </div>
    )}

    <div className="panel">

      <h3>
        My Saved Appointments
      </h3>

      {loadingAppointments ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments saved yet.</p>
      ) : (
        appointments.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >

            <p>
              <strong>Doctor:</strong>{" "}
              {item.doctorName}
            </p>

            <p>
              <strong>Specialization:</strong>{" "}
              {item.specialty}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {item.appointmentDate}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {item.appointmentTime}
            </p>

            <p>
              <strong>Place:</strong>{" "}
              {item.place}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {item.status}
            </p>

            <button
              onClick={() => cancelAppointment(item.id)}
            >
              Cancel Appointment
            </button>

          </div>
        ))
      )}

    </div>

  </div>
);
}

/* =========================
AI ASSISTANT
============================*/
function Assistant({ user }) {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {

    if (!question.trim()) {
      alert("Please enter your question.");
      return;
    }

    if (!user?.id) {
      alert("User information is missing. Please login again.");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {

      const response = await fetch(
        "http://localhost:8080/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            userId: user.id,
            question: question.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data || "AI request failed"
        );
      }

      setAnswer(data.answer);

      // Clear question after successful request
      setQuestion("");

    } catch (error) {

      console.error("AI Error:", error);

      setAnswer(
        "Sorry, I could not connect to the AI assistant."
      );

    } finally {

      setLoading(false);
    }
  }


  return (
    <div className="assistant-page">

      <h2>AI Health Assistant</h2>

      <p>
        Ask questions about general health and wellness.
      </p>


      <div className="panel">

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your health question..."
          rows="5"
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            resize: "vertical",
            fontSize: "16px"
          }}
        />


        <button
          onClick={askAI}
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>


        {answer && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              borderRadius: "12px",
              background: "#f5f9fc",
              lineHeight: "1.7"
            }}
          >

            <h3>AI Answer</h3>

            <p>
              {answer}
            </p>

          </div>
        )}

      </div>

    </div>
  );
}


/* =========================
EXPORT APP
=========================== */

export default App;