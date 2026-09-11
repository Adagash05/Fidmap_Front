import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const UserForm = ({ formData, handleChange, nextStep }) => {
  return (
    <div className="fm-auth-page">
      <Link
        to="/"
        className="fm-brand fm-auth-brand"
        style={{ textDecoration: "none" }}
      >
        <div className="fm-brand-mark">
          <Compass size={18} />
        </div>
        <div className="fm-brand-name fm-display">fidmap</div>
      </Link>

      <form className="fm-auth-card">
        <h1 className="fm-display fm-auth-title">Create your FIDMAP account</h1>
        <p className="fm-auth-subtitle">Step 1 of 2 — your details</p>

        <div className="fm-field">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>

        <div className="fm-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="youremail@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>

        <div className="fm-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>

        <button
          type="button"
          className="fm-btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={nextStep}
        >
          Next
        </button>

        <p className="fm-auth-footer-line">
          Already have an account? <Link to="/sign-in">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default UserForm;
