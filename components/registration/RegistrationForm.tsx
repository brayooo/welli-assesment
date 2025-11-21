"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { User } from "lucide-react";
import { useABTest } from "@/hooks/useABTest";
import { formSchema, FormData } from "@/lib/schemas";
import { PersonalDetailsSection } from "./PersonalDetailsSection";
import { LocationSection } from "./LocationSection";
import { Spinner } from "@/components/ui/spinner";
import { submitLead } from "@/app/actions";

const RegistrationForm = () => {
  const variant = useABTest();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {

    const variantCode = variant === "manual" ? "A" : "B";
    const result = await submitLead({ ...data, variant_shown: variantCode });

    if (result.success) {
      toast.success("¡Registro enviado exitosamente!", {
        description: `Pronto estaremos en contacto con usted`,
      });
    } else {
      toast.error("Error al enviar el registro", {
        description: result.error,
      });
    }
  };

  if (variant === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-secondary/10 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-muted-foreground">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Registro Profesional
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Completa tu perfil para comenzar con nuestra plataforma de salud
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <PersonalDetailsSection
              register={register}
              errors={errors}
              setValue={setValue}
            />

            <LocationSection
              variant={variant}
              register={register}
              errors={errors}
              setValue={setValue}
            />

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold transition-smooth hover:shadow-elegant"
            >
              Completar Registro
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
