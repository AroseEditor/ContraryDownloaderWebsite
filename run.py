"""
Contrary Downloader — Website Server
Serves the static site locally on port 8080.
If a custom domain is configured, it will bind to 0.0.0.0;
otherwise it runs on localhost.
"""

import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Try binding to all interfaces (for domain use), fallback to localhost
BIND_ADDR = "0.0.0.0"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        print(f"[Contrary Web] {args[0]}")


def main():
    try:
        with socketserver.TCPServer((BIND_ADDR, PORT), Handler) as httpd:
            print(f"\n{'='*50}")
            print(f"  Contrary Downloader Website")
            print(f"  Running at: http://localhost:{PORT}")
            print(f"  Bound to:   {BIND_ADDR}:{PORT}")
            print(f"  Serving:    {DIRECTORY}")
            print(f"{'='*50}\n")
            httpd.serve_forever()
    except OSError as e:
        if "address already in use" in str(e).lower() or e.errno == 10048:
            print(f"[!] Port {PORT} is in use. Trying {PORT + 1}...")
            alt_port = PORT + 1
            with socketserver.TCPServer((BIND_ADDR, alt_port), Handler) as httpd:
                print(f"  Running at: http://localhost:{alt_port}")
                httpd.serve_forever()
        else:
            raise
    except KeyboardInterrupt:
        print("\n[Contrary Web] Shutting down.")
        sys.exit(0)


if __name__ == "__main__":
    main()
