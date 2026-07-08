import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }
        if (password.length < 6) {
            return setError("Password must be at least 6 characters long.");
        }

        setSubmitting(true);
        try {
            await register(email, password);
            navigate("/"); 
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Create Account</h2>
                    <p style={styles.subtitle}>Set up your personal ClipCode workspace</p>
                </div>

                {error && <div style={styles.errorAlert}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        style={submitting ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
                    >
                        {submitting ? "Creating workspace..." : "Register"}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Already have an account?{" "}
                        <Link to="/login" style={styles.link}>
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "var(--bg)",
        minHeight: "calc(100vh - 80px)",
    },
    card: {
        width: "100%",
        maxWidth: "420px",
        padding: "32px",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        background: "var(--bg)",
        boxShadow: "var(--shadow)",
        textAlign: "left",
    },
    header: {
        marginBottom: "24px",
    },
    title: {
        margin: "0 0 6px 0",
        fontSize: "28px",
        fontWeight: "600",
        color: "var(--text-h)",
    },
    subtitle: {
        margin: 0,
        fontSize: "14px",
        color: "var(--text)",
    },
    errorAlert: {
        padding: "12px 16px",
        borderRadius: "6px",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "#ef4444",
        fontSize: "13px",
        marginBottom: "20px",
        border: "1px solid rgba(239, 68, 68, 0.2)",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    label: {
        fontSize: "13px",
        fontWeight: "500",
        color: "var(--text-h)",
    },
    input: {
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid var(--border)",
        background: "var(--code-bg)",
        color: "var(--text-h)",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.15s ease",
    },
    button: {
        padding: "11px 16px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "var(--accent)",
        color: "white",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "10px",
        transition: "opacity 0.15s ease",
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: "not-allowed",
    },
    footer: {
        marginTop: "24px",
        textAlign: "center",
        borderTop: "1px solid var(--border)",
        paddingTop: "16px",
    },
    footerText: {
        margin: 0,
        fontSize: "13px",
        color: "var(--text)",
    },
    link: {
        color: "var(--accent)",
        textDecoration: "none",
        fontWeight: "500",
    },
};

export default Register;
