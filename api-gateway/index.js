const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");


const app = express();

console.log(" FILE STARTED");

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use((req, res, next) => {
  console.log("GATEWAY HIT:", req.method, req.url);
  next();
});

// Budget Service
app.use("/api/budget", createProxyMiddleware({
  target: "http://localhost:5009",
  changeOrigin: true,

  pathRewrite: (path, req) => {
    const newPath = "/api/Budget" + path.replace("/api/budget", "");
    console.log(" FINAL PATH:", newPath); // DEBUG
    return newPath;
  },

  logLevel: "debug"
}));

// Auth Service
app.use("/api/auth", createProxyMiddleware({
  target: "http://localhost:5000",
  changeOrigin: true,
  pathRewrite: {
    "^/api/auth": "",
  },
}));

// Booking Service
app.use("/api/book", createProxyMiddleware({
  target: "http://127.0.0.1:6500",
  changeOrigin: true,
  pathRewrite: {
    "^/api/book": "",
  },

  // FORCE HEADERS (IMPORTANT)
  onProxyReq: (proxyReq, req, res) => {
    if (req.headers.authorization) {
      proxyReq.setHeader("Authorization", req.headers.authorization);
    }
  },

  logLevel: "debug",
}));

// Attendee Service
app.use("/api/attendee", createProxyMiddleware({
  target: "http://localhost:7200",
  changeOrigin: true,
  pathRewrite: {
    "^/api/attendee": "",
  },

 
  onProxyReq: (proxyReq, req, res) => {
    if (req.headers.authorization) {
      proxyReq.setHeader("Authorization", req.headers.authorization);
    }
    if (req.headers.role) {
      proxyReq.setHeader("role", req.headers.role);
    }
  },

}));



// Event-Service
app.use("/api", (req, res, next) => {
  if (req.originalUrl.startsWith("/api/budget")) {
    return next(); //  skip budget
  }

  return createProxyMiddleware({
    target: "http://localhost:8080",
    changeOrigin: true,
    pathRewrite: (path) => path.replace("/api", ""),
  })(req, res, next);
});




app.listen(4000, () => console.log("API Gateway running on 4000"));
