import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormData } from "@/lib/schemas";

interface PersonalDetailsSectionProps {
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
    setValue: (name: keyof FormData, value: any) => void;
}

export const PersonalDetailsSection = ({
    register,
    errors,
    setValue,
}: PersonalDetailsSectionProps) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                    id="fullName"
                    placeholder="Dr. Juan Pérez"
                    {...register("fullName")}
                    className="transition-smooth"
                />
                {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="whatsapp">Número de WhatsApp *</Label>
                <Input
                    id="whatsapp"
                    placeholder="+57 300 123 4567"
                    {...register("whatsapp")}
                    className="transition-smooth"
                />
                {errors.whatsapp && (
                    <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="businessName">Nombre del Negocio *</Label>
                <Input
                    id="businessName"
                    placeholder="Centro Médico Pérez"
                    {...register("businessName")}
                    className="transition-smooth"
                />
                {errors.businessName && (
                    <p className="text-sm text-destructive">
                        {errors.businessName.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad *</Label>
                <Select
                    onValueChange={(value) =>
                        setValue(
                            "specialty",
                            value as "dentistry" | "veterinary" | "general" | "aesthetics",
                        )
                    }
                >
                    <SelectTrigger className="transition-smooth">
                        <SelectValue placeholder="Selecciona tu especialidad" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                        <SelectItem value="dentistry">Odontología</SelectItem>
                        <SelectItem value="veterinary">Veterinaria</SelectItem>
                        <SelectItem value="general">Medicina General</SelectItem>
                        <SelectItem value="aesthetics">Estética</SelectItem>
                    </SelectContent>
                </Select>
                {errors.specialty && (
                    <p className="text-sm text-destructive">{errors.specialty.message}</p>
                )}
            </div>
        </div>
    );
};
