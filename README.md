# predictive-push
Express middleware to predictively push resources using HTTP/2

# WARNING: this is only an experiment
This was a simple experiment for me to learn a little more about H2 push in Node/Express.

I used it to test the idea of statistically modelling the likihood of certain assets being requested from a host, based on previously requested resources. It turns out that the approach I've used isn't the right fit.

BUT... the idea is valid. Akamai are already doing this at a much larger, production-ready, scale: http://calendar.perfplanet.com/2016/http2-push-the-details/
