import { login, signup } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap } from "lucide-react";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
            <div className="mb-8 text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/50">
                    <Zap className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight neon-text">NEXUS OS</h1>
                <p className="text-muted-foreground">Personal AI Operating System</p>
            </div>

            <Card className="w-full max-w-md border-primary/20 bg-card/40 backdrop-blur">
                {params?.error && (
                    <div className="p-3 mb-2 text-sm text-center text-red-500 bg-red-500/10 rounded-t-lg border-b border-red-500/20">
                        {params.error}
                    </div>
                )}
                <Tabs defaultValue="login" className="w-full">
                    <CardHeader>
                        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                    </CardHeader>
                    <CardContent>
                        <TabsContent value="login">
                            <form action={login} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input name="email" type="email" placeholder="commander@nexus.ai" required className="bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <Input name="password" type="password" required className="bg-background/50" />
                                </div>
                                <Button type="submit" className="w-full">Access Command Center</Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form action={signup} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input name="full_name" type="text" placeholder="John Doe" className="bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input name="email" type="email" placeholder="commander@nexus.ai" required className="bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <Input name="password" type="password" required className="bg-background/50" minLength={6} />
                                </div>
                                <Button type="submit" variant="secondary" className="w-full">Initialize New System</Button>
                            </form>
                        </TabsContent>
                    </CardContent>
                </Tabs>
            </Card>
        </div>
    );
}
