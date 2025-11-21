import { useCallback } from "react";
import {
    UseFormRegister,
    FieldErrors,
    UseFormSetValue,
} from "react-hook-form";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { FormData } from "@/lib/schemas";

// Importación dinámica del componente Mapbox (solo en cliente)
const MapboxAddressInput = dynamic(
    () => import("./MapboxAddressInput"),
    {
        loading: () => (
            <p className="text-sm text-muted-foreground">Cargando mapa...</p>
        ),
        ssr: false, // Mapbox solo funciona en cliente
    }
);

interface LocationSectionProps {
    variant: "manual" | "mapbox";
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
    setValue: UseFormSetValue<FormData>;
}

export const LocationSection = ({
    variant,
    register,
    errors,
    setValue,
}: LocationSectionProps) => {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const handleAddressSelect = useCallback(
        (data: {
            address: string;
            city: string;
            state: string;
            latitude: number;
            longitude: number;
        }) => {
            console.log("Datos seleccionados:", data);
            setValue("address", data.address, { shouldDirty: true, shouldTouch: true });
            setValue("city", data.city, { shouldDirty: true, shouldTouch: true });
            setValue("state", data.state, { shouldDirty: true, shouldTouch: true });
            setValue("latitude", data.latitude);
            setValue("longitude", data.longitude);
        },
        [setValue]
    );

    const hasMapboxToken = Boolean(mapboxToken);

    return (
        <div className="pt-4 border-t border-border">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <Label className="text-base font-semibold">
                    Información de Ubicación
                </Label>
                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {variant === "manual" ? "Entrada Manual" : "Autocompletado"}
                </span>
            </div>

            {/* Contenido según variante */}
            {variant === "manual" ? (
                <div className="space-y-4">
                    {/* Campo Dirección */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección *</Label>
                        <Input
                            id="address"
                            placeholder="Calle 123 # 45-67"
                            autoComplete="address-line1"
                            {...register("address")}
                            className="transition-smooth"
                        />
                        {errors.address && (
                            <p className="text-sm text-destructive">
                                {errors.address.message}
                            </p>
                        )}
                    </div>

                    {/* Campos Ciudad y Departamento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">Ciudad *</Label>
                            <Input
                                id="city"
                                placeholder="Bogotá"
                                autoComplete="address-level2"
                                {...register("city")}
                                className="transition-smooth"
                            />
                            {errors.city && (
                                <p className="text-sm text-destructive">
                                    {errors.city.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="state">Departamento *</Label>
                            <Input
                                id="state"
                                placeholder="Cundinamarca"
                                autoComplete="address-level1"
                                {...register("state")}
                                className="transition-smooth"
                            />
                            {errors.state && (
                                <p className="text-sm text-destructive">
                                    {errors.state.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {!hasMapboxToken ? (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                            Error: Token de Mapbox no configurado.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Campo Dirección (Sincronizado con el mapa) */}
                            <div className="space-y-2">
                                <Label htmlFor="mapbox-address">Dirección *</Label>
                                <Input
                                    id="mapbox-address"
                                    placeholder="Ingrese su dirección en el mapa"
                                    {...register("address")}
                                    className="bg-muted/50"
                                    readOnly
                                />
                                {errors.address && (
                                    <p className="text-sm text-destructive">
                                        {errors.address.message}
                                    </p>
                                )}
                            </div>

                            <MapboxAddressInput
                                onAddressSelect={handleAddressSelect}
                                mapboxToken={mapboxToken}
                            />

                            {/* Campos para ciudad y estado (autocompletados por Mapbox) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mapbox-city">Ciudad *</Label>
                                    <Input
                                        id="mapbox-city"
                                        {...register("city")}
                                        className="bg-muted/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mapbox-state">Departamento *</Label>
                                    <Input
                                        id="mapbox-state"
                                        {...register("state")}
                                        className="bg-muted/50"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};