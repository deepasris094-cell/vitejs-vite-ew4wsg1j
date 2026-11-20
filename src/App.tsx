
import { useState } from "react";
import type { FormEvent } from "react";
import "./index.css";

type Role = "Student" | "Recruiter" | "Admin";

type Job = {
  id: number;
  title: string;
  company: string;
  type: string;
  location: string;
  salary: string;
  category: string;
};

type Application = {
  jobId: number;
  title: string;
  company: string;
  user: string;
  status: string;
};

const initialJobs: Job[] = [
  { id: 1, title: "Frontend Developer Intern", company: "TechNova", type: "Internship", location: "Chennai", salary: "₹12,000/month", category: "IT" },
  { id: 2, title: "Python Developer", company: "CodeSphere", type: "Placement", location: "Bangalore", salary: "₹4–6 LPA", category: "IT" },
  { id: 3, title: "Data Analyst Intern", company: "DataWorks", type: "Internship", location: "Remote", salary: "₹10,000/month", category: "Data Science" },
  { id: 4, title: "UI/UX Designer", company: "Creative Labs", type: "Placement", location: "Chennai", salary: "₹3–5 LPA", category: "Design" },
  { id: 5, title: "Java Developer Intern", company: "InnovateTech", type: "Internship", location: "Coimbatore", salary: "₹15,000/month", category: "IT" },
  { id: 6, title: "Business Analyst", company: "Future Solutions", type: "Placement", location: "Remote", salary: "₹5–7 LPA", category: "Business" }
];

