import * as z from "zod";

export const formSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  whatsapp: z.string().min(10, "Por favor ingrese un número de WhatsApp válido").max(20),
  businessName: z.string().min(2, "El nombre del negocio es requerido").max(100),
  specialty: z
    .enum(["dentistry", "veterinary", "general", "aesthetics"])
    .refine((val) => val !== undefined, {
      message: "Por favor seleccione una especialidad",
    }),
  address: z.string().min(5, "La dirección es requerida").max(200),
  city: z.string().min(2, "La ciudad es requerida").max(100),
  state: z.string().min(2, "El departamento es requerido").max(100),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type FormData = z.infer<typeof formSchema>;
