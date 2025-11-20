import { useState, useEffect } from "react";

type ABVariant = "manual" | "mapbox";

export const useABTest = () => {
    const [variant, setVariant] = useState<ABVariant | null>(null);

    useEffect(() => {
        // Check localStorage first
        const savedVariant = localStorage.getItem("ab_variant") as ABVariant | null;

        if (savedVariant) {
            setVariant(savedVariant);
        } else {
            // Assign randomly and save
            const newVariant = Math.random() < 0.5 ? "manual" : "mapbox";
            setVariant(newVariant);
            localStorage.setItem("ab_variant", newVariant);
        }
    }, []);

    return variant;
};
