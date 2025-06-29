import React, { useRef, useEffect } from "react";
import "./App.css";

function App() {
    useEffect(() => {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let offsetX = 0;
        let offsetY = 0;

        const handleMouseDown = (e) => {
            e.preventDefault(); // prevent selection
            isDragging = true;
            // Get current values of CSS variables
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
                <h1>Yeah!</h1>
            </div>
        </div>
    );
}

export default App;
