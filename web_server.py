#!/usr/bin/env python3
import http.server
import socketserver
import sys
import os

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stdout.write(f"{self.log_date_time_string()} - {format%args}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    # Use the current directory
    # os.chdir('/home/user/webapp')
    
    PORT = 8000
    with socketserver.TCPServer(("0.0.0.0", PORT), MyHandler) as httpd:
        print(f"Server running on port {PORT}")
        sys.stdout.flush()
        httpd.serve_forever()