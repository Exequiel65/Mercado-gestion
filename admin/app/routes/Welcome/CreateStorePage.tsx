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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { post } from "~/services/apiService";
export const createStoreSchema = z.object({
    name: z.string().min(2, "Nombre requerido"),
    description: z.string().min(2, "Descripción requerida"),
    address: z.string().min(2, "Dirección requerida"),
    phoneNumber: z.string().min(7, "Teléfono requerido"),
    email: z.string().email("Email inválido"),
});




type FormValues = z.infer<typeof createStoreSchema>;

export default function CreateStorePage() {
    const navigate = useNavigate();
    const form = useForm<FormValues>({
        resolver: zodResolver(createStoreSchema),
        defaultValues: {
            name: "",
            description: "",
            address: "",
            phoneNumber: "",
            email: "",
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            var result = await post<FormValues, boolean>({path: "store", data, token: sessionStorage.getItem("token")});
            if (result.success) {
                navigate("/validate");
            }
        } catch (error) {
            console.error("Error creating store:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted px-4">
            <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Crear Sucursal</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre de la sucursal" {...field} />
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

                        <Button type="submit" className="w-full mt-4">
                            Crear Sucursal
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}