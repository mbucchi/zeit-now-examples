import datetime
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        # returns current day time
        self.wfile.write(str(datetime.datetime.now()).encode())
        return
