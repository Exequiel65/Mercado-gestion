import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { post } from "~/services/apiService";


export const socialMediaSchema = z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
});

export const createOrganizationSchema = z.object({
    name: z.string().min(2, "Nombre requerido"),
    description: z.string().min(2, "Descripción requerida"),
    address: z.string().min(2, "Dirección requerida"),
    phoneNumber: z.string().min(7, "Teléfono requerido"),
    email: z.string().email("Email inválido"),
    googleMapsUrl: z.string().url("URL inválida").optional(),
    logoUrl: z.string().optional(),
    iconUrl: z.string().optional(),
    legendUrl: z.string().optional(),
    socialMediaId: z.number().int().optional(),
    socialMedia: socialMediaSchema.optional(),
});
type FormValues = z.infer<typeof createOrganizationSchema>;

export default function CreateOrganizationPage() {
    const navigation = useNavigate();
    const form = useForm<FormValues>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: {
            name: "",
            description: "",
            address: "",
            phoneNumber: "",
            email: "",
            googleMapsUrl: "",
            logoUrl: "",
            iconUrl: "",
            socialMedia: {
                instagram: "",
                facebook: "",
                twitter: ""
            }
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            var response = await post<FormValues, boolean>({ path: "business", data, token: sessionStorage.getItem("token") });
            if (response.success) {
                navigation("/create-store");
            } else {
                form.setError("root", { type: "manual", message: response.message });
            }

        } catch (error) {
            console.error("Error al crear la organización:", error);
            form.setError("root", { type: "manual", message: "Error al crear la organización" });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted px-4">
            <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Crear Organización</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/** Repetir FormField para cada campo, ejemplo: */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre de la organización" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Descripción" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dirección" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Teléfono" {...field} />
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
                                        <Input type="email" placeholder="email@ejemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="googleMapsUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Google Maps URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://maps.google.com/..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="socialMedia.twitter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Twitter</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="@twitter"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="socialMedia.facebook"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Facebook</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="facebook.com/tuempresa"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="socialMedia.instagram"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instagram</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="@instagram"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logoUrl"
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-2">
                                    <FormLabel>Logo:</FormLabel>
                                    {field.value && (
                                        <div className="w-32 h-32 overflow-hidden rounded-full border">
                                            <img
                                                src={field.value}
                                                alt="avatar"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                const base64 = reader.result?.toString() || "";
                                                field.onChange(base64);
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="iconUrl"
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-2">
                                    <FormLabel>Icono:</FormLabel>
                                    {field.value && (
                                        <div className="w-32 h-32 overflow-hidden rounded-full border">
                                            <img
                                                src={field.value}
                                                alt="avatar"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                const base64 = reader.result?.toString() || "";
                                                field.onChange(base64);
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <Button type="submit" className="w-full mt-4">
                            Crear Organización
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}