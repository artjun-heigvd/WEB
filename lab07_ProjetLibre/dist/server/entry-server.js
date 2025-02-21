import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
const sheep = "/assets/1216139922123941827lemmling_Cartoon_sheep.svg.med-CKMfquXX.png";
const heart = "/assets/heart_shiny-BaHVKhX8.png";
function App() {
  const [count, setCount] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [heartStyle, setHeartStyle] = useState({});
  const handleClick = () => {
    setCount((count2) => count2 + 1);
    setIsPulsing(true);
    setShowHeart(true);
    setHeartStyle({
      left: `calc(50% + ${Math.random() * 100}px)`,
      // random position between -20px and 20px from the center
      top: `calc(50% + ${Math.random() * 100 - 100}px)`
      // random position between -20px and 20px from the center
    });
    setTimeout(() => {
      setIsPulsing(false);
      setShowHeart(false);
    }, 500);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h1", { children: "Click to pet!" }),
    /* @__PURE__ */ jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsx("img", { src: sheep, onClick: handleClick, alt: "animal to love", className: `${isPulsing ? "pulse" : ""} ${isClicked ? "sheep-clicked" : ""}` }),
      showHeart && /* @__PURE__ */ jsx("img", { src: heart, className: "heart", alt: "heart", style: heartStyle }),
      /* @__PURE__ */ jsxs("p", { className: "font", children: [
        "I received ",
        count,
        " pets"
      ] })
    ] })
  ] });
}
function render() {
  const html = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(App, {}) })
  );
  return { html };
}
export {
  render
};
