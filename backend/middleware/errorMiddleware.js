export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, _req, res, _next) {
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Email or employee ID already exists" });
  }
  if (err instanceof Error && err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof Error && err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  const status = err.status || (err.code === "LIMIT_FILE_SIZE" ? 413 : 500);
  res.status(status).json({ message: status === 500 ? "Internal server error" : err.message });
}
