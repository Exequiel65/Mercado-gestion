import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import BannerForm from './Design/BannerForm'
import SectionForm from './Design/SectionForm'
import BannerGridForm from './Design/BannerGridForm'

export default function Design() {
    return (
        <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Diseño</h1>
                    <p className="text-muted-foreground text-sm">Gestioná las secciones principales de tu pagina web.</p>
                </div>
            </div>
            <div>
                <Tabs defaultValue={'banner'}>
                    <TabsList  className="grid w-full grid-cols-3 bg-gray-50">
                        <TabsTrigger value='banner' style={{borderRadius: "10px 10px 0px 0px"}}>Banner</TabsTrigger>
                        <TabsTrigger value='sections' style={{borderRadius: "10px 10px 0px 0px"}}>Secciones</TabsTrigger>
                        <TabsTrigger value='bannerGrid' style={{borderRadius: "10px 10px 0px 0px"}}>Grilla</TabsTrigger>
                    </TabsList>
                    <TabsContent value='banner' asChild>
                        <BannerForm />
                    </TabsContent>
                    <TabsContent value='sections' asChild>
                        <SectionForm />
                    </TabsContent>
                    <TabsContent value='bannerGrid' asChild>
                        <BannerGridForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
