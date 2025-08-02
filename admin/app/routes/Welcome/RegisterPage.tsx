import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { post } from "~/services/apiService";

const registerSchema = z
    .object({
        name: z.string().min(2, "Nombre requerido"),
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "Mínimo 6 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const navigate = useNavigate();
    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterValues) => {
        try {
            let response = await post<RegisterValues, string>({path: "auth/register", data})
            if (response.success) {
                sessionStorage.setItem("token", response.data)
                navigate("/create-organization")
            }
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Crear cuenta
                </h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tu nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="tu@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Registrarse
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
