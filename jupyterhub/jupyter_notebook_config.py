c.NotebookApp.tornado_settings = {
    "headers": {
        "Content-Security-Policy": "frame-ancestors 'self' http://localhost:3000 http://localhost; report-uri /api/security/csp-report"
    }
}
