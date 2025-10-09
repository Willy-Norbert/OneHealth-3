// Build ICE servers from env with safe defaults.
// WEBRTC_TURN_URLS: comma-separated list (e.g., "turns:turn.example.com:5349,turn:turn.example.com:3478")
// WEBRTC_TURN_USER / WEBRTC_TURN_PASS: long-term credentials
function buildIceServers() {
  const servers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];

  const raw = process.env.WEBRTC_TURN_URLS || "";
  const user = process.env.WEBRTC_TURN_USER || process.env.TURN_USERNAME || "";
  const pass = process.env.WEBRTC_TURN_PASS || process.env.TURN_PASSWORD || "";
  if (raw && user && pass) {
    raw.split(',').map(s => s.trim()).filter(Boolean).forEach(url => {
      servers.push({ urls: url, username: user, credential: pass });
    });
  }
  return servers;
}

const webrtcConfig = {
  iceServers: buildIceServers(),
};

module.exports = { webrtcConfig };
