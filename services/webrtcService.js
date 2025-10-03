const webrtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    // For production, you would typically include TURN servers here.
    // { urls: "turn:your-turn-server.com:3478", username: "user", credential: "password" },
  ],
};

module.exports = { webrtcConfig };
