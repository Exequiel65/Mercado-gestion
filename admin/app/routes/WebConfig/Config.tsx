import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage, Form } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Switch } from '~/components/ui/switch';
import { Textarea } from '~/components/ui/textarea';
import { formatPrice, parsePrice } from '~/lib/utils';
import { get, post } from '~/services/apiService';
import { useAuthStore } from '~/store/auth-store';

export const configSchema = z.object({
    id: z.number(),
    cart: z.object({
        hasPaymentMethod: z.boolean(),
        redirectToWsp: z.boolean(),
        hasApplyCoupon: z.boolean(),
    }),
    shipping: z.object({
        enabledShipping: z.boolean(),
        hasFreeShipping: z.boolean(),
        freeShippingAmount: z.number(),
        titleShipping: z.string(),
        descriptionShipping: z.string(),
    }),
    devolution: z.object({
        enabledDevolution: z.boolean(),
        devolutionDays: z.number(),
        titleDevolution: z.string(),
        descriptionDevolution: z.string(),
    }),
    hasSubscription: z.boolean(),
    isMaintenance: z.boolean(),
    enabledWeb: z.boolean(),
    paymentType: z.enum(['redirectToWsp', 'hasPaymentMethod'])
});

export type ConfigType = z.infer<typeof configSchema>;


export function meta() {
    return [
        { title: "Configuración de tu tienda online" }
    ]
}


