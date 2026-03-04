import os, sys
os.chdir('/Users/melinaant/Desktop/product')
import http.server, socketserver
PORT = 4321
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
