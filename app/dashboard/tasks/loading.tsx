import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function TasksLoading() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="flex gap-4 mb-8">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
            </div>

            <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="border-white/5 bg-black/20">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                <Skeleton className="h-6 w-6 rounded-md" />
                                <div className="space-y-1 flex-1">
                                    <Skeleton className="h-5 w-1/4" />
                                    <Skeleton className="h-3 w-1/6" />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