export default function App() {
  const [page, setPage] = useState("Home");
  const [role, setRole] = useState<Role>("Student");
  const [user, setUser] = useState(localStorage.getItem("sbUser") || "");
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(
    JSON.parse(localStorage.getItem("sbApplications") || "[]")
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const [resume, setResume] = useState("");

  function go(name: string) {
    setPage(name);
    setNotice("");
  }

  function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || data.get("email"));
    setUser(name);
    localStorage.setItem("sbUser", name);
    setNotice("Welcome to SkillBridge!");
    setPage("Dashboard");
  }

  function logout() {
    setUser("");
    localStorage.removeItem("sbUser");
    setPage("Home");
    setNotice("You have logged out.");
  }

  function apply(job: Job) {
    if (!user) {
      setNotice("Please login before applying.");
      setPage("Login");
      return;
    }

    if (applications.some(a => a.jobId === job.id && a.user === user)) {
      setNotice("You have already applied for this opportunity.");
      return;
    }

    const updated = [
      ...applications,
      {
        jobId: job.id,
        title: job.title,
        company: job.company,
        user,
        status: "Under Review"
      }
    ];

    setApplications(updated);
    localStorage.setItem("sbApplications", JSON.stringify(updated));
    setNotice("Your application was submitted successfully!");
  }

  function addJob(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const newJob: Job = {
      id: Date.now(),
      title: String(data.get("title")),
      company: String(data.get("company")),
      type: String(data.get("type")),
      location: String(data.get("location")),
      salary: String(data.get("salary")),
      category: String(data.get("category"))
    };

    setJobs(previous => [newJob, ...previous]);
    setNotice("New opportunity published successfully!");
    e.currentTarget.reset();
  }

  const filteredJobs = jobs.filter(job => {
    const text = `${job.title} ${job.company} ${job.location} ${job.category}`;
    const matchesSearch = text.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || job.type === filter;
    return matchesSearch && matchesFilter;
  });

  const myApplications = applications.filter(a => a.user === user);

  return (
    <div className="app">

      <header className="navbar">
        <div className="brand" onClick={() => go("Home")}>
          <span className="brand-icon">S</span>
          Skill<span>Bridge</span>
        </div>

        <nav>
          {["Home", "Opportunities", "About"].map(item => (
            <button key={item} onClick={() => go(item)}
              className={page === item ? "active" : ""}>
              {item}
            </button>
          ))}

          {user && (
            <>
              <button onClick={() => go("Dashboard")}>Dashboard</button>
              <button onClick={() => go("Applications")}>Applications</button>
            </>
          )}

          {user && role === "Recruiter" &&
            <button onClick={() => go("Post Job")}>Post Job</button>}

          {user && role === "Admin" &&
            <button onClick={() => go("Admin")}>Admin</button>}
        </nav>

        <div className="nav-right">
          {user ? (
            <>
              <span className="welcome">Hi, {user}</span>
              <button className="outline-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="outline-btn" onClick={() => go("Login")}>Login</button>
              <button className="primary-btn" onClick={() => go("Register")}>Get Started</button>
            </>
          )}
        </div>
      </header>

      {notice && (
        <div className="notice">
          {notice}
          <button onClick={() => setNotice("")}>×</button>
        </div>
      )}

      <main>

        {page === "Home" && (
          <>
            <section className="hero">
              <div className="hero-content">
                <span className="tag">YOUR CAREER STARTS HERE</span>

                <h1>
                  Bridge Your Skills<br />
                  To Your <span>Dream Career.</span>
                </h1>

                <p>
                  Discover internships, explore job opportunities,
                  connect with recruiters and take the next step
                  towards your professional future.
                </p>

                <div className="hero-buttons">
                  <button className="primary-btn large"
                    onClick={() => go("Opportunities")}>
                    Explore Opportunities →
                  </button>

                  <button className="outline-btn large"
                    onClick={() => go("Register")}>
                    Join SkillBridge
                  </button>
                </div>

                <div className="stats">
                  <div><strong>500+</strong><small>Opportunities</small></div>
                  <div><strong>100+</strong><small>Companies</small></div>
                  <div><strong>1000+</strong><small>Students</small></div>
                </div>
              </div>

              <div className="hero-art">
                <div className="art-card">
                  <div className="art-symbol">🚀</div>
                  <h3>Your Future Starts Today</h3>
                  <p>Skills + Opportunities = Success</p>
                  <div className="progress"><span /></div>
                  <small>Career growth in progress...</small>
                </div>
                <div className="floating one">💼 Job Ready</div>
                <div className="floating two">⭐ New Opportunities</div>
              </div>
            </section>

            <section className="section">
              <div className="section-heading">
                <span className="tag">WHAT WE OFFER</span>
                <h2>Everything You Need to Grow</h2>
                <p>One platform connecting students and recruiters.</p>
              </div>

              <div className="feature-grid">
                {[
                  ["🎓", "Internships", "Find internships to gain practical experience."],
                  ["💼", "Placements", "Explore jobs from different companies."],
                  ["📄", "Resume Upload", "Showcase your skills with your resume."],
                  ["📊", "Track Applications", "Monitor your application status."]
                ].map(item => (
                  <div className="feature-card" key={item[1]}>
                    <div className="feature-icon">{item[0]}</div>
                    <h3>{item[1]}</h3>
                    <p>{item[2]}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {page === "Opportunities" && (
          <section className="section page-section">
            <span className="tag">FIND YOUR NEXT STEP</span>
            <h1>Internships & Placements</h1>
            <p className="muted">Discover opportunities that match your interests.</p>

            <div className="search-row">
              <input
                placeholder="Search job, company or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <select value={filter} onChange={e => setFilter(e.target.value)}>
                <option>All</option>
                <option>Internship</option>
                <option>Placement</option>
              </select>
            </div>

            <div className="job-grid">
              {filteredJobs.map(job => (
                <div className="job-card" key={job.id}>
                  <span className="job-type">{job.type}</span>
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>

                  <div className="job-details">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                    <span>🏷️ {job.category}</span>
                  </div>

                  <button className="primary-btn full"
                    onClick={() => apply(job)}>
                    Apply Now →
                  </button>
                </div>
              ))}

              {filteredJobs.length === 0 &&
                <p>No matching opportunities found.</p>}
            </div>
          </section>
        )}

        {(page === "Login" || page === "Register") && (
          <section className="auth-section">
            <form className="auth-card" onSubmit={login}>
              <span className="tag">
                {page === "Login" ? "WELCOME BACK" : "JOIN OUR COMMUNITY"}
              </span>

              <h1>{page === "Login" ? "Login to SkillBridge" : "Create Account"}</h1>
              <p className="muted">Start your career journey with us.</p>

              <label>{page === "Login" ? "Your Name" : "Full Name"}</label>
              <input name="name" placeholder="Enter your name" required />

              <label>Email Address</label>
              <input name="email" type="email" placeholder="Enter email" required />

              <label>Password</label>
              <input name="password" type="password" minLength={6}
                placeholder="Enter password" required />

              <label>Select Your Role</label>
              <select value={role} onChange={e => setRole(e.target.value as Role)}>
                <option>Student</option>
                <option>Recruiter</option>
                <option>Admin</option>
              </select>

              <button className="primary-btn full">
                {page === "Login" ? "Login →" : "Create Account →"}
              </button>

              <p className="muted">
                {page === "Login" ? "New here? " : "Already registered? "}
                <a onClick={() => go(page === "Login" ? "Register" : "Login")}>
                  {page === "Login" ? "Create an account" : "Login"}
                </a>
              </p>
            </form>
          </section>
        )}

        {page === "Dashboard" && (
          <section className="section page-section">
            <span className="tag">YOUR WORKSPACE</span>
            <h1>Welcome, {user}!</h1>
            <p className="muted">Manage your career journey from one place.</p>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <span>💼</span><h2>{jobs.length}</h2>
                <p>Available Opportunities</p>
              </div>
              <div className="dashboard-card">
                <span>📨</span><h2>{myApplications.length}</h2>
                <p>My Applications</p>
              </div>
              <div className="dashboard-card">
                <span>📄</span><h2>{resume ? "Uploaded" : "Pending"}</h2>
                <p>Resume Status</p>
              </div>
            </div>

            <div className="feature-card resume-box">
              <h3>📄 Upload Your Resume</h3>
              <p className="muted">Choose your resume in PDF or DOC format.</p>
              <input type="file" accept=".pdf,.doc,.docx"
                onChange={e => setResume(e.target.files?.[0]?.name || "")} />
              {resume && <p className="success">Selected: {resume}</p>}
            </div>

            <button className="primary-btn"
              onClick={() => go("Opportunities")}>
              Browse Opportunities →
            </button>
          </section>
        )}

        {page === "Applications" && (
          <section className="section page-section">
            <span className="tag">APPLICATION TRACKER</span>
            <h1>My Applications</h1>

            <div className="application-list">
              {myApplications.map((a, i) => (
                <div className="application-card" key={i}>
                  <div>
                    <h3>{a.title}</h3>
                    <p>{a.company}</p>
                  </div>
                  <span className="status">{a.status}</span>
                </div>
              ))}

              {myApplications.length === 0 &&
                <p className="muted">You haven't applied for any opportunities yet.</p>}
            </div>
          </section>
        )}

        {page === "Post Job" && (
          <section className="auth-section">
            <form className="auth-card" onSubmit={addJob}>
              <span className="tag">RECRUITER WORKSPACE</span>
              <h1>Post an Opportunity</h1>

              <label>Job Title</label>
              <input name="title" placeholder="Enter job title" required />

              <label>Company Name</label>
              <input name="company" placeholder="Company name" required />

              <label>Opportunity Type</label>
              <select name="type">
                <option>Internship</option>
                <option>Placement</option>
              </select>

              <label>Location</label>
              <input name="location" placeholder="Chennai / Remote" required />

              <label>Salary / Stipend</label>
              <input name="salary" placeholder="₹15,000/month" required />

              <label>Category</label>
              <input name="category" placeholder="IT / Design / Business" required />

              <button className="primary-btn full">
                Publish Opportunity →
              </button>
            </form>
          </section>
        )}

        {page === "Admin" && (
          <section className="section page-section">
            <span className="tag">ADMIN CONTROL PANEL</span>
            <h1>Admin Dashboard</h1>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <span>💼</span><h2>{jobs.length}</h2>
                <p>Total Opportunities</p>
              </div>
              <div className="dashboard-card">
                <span>📨</span><h2>{applications.length}</h2>
                <p>Total Applications</p>
              </div>
              <div className="dashboard-card">
                <span>👥</span><h2>{user ? 1 : 0}</h2>
                <p>Current Session</p>
              </div>
            </div>

            <h2>Posted Opportunities</h2>
            {jobs.map(job => (
              <div className="application-card" key={job.id}>
                <div><h3>{job.title}</h3><p>{job.company}</p></div>
                <button className="delete-btn"
                  onClick={() => setJobs(previous => previous.filter(j => j.id !== job.id))}>
                  Remove
                </button>
              </div>
            ))}
          </section>
        )}

        {page === "About" && (
          <section className="section page-section about">
            <span className="tag">ABOUT OUR PLATFORM</span>
            <h1>About SkillBridge</h1>
            <p>
              SkillBridge is an internship and placement portal designed
              to connect students, recruiters and administrators through
              a single digital platform.
            </p>

            <div className="feature-grid">
              <div className="feature-card">
                <h3>Our Mission</h3>
                <p>Help students discover career opportunities and develop professional skills.</p>
              </div>
              <div className="feature-card">
                <h3>Our Vision</h3>
                <p>Build a bridge between academic learning and industry requirements.</p>
              </div>
              <div className="feature-card">
                <h3>Our Goal</h3>
                <p>Make internship and placement information accessible and organized.</p>
              </div>
            </div>
          </section>
        )}

      </main>

      <footer>
        <h2>Skill<span>Bridge</span></h2>
        <p>Connecting Talent with Opportunities.</p>
        <small>© 2026 SkillBridge. Internship & Placement Portal.</small>
      </footer>

    </div>
  );
}
