export interface MapboxLocation {
    city: string;
    state: string;
}

export function normalizeMapboxLocation(response: any): MapboxLocation {
    if (!response || !response.features || !Array.isArray(response.features)) {
        return { city: "", state: "" };
    }

    // Find the best matching feature
    const feature = response.features.find((f: any) => {
        const type = f.properties?.feature_type;
        const context = f.properties?.context;

        const hasValidType = ["place", "locality", "street"].includes(type);
        const hasContext = context && (context.place || context.region);

        return hasValidType && hasContext;
    }) || response.features[0]; // Fallback to first feature if no ideal match

    if (!feature) {
        return { city: "", state: "" };
    }

    const props = feature.properties || {};
    // In V5, context is often on the feature object itself, not inside properties.
    // But mapbox-gl-geocoder result usually has context at the top level of the feature.
    const context = feature.context || props.context;

    // Extract City
    let city = "";

    // Handle V6 (Object context)
    if (context && !Array.isArray(context) && typeof context === 'object') {
        if (context.place && context.place.name) {
            city = context.place.name;
        }
    }
    // Handle V5 (Array context)
    else if (Array.isArray(context)) {
        const place = context.find((c: any) => c.id.startsWith('place'));
        if (place) {
            city = place.text;
        }
    }

    // Fallbacks for City
    if (!city) {
        if (props.name_preferred) city = props.name_preferred;
        else if (props.name) city = props.name;
        else if (feature.text) city = feature.text; // V5 often has 'text' at top level
    }

    // Extract State
    let state = "";

    // Handle V6 (Object context)
    if (context && !Array.isArray(context) && typeof context === 'object') {
        if (context.region && context.region.name) {
            state = context.region.name;
        } else if (context.region && (context.region.region_code || context.region.region_code_full)) {
            state = context.region.region_code || context.region.region_code_full;
        }
    }
    // Handle V5 (Array context)
    else if (Array.isArray(context)) {
        const region = context.find((c: any) => c.id.startsWith('region'));
        if (region) {
            state = region.text;
        }
    }

    // Fallback for State from place_formatted
    if (!state && props.place_formatted) {
        const parts = props.place_formatted.split(",").map((p: string) => p.trim());
        if (parts.length > 1) {
            state = parts[parts.length - 2];
        }
    }

    return { city, state };
}
