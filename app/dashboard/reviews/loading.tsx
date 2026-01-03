import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ReviewsLoading() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="space-y-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="border-white/5 bg-black/20 h-fit">
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-40" />
                            <div className="flex gap-4 items-center">
                                <Skeleton className="h-2 flex-1" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-40 w-full rounded-xl" />
                        </div>
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-20 w-full rounded-lg" />
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <Skeleton className="h-4 w-24" />
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="border-white/5 bg-black/20">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-6 w-12 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
