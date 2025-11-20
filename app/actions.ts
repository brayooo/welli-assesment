"use server";

import { supabase } from "@/lib/supabase";
import { formSchema, FormData } from "@/lib/schemas";
import { randomUUID } from "crypto";


export async function submitLead(data: FormData & { variant_shown: string }) {
    const result = formSchema.safeParse(data);

    if (!result.success) {
        return { success: false, error: "Datos inválidos" };
    }

    const { fullName, whatsapp, specialty, address, city, state, latitude, longitude, variant_shown } = data;

    const address_json = {
        address,
        city,
        department: state,
        lat: latitude || 0,
        lng: longitude || 0,
    };
    const lead_id = randomUUID();

    try {
        const { error } = await supabase.from("leads").insert([
            {
                lead_id,
                nombre: fullName,
                whatsapp,
                especialidad: specialty,
                variant_shown,
                address_json,
            },
        ]);

        if (error) {
            console.error("Error inserting lead:", error);
            return { success: false, error: "Error al guardar en la base de datos" };
        }
        return { success: true };
    } catch (error) {
        console.error("Unexpected error:", error);
        return { success: false, error: "Error inesperado" };
    }
}
