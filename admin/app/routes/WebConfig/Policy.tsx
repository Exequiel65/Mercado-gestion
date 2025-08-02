import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { z } from 'zod';
import RichTextEditor from '~/components/RichText/RichTextEditor';
import { Button } from '~/components/ui/button';
import { get, post } from '~/services/apiService';
import { useAuthStore } from '~/store/auth-store';

const policySchema = z.object({
    id: z.number(),
    description: z.string().nullable()
})

type policy = z.infer<typeof policySchema>;


export function meta(){
  return [
    {title: "Política de privacidad"}
  ]
}


export default function Policy() {
    const [HasEdit, setHasEdit] = useState<boolean>(false);
    const [html, setHtml] = useState("")
    const [Id, setId] = useState(0)
    const token = useAuthStore(s => s.token);
    const getData = async () =>{
        var data = await get<policy>({path : "webconfig/privacy-policy", token})
        if (data.success){
            setHtml(data.data.description ?? "")
        }
    }

    const handleSave = async () => {
        const result = await post<policy, boolean>({path: "webconfig/privacy-policy", token, data :{
            id: Id,
            description : html
        }})

        if (result.success && result.data) {
            toast.success("Políticas guardadas correctamentes")
            return;
        }

        toast.error("Hubo un error al guardar las políticas")
    }

    useEffect(() => {
        getData()
    }, [])
    
    return (
        <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Política de privacidad</h1>
                </div>
                <div>
                    {HasEdit ? (
                        <div>
                            <Button variant="secondary" className='mx-2' onClick={() => setHasEdit(!HasEdit)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave}>
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
            <div className='space-y-4'>
                 <RichTextEditor value={html} onChange={setHtml} disabled={!HasEdit} />
            </div>
        </div>
    )
}
