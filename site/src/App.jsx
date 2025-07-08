import React, { useEffect, useState } from "react";
import "./App.css";

const tileSize = 30;

const elements = [
    {
        id: 1,
        label: "Frame Loop Block",
        position: { x: 0, y: 0 },
        enabledProperties: [
            "label", "id"
        ],
    },
    {
        id: 2,
        label: "Frame Loop Block",
        position: { x: 2, y: 1 },
        enabledProperties: [
            "label", "id"
        ],
    },
    {
        id: 3,
        label: "Frame Loop Block",
        position: { x: -1, y: -2 },
        enabledProperties: [
            "label", "id"
        ],
    },
];

function App() {
    const [screenCenter, setScreenCenter] = useState({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    });

    useEffect(() => {
        const updateCenter = () => {
            setScreenCenter({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            });
        };
        window.addEventListener("resize", updateCenter);
        return () => window.removeEventListener("resize", updateCenter);
    }, []);

    useEffect(() => {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let offsetX = 0;
        let offsetY = 0;

        const handleMouseDown = (e) => {
            e.preventDefault();
            isDragging = true;

            const root = document.documentElement;
            offsetX =
                parseInt(
                    getComputedStyle(root).getPropertyValue("--grid-x-pos")
                ) || 0;
            offsetY =
                parseInt(
                    getComputedStyle(root).getPropertyValue("--grid-y-pos")
                ) || 0;

            startX = e.clientX;
            startY = e.clientY;
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            const newX = offsetX + deltaX;
            const newY = offsetY + deltaY;

            document.documentElement.style.setProperty(
                "--grid-x-pos",
                `${newX}px`
            );
            document.documentElement.style.setProperty(
                "--grid-y-pos",
                `${newY}px`
            );
        };

        const handleMouseUp = () => {
            isDragging = false;
        };

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <div className="App">
            <div className="grid">
                {elements.map((el) => {
                    const px = screenCenter.x + el.position.x * tileSize;
                    const py = screenCenter.y + el.position.y * tileSize;
                    return (
                        <button
                            key={el.id}
                            className="grid-element"
                            style={{
                                left: `${px}px`,
                                top: `${py}px`,
                            }}
                        >
                            <span>{el.label}</span>
                            <br></br>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
