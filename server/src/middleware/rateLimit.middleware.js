import rateLimit from "express-rate-limit";


export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { error: "Too many requests from this IP. Please try again after 15 minutes." },
    standardHeaders: true, 
    legacyHeaders: false, 
});

//rate limiter for auth
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 failed login/signup attempts per windowMs
    message: { error: "Too many authentication attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});