export default function Config() {
    const [HasEdit, setHasEdit] = useState<boolean>(false);
    const token = useAuthStore(s => s.token);
    const form = useForm<ConfigType>({
        resolver: zodResolver(configSchema),
        defaultValues: {
            id: 0,
            paymentType: 'redirectToWsp',
            cart: {
                hasApplyCoupon: false,
                hasPaymentMethod: false,
                redirectToWsp: false
            },
            devolution: {
                descriptionDevolution: "",
                devolutionDays: 0,
                enabledDevolution: false,
                titleDevolution: ""
            },
            enabledWeb: false,
            hasSubscription: false,
            isMaintenance: true,
            shipping: {
                descriptionShipping: "",
                enabledShipping: false,
                freeShippingAmount: 0,
                hasFreeShipping: false,
                titleShipping: "",
            }
        }
    })

    const getData = async () => {
        var result = await get<ConfigType>({ path: "webConfig", token: token })
        if (result.success) {
            form.reset({
                ...result.data,
                paymentType: result.data.cart.hasPaymentMethod ? "hasPaymentMethod" : "redirectToWsp"
            })
        }
    }
    const onSubmit = async (data: ConfigType) => {
        const cart = {
            ...data.cart,
            hasPaymentMethod: data.paymentType === 'hasPaymentMethod',
            redirectToWsp: data.paymentType === 'redirectToWsp',
        }
        const payload = {
            ...data,
            cart,
        }
        try {
            const res = await post<any, any>({
                path: `webconfig`,
                data: {
                    ...payload,
                    ...payload.cart,
                    ...payload.devolution,
                    ...payload.shipping
                },
                token: token
            })
            if (res.success)
                toast.success(`Configuración web actualizad correctamente`)
                await getData();
        } catch (error) {
            toast.error(`Ocurrió un error al actualizar la configuración web`)
        }
    };

    useEffect(() => {
        getData()
    }, [form])

    return (
        <div className="flex flex-col gap-4 p-6">
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Tienda Online</h1>
                            <p className="text-muted-foreground text-sm">Gestioná la configuración de tu web.</p>
                        </div>
                        <div>
                            {HasEdit ? (
                                <div>
                                    <Button variant="secondary" className='mx-2' onClick={() => setHasEdit(!HasEdit)}>
                                        Cancelar
                                    </Button>
                                    <Button type='submit'>
                                        Guardar
                                    </Button>

                                </div>

                            ) : (
                                <Button onClick={() => setHasEdit(!HasEdit)}>
                                    Editar
                                </Button>
                            )}

                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className='grid lg:grid-cols-1 gap-4 sm:grid-cols-1'>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="enabledWeb"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Web</FormLabel>
                                            <div className='flex flex-row items-center p-1'>
                                                <p>Desactivada</p>
                                                <Switch disabled={!HasEdit} className='mx-2' onCheckedChange={field.onChange} checked={field.value} />
                                                <p>Activada</p>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name='isMaintenance'
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>En mantención</FormLabel>
                                            <div className='flex flex-row items-center p-1'>
                                                <p>No</p>
                                                <Switch disabled={!HasEdit} className='mx-2' onCheckedChange={field.onChange} checked={field.value} />
                                                <p>Si</p>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 mt-4">
                        <hr></hr>
                        <div>
                            <h1 className="text-1xl font-bold tracking-tight">Carro de compras</h1>
                            <p className="text-muted-foreground text-sm">Gestioná la configuración del carrito de compras de la web.</p>
                        </div>
                        <div className='grid lg:grid-cols-2 gap-4 sm:grid-cols-2'>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="cart.hasApplyCoupon"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Habilitar cupones de descuento?</FormLabel>
                                            <div className='flex flex-row items-center p-1'>
                                                <p>No</p>
                                                <Switch disabled={!HasEdit} className='mx-2' onCheckedChange={field.onChange} checked={field.value} />
                                                <p>Si</p>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-'>
                                <FormField
                                    control={form.control}
                                    name='paymentType'
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de pago</FormLabel>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                disabled={!HasEdit}
                                                value={field.value}
                                                className='flex flex-col'
                                            >
                                                <FormItem className='flex'>
                                                    <RadioGroupItem value="redirectToWsp" />
                                                    <FormLabel className='font-normal'>Continuar por WhatsApp</FormLabel>
                                                </FormItem>
                                                <FormItem className='flex'>
                                                    <RadioGroupItem value="hasPaymentMethod" />
                                                    <FormLabel className='font-normal'>Habilitar pago online</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 mt-4">
                        <hr></hr>
                        <div>
                            <h1 className="text-1xl font-bold tracking-tight">Envios</h1>
                            <p className="text-muted-foreground text-sm">Gestioná la configuración de los enviós</p>
                        </div>
                        <div className='grid lg:grid-cols-3 gap-4 sm:grid-cols-2'>
                            <div className='col-span-3'>
                                <FormField
                                    control={form.control}
                                    name="shipping.enabledShipping"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Habilitar enviós?</FormLabel>
                                            <div className='flex flex-row items-center p-1'>
                                                <p>No</p>
                                                <Switch disabled={!HasEdit} className='mx-2' onCheckedChange={field.onChange} checked={field.value} />
                                                <p>Si</p>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="shipping.hasFreeShipping"
                                    disabled={!HasEdit && !form.getValues().shipping.enabledShipping}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Habilitar enviós gratis?</FormLabel>
                                            <div className='flex flex-row items-center p-1'>
                                                <p>No</p>
                                                <Switch disabled={!HasEdit} className='mx-2' onCheckedChange={field.onChange} checked={field.value} />
                                                <p>Si</p>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="shipping.freeShippingAmount"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-64'>
                                            <FormLabel>Monto minimo</FormLabel>
                                            <Input placeholder='$5000' type='text'  {...field}
                                                {...field}
                                                onChange={(e) => {
                                                    const parsed = parsePrice(e.target.value)
                                                    field.onChange(parsed)
                                                }} value={formatPrice(field.value) ?? ""} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-2'>
                                <FormField
                                    control={form.control}
                                    name="shipping.titleShipping"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Titulo</FormLabel>
                                            <Input placeholder='Titulo' {...field} value={field.value ?? ''} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-3'>
                                <FormField
                                    control={form.control}
                                    name="shipping.descriptionShipping"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Descripción</FormLabel>
                                            <Textarea placeholder='Descripción' {...field} value={field.value ?? ''} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 mt-4">
                        <hr></hr>
                        <div>
                            <h1 className="text-1xl font-bold tracking-tight">Devoluciones</h1>
                            <p className="text-muted-foreground text-sm">Gestioná la configuración de las devoluciones</p>
                        </div>
                        <div className='grid lg:grid-cols-3 gap-4 sm:grid-cols-1'>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="devolution.enabledDevolution"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Habilitar devoluciones?</FormLabel>
                                            <div className='flex flex-row items-center p-1'>
                                                <p>No</p>
                                                <Switch disabled={!HasEdit} className='mx-2' onCheckedChange={field.onChange} checked={field.value} />
                                                <p>Si</p>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="devolution.devolutionDays"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-64'>
                                            <FormLabel>Plazo de devolución (días)</FormLabel>
                                            <Input placeholder='30' type='number' {...field} value={field.value ?? 0} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-2'>
                                <FormField
                                    control={form.control}
                                    name="devolution.titleDevolution"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Titulo</FormLabel>
                                            <Input placeholder='Titulo' {...field} value={field.value ?? ''} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-3'>
                                <FormField
                                    control={form.control}
                                    name="devolution.descriptionDevolution"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Descripción</FormLabel>
                                            <Textarea placeholder='Descripción' {...field} value={field.value ?? ''} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </form>

            </Form>
        </div>
    )
}
