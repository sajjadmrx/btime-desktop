import { useEffect, useState } from "react";
import { Slider } from "./components/slider";
import { IconButton } from "@material-tailwind/react";

function App() {
  const [showArrows, setShowArrows] = useState<boolean>(false);

  function onMouseEnter() {
    setShowArrows(true);
  }

  function onMouseLave() {
    setShowArrows(false);
  }

  useEffect(() => {
    const handleColorSchemeChange = (e) => {
      document.documentElement.classList.remove("dark");
      if (e.matches) {
        document.documentElement.classList.add("dark");
      }
    };

    const colorSchemeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    handleColorSchemeChange(colorSchemeMediaQuery);
    colorSchemeMediaQuery.addEventListener("change", handleColorSchemeChange);
    return () => {
      colorSchemeMediaQuery.removeEventListener(
        "change",
        handleColorSchemeChange
      );
    };
  }, []);

  return (
    <>
      <div
        className="h-screen w-screen"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLave}
      >
        <div className={`fixed inline bottom-[140px] left-2 moveable`}>
          <IconButton
            variant="text"
            color="blue-gray"
            size="sm"
            className={` moveable ${!showArrows && "hidden"} `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="h-6 w-6 test"
            >
              <g id="move / Chevron_Right_MD">
                <path
                  id="Vector"
                  d="M12 21V12M12 21L15 18M12 21L9 18M12 12V3M12 12H3M12 12H21M12 3L9 6M12 3L15 6M3 12L6 15M3 12L6 9M21 12L18 9M21 12L18 15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </IconButton>
        </div>
        <Slider showArrows={showArrows} />
      </div>
    </>
  );
}

export default App;
