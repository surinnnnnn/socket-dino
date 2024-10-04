export const scoreBroadcast = (uuid, payload) => {
     const { score } = payload;
     const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY)) || 0;
     if (score > highScore) {
          localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
     }

     return { status: "success", highScore, broadcast };
};
