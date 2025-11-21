import { normalizeMapboxLocation } from "./lib/mapbox";

const mockResponse = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                mapbox_id: "dXJuOm1ieHBsYzpJc2s",
                feature_type: "place",
                full_address: "Bogotá, Colombia",
                name: "Bogotá",
                name_preferred: "Bogotá",
                coordinates: {
                    longitude: -74.08175,
                    latitude: 4.60971,
                },
                place_formatted: "Bogotá, Colombia",
                context: {
                    place: {
                        id: "dXJuOm1ieHBsYzpJc2s",
                        name: "Bogotá",
                    },
                    region: {
                        id: "dXJuOm1ieHBsYzpMZnM",
                        name: "Bogotá",
                        region_code: "DC",
                        region_code_full: "CO-DC",
                    },
                    country: {
                        id: "dXJuOm1ieHBsYzoz",
                        name: "Colombia",
                        country_code: "CO",
                        country_code_alpha_3: "COL",
                    },
                },
            },
            geometry: {
                type: "Point",
                coordinates: [-74.08175, 4.60971],
            },
        },
    ],
};

const mockResponseVillamaria = {
    features: [
        {
            properties: {
                feature_type: "place",
                name: "Villamaría",
                place_formatted: "Villamaría, Caldas, Colombia",
                context: {
                    place: { name: "Villamaría" },
                    region: { name: "Caldas" }
                }
            }
        }
    ]
};

const mockResponseNoRegionName = {
    features: [
        {
            properties: {
                feature_type: "place",
                name: "Some Place",
                context: {
                    place: { name: "Some Place" },
                    region: { region_code: "XY" }
                }
            }
        }
    ]
};

const mockResponseV5 = {
    features: [
        {
            text: "Bogotá",
            place_name: "Bogotá, Colombia",
            context: [
                { id: "place.123", text: "Bogotá" },
                { id: "region.456", text: "Bogotá D.C." },
                { id: "country.789", text: "Colombia" }
            ]
        }
    ]
};

console.log("Test 1 (Bogota V6):", normalizeMapboxLocation(mockResponse));
console.log("Test 2 (Villamaria V6):", normalizeMapboxLocation(mockResponseVillamaria));
console.log("Test 3 (Region Code V6):", normalizeMapboxLocation(mockResponseNoRegionName));
console.log("Test 4 (Bogota V5):", normalizeMapboxLocation(mockResponseV5));
