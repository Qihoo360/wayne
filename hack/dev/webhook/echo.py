#!/usr/bin/env python

import SimpleHTTPServer
import SocketServer

PORT = 8000

class GetHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        print(self.headers)
        self.send_response(200, "")
    def do_POST(self):
        print(self.headers)
        content_length = self.headers.getheaders('content-length')
        length = int(content_length[0]) if content_length else 0
        print(self.rfile.read(length))
        self.send_response(200, "")

Handler = GetHandler
httpd = SocketServer.TCPServer(("", PORT), Handler)
httpd.serve_forever()