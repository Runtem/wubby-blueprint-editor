import React, { useEffect, useState } from "react";
import "./App.css";

const tileSize = 30;

const initialElements = [
    {
        id: 1,
        label: "Frame Loop Block",
        position: { x: 0, y: 0 },
        enabledProperties: ["label", "id"],
    },
    {
        id: 2,
        label: "Frame Loop Block",
        position: { x: 10, y: 5 },
        enabledProperties: ["label", "id"],
    },
    {
        id: 3,
        label: "Frame Loop Block",
        position: { x: -7, y: -2 },
        enabledProperties: ["label", "id"],
    },
];

function App() {
    const [elements, setElements] = useState(initialElements);
    const [screenCenter, setScreenCenter] = useState({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    });
    const [selectedElementId, setSelectedElementId] = useState(null);

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
            if (
                e.target.tagName === "INPUT" ||
                e.target.tagName === "TEXTAREA" ||
                e.target.isContentEditable
            ) {
                return; // Don't start drag on input
            }
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

        const grid = document.querySelector(".grid");
        grid.addEventListener("mousedown", handleMouseDown);
        grid.addEventListener("mousemove", handleMouseMove);
        grid.addEventListener("mouseup", handleMouseUp);

        return () => {
            grid.removeEventListener("mousedown", handleMouseDown);
            grid.removeEventListener("mousemove", handleMouseMove);
            grid.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const selectedElement = elements.find((el) => el.id === selectedElementId);

    // Maintain fixed property order
    const propertyOrder = ["label", "id", "position"];

    // Update enabledProperties on toggle
    const handleCheckboxToggle = (prop) => {
        if (!selectedElement) return;

        let newEnabled;
        if (selectedElement.enabledProperties.includes(prop)) {
            newEnabled = selectedElement.enabledProperties.filter(
                (p) => p !== prop
            );
        } else {
            newEnabled = [...selectedElement.enabledProperties, prop];
            // Keep order consistent
            newEnabled = propertyOrder.filter((p) => newEnabled.includes(p));
        }

        setElements((els) =>
            els.map((el) =>
                el.id === selectedElement.id
                    ? { ...el, enabledProperties: newEnabled }
                    : el
            )
        );
    };

    // Handle changes for inputs
    const handleInputChange = (prop, value) => {
        if (!selectedElement) return;

        setElements((els) =>
            els.map((el) => {
                if (el.id !== selectedElement.id) return el;

                if (prop === "x" || prop === "y") {
                    return {
                        ...el,
                        position: {
                            ...el.position,
                            [prop]: Number(value),
                        },
                    };
                }

                return {
                    ...el,
                    [prop]: value,
                };
            })
        );
    };

    // Clicking a block selects it
    const handleClick = (el) => {
        setSelectedElementId(el.id);
    };

    // Render properties on the block button itself
    const renderBlockProperties = (el) => {
        const shownProps = propertyOrder.filter((p) =>
            el.enabledProperties.includes(p)
        );

        return (
            <>
                <div className="block-label">{el.label}</div>
                {shownProps.length > 0 && <hr className="separator-line" />}
                {shownProps.map((prop) => {
                    if (prop === "position") {
                        return (
                            <div key={prop}>
                                <strong>position:</strong> ({el.position.x},{" "}
                                {el.position.y})
                            </div>
                        );
                    }
                    return (
                        <div key={prop}>
                            <strong>{prop}:</strong> {el[prop]}
                        </div>
                    );
                })}
            </>
        );
    };

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
                            onClick={() => handleClick(el)}
                        >
                            {renderBlockProperties(el)}
                        </button>
                    );
                })}
            </div>

            {selectedElement && (
                <div className="properties-panel">
                    {/* ID - disabled input */}
                    <div className="property-row">
                        <label htmlFor="id">ID</label>
                        <input
                            id="id"
                            type="text"
                            value={selectedElement.id}
                            disabled
                            className="property-input"
                        />
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedElement.enabledProperties.includes(
                                    "id"
                                )}
                                onChange={() => handleCheckboxToggle("id")}
                            />
                        </label>
                    </div>

                    {/* Label */}
                    <div className="property-row">
                        <label htmlFor="label">Label</label>
                        <input
                            id="label"
                            type="text"
                            value={selectedElement.label}
                            onChange={(e) =>
                                handleInputChange("label", e.target.value)
                            }
                            className="property-input"
                        />
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedElement.enabledProperties.includes(
                                    "label"
                                )}
                                onChange={() => handleCheckboxToggle("label")}
                            />
                        </label>
                    </div>

                    {/* Position X & Y inline */}
                    <div className="property-row">
                        <label htmlFor="pos-x" className="pos-label">
                            Position
                        </label>
                        <input
                            id="pos-x"
                            type="number"
                            value={selectedElement.position.x}
                            onChange={(e) =>
                                handleInputChange("x", e.target.value)
                            }
                            className="property-input pos-input"
                        />
                        <input
                            id="pos-y"
                            type="number"
                            value={selectedElement.position.y}
                            onChange={(e) =>
                                handleInputChange("y", e.target.value)
                            }
                            className="property-input pos-input"
                        />
                        <label
                            className="checkbox-label"
                            style={{ marginLeft: "auto" }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedElement.enabledProperties.includes(
                                    "position"
                                )}
                                onChange={() =>
                                    handleCheckboxToggle("position")
                                }
                            />
                            
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
