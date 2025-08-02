import { GalleryVerticalEnd } from "lucide-react"
import { useForm } from "react-hook-form"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useAuthStore } from "~/store/auth-store"
import { useNavigate } from "react-router"
import { useState } from "react"
import { post } from "~/services/apiService"
import { useEntityStore } from "~/store/entity-store"


interface LoginFormInputs {
    email: string
    password: string
}

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const entity = useEntityStore(s => s.entity)
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>()
    const setToken = useAuthStore(state => state.login)
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    async function onSubmit(data: LoginFormInputs) {
        setError(null)
        try {
            const json = await post<{ email: string; password: string }, string>({
                path: "auth/login",
                data
            })
            setToken(json.data, null)  // Si tu setToken acepta un segundo parámetro
            navigate("/admin")
        } catch (err: any) {
            console.error(err.response.data)
            setError(err?.response?.data.message || err.message || "Error en login")
        }
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        {/* <a
                            href="#"
                            className="flex flex-col items-center gap-2 font-medium"
                        > */}
                            <div className="flex w-36 items-center justify-center rounded-md">
                                <img 
                                    src="/logo3-removebg-preview.png"
                                    alt="MSB Studio tech"
                                />
                            </div>
                            {/* <span className="sr-only">Acme Inc.</span>
                        </a> */}
                        <h1 className="text-xl font-bold">{entity?.name}.</h1>
                        {/* <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="#" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div> */}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register("email", { required: "Email es obligatorio" })}
                                autoComplete="username"
                            />
                        </div>
                        <div className="min-h-[1.25rem]">
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password", { required: "La contraseña es obligatoria" })}
                                autoComplete="password"
                            />
                        </div>
                        <div className="min-h-[1.25rem]">
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password.message}</p>
                            )}
                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full mt-2">
                            Login
                        </Button>
                    </div>
                </div>
            </form>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
