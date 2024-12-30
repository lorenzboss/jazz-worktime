export function injectStyles() {
  let style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = `
      @keyframes unique-light-pulse-animation {
          from {
              transform: scale3d(1, 1, 1);
          }
          50% {
              transform: scale3d(1.05, 1.05, 1.05);
          }
          to {
              transform: scale3d(1, 1, 1);
          }
      }
      
      .unique-light-pulse {
          animation-name: unique-light-pulse-animation;
          animation-iteration-count: infinite;
          animation-duration: 3s;
          animation-fill-mode: both;
          border: 3px solid #84b2a6;
      }
      `;
  document.head.append(style);
}
