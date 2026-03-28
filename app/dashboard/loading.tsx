import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardLoading() {
    return (
        <div className="space-y-6 sm:space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Hero Skeleton */}
            <div className="rounded-2xl sm:rounded-3xl border border-white/5 bg-black/40 p-5 sm:p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-3 w-full md:w-auto">
                        <Skeleton className="h-3 w-48" />
                        <Skeleton className="h-12 sm:h-16 w-64 sm:w-80" />
                        <Skeleton className="h-8 w-56 rounded-full" />
                    </div>
                    <div className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 w-full md:w-auto">
                        <div className="text-center space-y-2 flex-1">
                            <Skeleton className="h-3 w-16 mx-auto" />
                            <Skeleton className="h-12 w-20 mx-auto" />
                        </div>
                        <div className="w-px bg-white/10 self-stretch" />
                        <div className="text-center space-y-2 flex-1">
                            <Skeleton className="h-3 w-16 mx-auto" />
                            <Skeleton className="h-12 w-20 mx-auto" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-white/5 bg-black/20 overflow-hidden">
                        <div className="h-[2px] skeleton" />
                        <CardHeader className="pb-2 pt-4">
                            <Skeleton className="h-3 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-2 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-12">
                <Card className="lg:col-span-8 border-white/5 bg-black/20">
                    <CardHeader>
                        <Skeleton className="h-5 w-36" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                                <div className="space-y-2 flex-1 min-w-0">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-white/5 bg-black/20">
                        <CardHeader><Skeleton className="h-5 w-28" /></CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <Skeleton className="h-44 w-44 rounded-full" />
                            <Skeleton className="h-10 w-32 rounded-xl" />
                        </CardContent>
                    </Card>
                    <Card className="border-white/5 bg-black/20">
                        <CardHeader><Skeleton className="h-5 w-28" /></CardHeader>
                        <CardContent className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-2 w-2 rounded-full" />
                                    <Skeleton className="h-4 flex-1" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
